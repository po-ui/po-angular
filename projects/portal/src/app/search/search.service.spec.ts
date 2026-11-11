import { TestBed } from '@angular/core/testing';

import { SearchAnalyticsService, SearchEvent } from './search-analytics.service';
import { SearchChunk, SearchManifest } from './search.model';
import { SearchService } from './search.service';

const manifest: SearchManifest = {
  version: 1,
  chunks: {
    core: { file: 'search-core.aaaa1111.json', count: 3, bytes: 1 },
    api: { file: 'search-api.bbbb2222.json', count: 3, bytes: 1 },
    icons: { file: 'search-icons.cccc3333.json', count: 2, bytes: 1 }
  }
};

const core: SearchChunk = {
  pages: [
    { name: 'PoButton', url: '/documentation/po-button?view=doc', component: 'po-button', package: 'components' },
    { name: 'Primeiros passos', url: '/guides/getting-started' }
  ],
  docs: [
    {
      id: 'po-button',
      type: 'componente',
      title: 'PoButton',
      page: 0,
      text: 'O po-button permite executar ações predefinidas.'
    },
    {
      id: 'guia:getting-started#instalacao',
      type: 'guia',
      title: 'Instalação do botão',
      page: 1,
      fragment: 'instalacao',
      text: 'Rode ng add para instalar o botão.'
    }
  ]
};

const api: SearchChunk = {
  pages: [core.pages[0]],
  docs: [
    {
      id: 'po-button#p-kind',
      type: 'propriedade',
      title: 'po-button › p-kind',
      page: 0,
      section: 'PoButtonComponent',
      fragment: 'p-kind',
      text: 'Define o estilo visual do botão.'
    },
    {
      id: 'po-button#p-label',
      type: 'propriedade',
      title: 'po-button › p-label',
      page: 0,
      fragment: 'p-label',
      text: 'Label do botão.'
    }
  ]
};

const icons: SearchChunk = {
  pages: [{ name: 'Ícones', url: '/icons' }],
  docs: [{ id: 'icone:arrow-left', type: 'icone', title: 'arrow-left', page: 0, text: 'an an-arrow-left' }]
};

describe('SearchService', () => {
  let service: SearchService;
  let events: Array<SearchEvent>;
  let fetchSpy: jasmine.Spy;
  let failApi: boolean;

  beforeEach(() => {
    events = [];
    failApi = false;
    TestBed.configureTestingModule({
      providers: [{ provide: SearchAnalyticsService, useValue: { track: (e: SearchEvent) => events.push(e) } }]
    });
    service = TestBed.inject(SearchService);

    const body: Record<string, unknown> = {
      'assets/json/search-manifest.json': manifest,
      'assets/json/search-core.aaaa1111.json': core,
      'assets/json/search-api.bbbb2222.json': api,
      'assets/json/search-icons.cccc3333.json': icons
    };

    fetchSpy = spyOn(window, 'fetch').and.callFake((url: RequestInfo | URL) => {
      const key = String(url);
      const missing = !(key in body) || (failApi && key.includes('search-api'));

      return Promise.resolve({
        ok: !missing,
        status: missing ? 500 : 200,
        json: () => Promise.resolve(body[key])
      } as Response);
    });
  });

  it('carrega o manifest sem cache e os chunks com hash, e fica pronto', async () => {
    await service.load();

    expect(fetchSpy.calls.argsFor(0)).toEqual(['assets/json/search-manifest.json', { cache: 'no-cache' }]);
    expect(fetchSpy.calls.allArgs().map(a => a[0])).toContain('assets/json/search-api.bbbb2222.json');
    expect(service.status()).toBe('ready');
    expect(service.pending()).toBeFalse();
  });

  it('só chama a rede uma vez por carregamento', async () => {
    await Promise.all([service.load(), service.load()]);

    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('devolve vazio para consulta curta ou antes de carregar', async () => {
    expect(service.search('button')).toEqual([]);
    await service.load();
    expect(service.search('b')).toEqual([]);
  });

  it('componente vence propriedade para o mesmo termo e traz página e trecho com destaque', async () => {
    await service.load();
    const results = service.search('button');

    expect(results[0].id).toBe('po-button');
    expect(results[0].page).toBe('PoButton');
    expect(results.find(r => r.id === 'po-button#p-kind')?.section).toBe('PoButtonComponent');
    expect(results[0].excerpt.some(p => p.mark)).toBeTrue();
  });

  it('nome exato de propriedade sobe ao topo e carrega o fragmento', async () => {
    await service.load();
    const [first] = service.search('p-kind');

    expect(first.id).toBe('po-button#p-kind');
    expect(first.fragment).toBe('p-kind');
    expect(first.url).toBe('/documentation/po-button?view=doc');
  });

  it('ignora acento e caixa na consulta', async () => {
    await service.load();

    expect(service.search('INSTALACAO').map(r => r.id)).toContain('guia:getting-started#instalacao');
    expect(service.search('botão').length).toBeGreaterThan(0);
  });

  it('ícones só entram com 3+ caracteres e depois de carregar o chunk', async () => {
    await service.load();

    expect(service.search('ar').some(r => r.type === 'icone')).toBeFalse();
    service.search('arrow');
    await service.loadIcons();
    expect(service.search('arrow').map(r => r.id)).toEqual(['icone:arrow-left']);
  });

  it('sem resultado devolve lista vazia', async () => {
    await service.load();

    expect(service.search('xyzxyz')).toEqual([]);
  });

  it('falha no chunk core vira erro, registra o gancho e permite tentar de novo', async () => {
    fetchSpy.and.returnValue(Promise.resolve({ ok: false, status: 503, json: () => Promise.resolve({}) } as Response));
    await service.load();

    expect(service.status()).toBe('error');
    expect(events[0]).toEqual({ name: 'search_index_error', chunk: 'core', status: 503 });

    fetchSpy.and.callThrough();
    await service.retry().catch(() => undefined);
    expect(fetchSpy.calls.count()).toBeGreaterThan(1);
  });

  it('falha só no chunk api mantém a busca com resultados parciais', async () => {
    failApi = true;
    await service.load();

    expect(service.status()).toBe('ready');
    expect(service.pending()).toBeFalse();
    expect(events.some(e => e.name === 'search_index_error' && e.chunk === 'api')).toBeTrue();
    expect(service.search('button')[0].id).toBe('po-button');
  });
});

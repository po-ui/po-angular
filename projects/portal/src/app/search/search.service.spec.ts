import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SearchAnalyticsService, SearchEvent } from './search-analytics.service';
import { SEARCH_DEBOUNCE_MS, SearchChunk, SearchManifest } from './search.model';
import { SearchService } from './search.service';

const manifest: SearchManifest = {
  version: 1,
  chunks: {
    core: { file: 'search-core.aaaa1111.json', count: 3, bytes: 1 },
    api: { file: 'search-api.bbbb2222.json', count: 3, bytes: 1 },
    icons: { file: 'search-icons.cccc3333.json', count: 2, bytes: 1 },
    samples: { file: 'search-samples.dddd4444.json', count: 1, bytes: 1 }
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
      id: 'po-button#prop-p-kind',
      type: 'propriedade',
      title: 'po-button › p-kind',
      page: 0,
      section: 'PoButtonComponent',
      fragment: 'prop-p-kind',
      text: 'Define o estilo visual do botão.'
    },
    {
      id: 'po-button#prop-p-label',
      type: 'propriedade',
      title: 'po-button › p-label',
      page: 0,
      fragment: 'prop-p-label',
      text: 'Label do botão.'
    }
  ]
};

const samples: SearchChunk = {
  pages: [{ name: 'PoButton', url: '/documentation/po-button?view=web', component: 'po-button' }],
  docs: [
    {
      id: 'po-button#sample-po-button-labs',
      type: 'sample',
      title: 'PO Button Labs',
      page: 0,
      section: 'Exemplos',
      fragment: 'sample-po-button-labs',
      text: 'Exemplo de uso do PoButton: PO Button Labs.'
    }
  ]
};

// 12 componentes com a mesma propriedade `p-helper`, mais ruído que também cita "helper"
const helperComponents = Array.from({ length: 12 }, (_, i) => `po-field-${i}`);
const helperApi: SearchChunk = {
  pages: helperComponents.map(name => ({ name, url: `/documentation/${name}?view=doc`, component: name })),
  docs: [
    ...helperComponents.map((name, page) => ({
      id: `${name}#prop-p-helper`,
      type: 'propriedade' as const,
      title: `${name} › p-helper`,
      page,
      fragment: 'prop-p-helper',
      text: 'Exibe um ícone de ajuda adicional com o texto do po-helper.'
    })),
    {
      id: 'po-helper#prop-p-title',
      type: 'propriedade' as const,
      title: 'po-helper › p-title',
      page: 0,
      fragment: 'prop-p-title',
      text: 'Título do helper.'
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
  let apiChunk: SearchChunk;

  beforeEach(() => {
    events = [];
    failApi = false;
    apiChunk = api;
    TestBed.configureTestingModule({
      providers: [{ provide: SearchAnalyticsService, useValue: { track: (e: SearchEvent) => events.push(e) } }]
    });
    service = TestBed.inject(SearchService);

    const body: Record<string, unknown> = {
      'assets/json/search-manifest.json': manifest,
      'assets/json/search-core.aaaa1111.json': core,
      'assets/json/search-api.bbbb2222.json': null,
      'assets/json/search-icons.cccc3333.json': icons,
      'assets/json/search-samples.dddd4444.json': samples
    };

    fetchSpy = spyOn(window, 'fetch').and.callFake((url: RequestInfo | URL) => {
      const key = String(url);
      const missing = !(key in body) || (failApi && key.includes('search-api'));

      return Promise.resolve({
        ok: !missing,
        status: missing ? 500 : 200,
        json: () => Promise.resolve(key.includes('search-api') ? apiChunk : body[key])
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

    expect(fetchSpy).toHaveBeenCalledTimes(4); // manifest + core + api + samples
  });

  it('devolve vazio para consulta curta ou antes de carregar', async () => {
    expect(service.search('button')).toEqual({ results: [], total: 0, counts: {} });
    await service.load();
    expect(service.search('b')).toEqual({ results: [], total: 0, counts: {} });
  });

  it('componente vence propriedade para o mesmo termo e traz página e trecho com destaque', async () => {
    await service.load();
    const { results } = service.search('button');

    expect(results[0].id).toBe('po-button');
    expect(results[0].page).toBe('PoButton');
    expect(results.find(r => r.id === 'po-button#prop-p-kind')?.section).toBe('PoButtonComponent');
    expect(results[0].excerpt.some(p => p.mark)).toBeTrue();
  });

  it('nome exato de propriedade sobe ao topo e carrega o fragmento', async () => {
    await service.load();
    const [first] = service.search('p-kind').results;

    expect(first.id).toBe('po-button#prop-p-kind');
    expect(first.fragment).toBe('prop-p-kind');
    expect(first.url).toBe('/documentation/po-button?view=doc');
  });

  it('ignora acento e caixa na consulta', async () => {
    await service.load();

    expect(service.search('INSTALACAO').results.map(r => r.id)).toContain('guia:getting-started#instalacao');
    expect(service.search('botão').results.length).toBeGreaterThan(0);
  });

  it('ícones só entram com 3+ caracteres e depois de carregar o chunk', async () => {
    await service.load();

    expect(service.search('ar').results.some(r => r.type === 'icone')).toBeFalse();
    service.search('arrow');
    await service.loadIcons();
    expect(service.search('arrow').results.map(r => r.id)).toEqual(['icone:arrow-left']);
  });

  it('sem resultado devolve lista vazia', async () => {
    await service.load();

    expect(service.search('xyzxyz').results).toEqual([]);
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
    expect(service.search('button').results[0].id).toBe('po-button');
  });

  it('samples vêm no próprio chunk e levam direto ao sample (aba Exemplos + id)', async () => {
    await service.load();
    const sample = service.search('labs').results.find(r => r.type === 'sample');

    expect(fetchSpy.calls.allArgs().map(a => a[0])).toContain('assets/json/search-samples.dddd4444.json');
    expect(sample).toEqual(
      jasmine.objectContaining({
        title: 'PO Button Labs',
        page: 'PoButton',
        url: '/documentation/po-button?view=web',
        fragment: 'sample-po-button-labs'
      })
    );
  });

  describe('muitas ocorrências (p-helper)', () => {
    beforeEach(() => {
      apiChunk = helperApi;
    });

    it('o modal devolve TODAS as ocorrências, cada uma com seu componente e id', async () => {
      await service.load();
      const { results, total } = service.search('p-helper', 'modal');
      const occurrences = results.filter(r => r.fragment === 'prop-p-helper');

      expect(occurrences.map(r => r.id).sort()).toEqual(helperComponents.map(name => `${name}#prop-p-helper`).sort());
      expect(total).toBeGreaterThanOrEqual(helperComponents.length);
      // as ocorrências exatas vêm antes de qualquer outro resultado
      expect(results.slice(0, helperComponents.length).every(r => r.fragment === 'prop-p-helper')).toBeTrue();
    });

    it('o popover mostra só a prévia, mas informa o total para "Ver todos"', async () => {
      await service.load();
      const { results, total } = service.search('p-helper', 'popover');

      expect(results.length).toBeLessThan(helperComponents.length);
      expect(total).toBeGreaterThanOrEqual(helperComponents.length);
    });

    it('o modal mostra aos poucos e o limite pedido recorta a lista sem perder o total', async () => {
      await service.load();
      const first = service.search('p-helper', 'modal', 5);
      const all = service.search('p-helper', 'modal', 100);

      expect(first.results.length).toBe(5);
      expect(first.total).toBe(all.total);
      expect(all.results.length).toBe(all.total);
    });
  });

  describe('texto compartilhado (header e modal)', () => {
    it('setText atualiza o texto na hora e a consulta só depois do debounce', fakeAsync(() => {
      service.setText('po-but');

      expect(service.text()).toBe('po-but');
      expect(service.query()).toBe('');
      expect(service.typing()).toBeTrue();

      tick(SEARCH_DEBOUNCE_MS - 1);
      service.setText('po-butt'); // digitou de novo: reinicia a espera
      tick(SEARCH_DEBOUNCE_MS - 1);
      expect(service.query()).toBe('');

      tick(1);
      expect(service.query()).toBe('po-butt');
      expect(service.typing()).toBeFalse();
    }));

    it('limpar zera texto e consulta na hora e cancela a consulta pendente', fakeAsync(() => {
      service.setText('po-input');
      service.setText('');

      expect(service.query()).toBe('');
      tick(SEARCH_DEBOUNCE_MS);
      expect(service.query()).toBe('');
    }));
  });

  describe('filtro por tipo', () => {
    it('sem tipos escolhidos devolve todos e informa a contagem por tipo', async () => {
      await service.load();
      const { results, counts, total } = service.search('button', 'modal');

      expect(new Set(results.map(r => r.type)).size).toBeGreaterThan(1);
      expect(total).toBe(Object.values(counts).reduce((sum, n) => sum + n, 0));
      expect(counts.componente).toBe(1);
      expect(counts.propriedade).toBe(2);
    });

    it('só propriedade / só componente restringem a lista e o total, sem mexer na contagem', async () => {
      await service.load();
      const all = service.search('button', 'modal');
      const props = service.search('button', 'modal', 50, ['propriedade']);
      const comp = service.search('button', 'modal', 50, ['componente']);

      expect(props.results.every(r => r.type === 'propriedade')).toBeTrue();
      expect(props.total).toBe(2);
      expect(comp.results.map(r => r.id)).toEqual(['po-button']);
      expect(props.counts).toEqual(all.counts);
    });

    it('vários tipos somam; tipo sem resultado dá lista vazia', async () => {
      await service.load();

      expect(
        service
          .search('botao', 'modal', 50, ['guia', 'propriedade'])
          .results.map(r => r.type)
          .sort()
      ).toEqual(['guia', 'propriedade', 'propriedade']);
      expect(service.search('button', 'modal', 50, ['enum']).results).toEqual([]);
    });

    it('"mostrar mais" respeita o filtro (limite recorta a lista filtrada)', async () => {
      apiChunk = helperApi;
      await service.load();
      const filtered = service.search('p-helper', 'modal', 5, ['propriedade']);

      expect(filtered.results.length).toBe(5);
      expect(filtered.total).toBeGreaterThanOrEqual(helperComponents.length);
      expect(filtered.results.every(r => r.type === 'propriedade')).toBeTrue();
    });

    it('ícone escolhido no filtro aparece mesmo com 2 caracteres, depois de carregar o chunk', async () => {
      await service.load();
      expect(service.search('ar', 'modal', 50, ['icone']).results).toEqual([]);

      await service.ensureTypes(['icone']);

      expect(service.search('ar', 'modal', 50, ['icone']).results.map(r => r.id)).toEqual(['icone:arrow-left']);
      expect(service.search('ar', 'modal').results.some(r => r.type === 'icone')).toBeFalse();
    });

    it('ensureTypes carrega só os chunks dos tipos escolhidos', async () => {
      await service.load();
      fetchSpy.calls.reset();

      await service.ensureTypes(['guia']);
      expect(fetchSpy).not.toHaveBeenCalled();

      await service.ensureTypes(['icone', 'sample']);
      expect(fetchSpy.calls.allArgs().map(a => a[0])).toEqual(['assets/json/search-icons.cccc3333.json']);
    });
  });
});

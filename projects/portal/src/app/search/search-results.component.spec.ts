import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoModule } from '@po-ui/ng-components';

import { SearchAnalyticsService, SearchEvent } from './search-analytics.service';
import { SearchResultsComponent } from './search-results.component';
import { SearchChunk, SearchManifest } from './search.model';
import { SearchService } from './search.service';

const manifest: SearchManifest = {
  version: 1,
  chunks: { core: { file: 'search-core.11111111.json', count: 3, bytes: 1 } }
};

const core: SearchChunk = {
  pages: [{ name: 'PoButton', url: '/documentation/po-button?view=doc', component: 'po-button' }],
  docs: [
    { id: 'po-button', type: 'componente', title: 'PoButton', page: 0, text: 'Botão com vários estilos.' },
    {
      id: 'po-button#prop-p-kind',
      type: 'propriedade',
      title: 'po-button › p-kind',
      page: 0,
      section: 'PoButtonComponent',
      fragment: 'prop-p-kind',
      text: 'Estilo visual do botão.'
    },
    ...Array.from({ length: 60 }, (_, i) => ({
      id: `comp-${i}#prop-p-helper`,
      type: 'propriedade' as const,
      title: `comp-${i} › p-helper`,
      page: 0,
      fragment: 'prop-p-helper',
      text: 'Ajuda.'
    }))
  ]
};

describe('SearchResultsComponent', () => {
  let fixture: ComponentFixture<SearchResultsComponent>;
  let events: Array<SearchEvent>;
  let service: SearchService;

  const root = () => fixture.nativeElement as HTMLElement;
  const setQuery = async (query: string) => {
    fixture.componentRef.setInput('query', query);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    events = [];
    spyOn(window, 'fetch').and.callFake((url: RequestInfo | URL) => {
      const body = String(url).includes('manifest') ? manifest : core;

      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) } as Response);
    });
    await TestBed.configureTestingModule({
      declarations: [SearchResultsComponent],
      imports: [PoModule],
      providers: [{ provide: SearchAnalyticsService, useValue: { track: (e: SearchEvent) => events.push(e) } }]
    }).compileComponents();

    service = TestBed.inject(SearchService);
    fixture = TestBed.createComponent(SearchResultsComponent);
    fixture.detectChanges();
  });

  it('consulta curta mostra a dica e anuncia nada', async () => {
    await setQuery('b');

    expect(root().textContent).toContain('ao menos 2 caracteres');
    expect(root().querySelector('[aria-live="polite"]').textContent.trim()).toBe('');
  });

  it('mostra página, seção e o trecho com <mark>, anunciando a quantidade', async () => {
    await service.load();
    await setQuery('botao');

    const items = root().querySelectorAll('.po-list-view-item-wrapper');

    expect(items.length).toBe(2);
    expect(root().querySelector('.search-hit-page-name').textContent).toBe('PoButton');
    expect(root().querySelector('.search-hit-excerpt mark').textContent.toLowerCase()).toBe('botão');
    expect(root().querySelector('[aria-live="polite"]').textContent).toContain('2 resultados');
  });

  it('sem resultado mostra a mensagem com o termo', async () => {
    await service.load();
    await setQuery('zzzzzz');

    expect(root().textContent).toContain('Nenhum resultado para "zzzzzz"');
  });

  it('setas movem o foco entre itens e ↑ no primeiro devolve o foco ao campo', async () => {
    await service.load();
    await setQuery('botao');

    const items = Array.from(root().querySelectorAll<HTMLElement>('.po-list-view-item-wrapper[tabindex="0"]'));
    const focusInput = jasmine.createSpy('focusInput');

    fixture.componentInstance.focusInput.subscribe(focusInput);
    document.body.appendChild(root());
    fixture.componentInstance.focusFirst();
    expect(document.activeElement).toBe(items[0]);

    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(items[1]);

    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(focusInput).toHaveBeenCalledTimes(1);
    root().remove();
  });

  it('clique emite o resultado e registra o gancho de clique com posição', async () => {
    await service.load();
    await setQuery('botao');

    const selected = jasmine.createSpy('selected');

    fixture.componentInstance.resultSelected.subscribe(selected);
    root().querySelectorAll<HTMLElement>('.po-list-view-item-wrapper')[1].click();

    expect(selected).toHaveBeenCalledTimes(1);
    const click = events.find(e => e.name === 'search_result_click');

    expect(click).toEqual(jasmine.objectContaining({ term: 'botao', position: 2, input: 'mouse' }));
  });

  it('enquanto digita mostra o skeleton (aria-busy) no lugar da lista e anuncia "Buscando"', async () => {
    await service.load();
    await setQuery('botao');
    expect(root().querySelector('po-list-view')).not.toBeNull();

    fixture.componentRef.setInput('typing', true);
    fixture.detectChanges();

    expect(root().querySelector('po-list-view')).toBeNull();
    expect(root().querySelectorAll('.search-skeleton-item').length).toBe(3);
    expect(root().querySelector('.search-results').getAttribute('aria-busy')).toBe('true');
    expect(root().querySelector('[aria-live="polite"]').textContent).toContain('Buscando');

    fixture.componentRef.setInput('typing', false);
    fixture.detectChanges();

    expect(root().querySelector('.search-skeleton')).toBeNull();
    expect(root().querySelector('.search-results').getAttribute('aria-busy')).toBe('false');
  });

  it('popover com muitos resultados mostra a prévia e "Ver todos os N resultados"', async () => {
    await service.load();
    await setQuery('p-helper');

    const viewAll = jasmine.createSpy('viewAll');

    fixture.componentInstance.viewAll.subscribe(viewAll);
    const footer = root().querySelector<HTMLElement>('.search-results-footer po-button button');

    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBeLessThan(10);
    expect(footer.textContent).toContain(`Ver todos os ${fixture.componentInstance.total()} resultados`);
    footer.click();
    expect(viewAll).toHaveBeenCalledTimes(1);
  });

  it('modal mostra de 50 em 50 e "Mostrar mais" revela o resto', async () => {
    fixture.componentRef.setInput('variant', 'modal');
    await service.load();
    await setQuery('p-helper');

    const total = fixture.componentInstance.total();

    expect(total).toBeGreaterThanOrEqual(60);
    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBe(50);

    root().querySelector<HTMLElement>('.search-results-footer po-button button').click();
    fixture.detectChanges();

    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBe(Math.min(100, total));

    // consulta nova volta a 50
    await setQuery('p-helpe');
    expect(fixture.componentInstance.shown()).toBe(50);
  });

  it('filtro de tipos: restringe a lista e o total na hora, e emite a contagem por tipo', async () => {
    await service.load();
    const counts: Array<Partial<Record<string, number>>> = [];

    fixture.componentInstance.countsChange.subscribe(c => counts.push(c));
    await setQuery('botao');
    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBe(2);

    fixture.componentRef.setInput('types', ['componente']);
    fixture.detectChanges();
    expect(root().querySelectorAll('.po-list-view-item-wrapper').length).toBe(1);
    expect(fixture.componentInstance.total()).toBe(1);

    fixture.componentRef.setInput('types', ['enum']);
    fixture.detectChanges();
    expect(root().textContent).toContain('nos tipos escolhidos');
    expect(counts[counts.length - 1]).toEqual({ componente: 1, propriedade: 1 });
  });

  it('consulta com 3+ letras que pede o chunk de ícones não quebra a lista (sem gravar sinal dentro de computed)', async () => {
    await service.load();
    const errors = spyOn(console, 'error');

    await setQuery('estilo');
    await new Promise(resolve => setTimeout(resolve, 20));
    fixture.detectChanges();

    expect(errors).not.toHaveBeenCalled();
    expect(fixture.componentInstance.state()).toBe('results');
  });
});

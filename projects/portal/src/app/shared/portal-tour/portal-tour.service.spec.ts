import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { DefaultUrlSerializer, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { PoUserGuideEndEvent, PoUserGuideService } from '@po-ui/ng-components';

import { PORTAL_TOUR_AUTO_START, PortalTourService, READY_TIMEOUT_MS, tourSeenKey } from './portal-tour.service';
import { PORTAL_TOURS, TOUR_MEDIA } from './portal-tour.steps';

describe('PortalTourService', () => {
  let events: Subject<unknown>;
  let router: { url: string; navigated: boolean; events: Subject<unknown>; parseUrl: (url: string) => unknown };
  let guide: jasmine.SpyObj<PoUserGuideService> & { tourEnd$: Subject<PoUserGuideEndEvent> };
  let root: HTMLElement;
  let active: boolean;
  /** Larguras ligadas: as media queries do tour respondem por esta lista. */
  let media: Array<string>;

  const setup = (autoStart: boolean) => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: PoUserGuideService, useValue: guide },
        { provide: PORTAL_TOUR_AUTO_START, useValue: autoStart }
      ]
    });

    return TestBed.inject(PortalTourService);
  };

  const navigate = (url: string) => {
    router.url = url;
    events.next(new NavigationEnd(1, url, url));
  };

  /** Largura de desktop (ícones do header e menu lateral aberto). */
  const DESKTOP = [TOUR_MEDIA.headerTools, TOUR_MEDIA.sideMenu];
  /** Celular (≤960px): sem ícones extras no header, menu lateral fechado. */
  const PHONE = [TOUR_MEDIA.headerToolsHidden, TOUR_MEDIA.sideMenuClosed];

  /** Header como o po-header renderiza (host inline sem tamanho) e a listagem da API Reference. */
  const mountPage = () => {
    root = document.createElement('div');
    root.innerHTML = `
      <po-header>
        <button style="width:20px;height:20px"><i class="an an-list"></i></button>
        <button aria-label="Github" style="width:20px;height:20px"></button>
        <button aria-label="Fazer tour" style="width:20px;height:20px"></button>
        <button aria-label="Aparência" style="width:20px;height:20px"></button>
      </po-header>
      <div data-tour="search" style="width:200px;height:20px"></div>
      <po-menu data-tour="docs-menu"><div class="po-menu" style="width:200px;height:200px"></div></po-menu>
      <po-page-list data-tour="api-page"><div class="po-page-list-filter-wrapper" style="width:200px;height:20px"></div></po-page-list>
      <div data-tour="api-view"><po-button-group style="display:block;width:200px;height:20px"></po-button-group></div>
      <h2 data-tour="api-category" style="height:20px">Ações</h2>`;
    document.body.appendChild(root);
  };

  const lastTitles = () => guide.setSteps.calls.mostRecent().args[0].map(s => s.title);

  /** Fim do tour; por padrão fechado no 1º de 3 passos. */
  const endTour = (reason: PoUserGuideEndEvent['reason'], lastIndex = 0, totalSteps = 3) => {
    active = false;
    guide.tourEnd$.next({ reason, lastIndex, totalSteps });
  };

  const settle = () => {
    tick(500);
    flushMicrotasks();
  };

  beforeEach(() => {
    localStorage.clear();
    events = new Subject();
    const serializer = new DefaultUrlSerializer();
    router = { url: '/', navigated: false, events, parseUrl: url => serializer.parse(url) };
    active = false;
    media = DESKTOP;
    spyOn(window, 'matchMedia').and.callFake(
      (query: string) => ({ matches: media.includes(query), media: query }) as MediaQueryList
    );
    guide = Object.assign(
      jasmine.createSpyObj<PoUserGuideService>('PoUserGuideService', ['setSteps', 'setOptions', 'start', 'isActive']),
      { tourEnd$: new Subject<PoUserGuideEndEvent>() }
    );
    guide.setSteps.and.returnValue(guide);
    guide.setOptions.and.returnValue(guide);
    guide.start.and.callFake(() => {
      active = true;
      return Promise.resolve();
    });
    guide.isActive.and.callFake(() => active);
    mountPage();
  });

  afterEach(() => {
    root.remove();
    localStorage.clear();
  });

  it('chave do visto com o id e a versão do tour', () => {
    expect(tourSeenKey(PORTAL_TOURS.portal)).toBe('@po-ui/portal/tour-portal-v22.0.0');
    expect(tourSeenKey(PORTAL_TOURS['api-reference'])).toBe('@po-ui/portal/tour-api-reference-v22.0.0');
  });

  it('passos pela largura, não pelo que já renderizou', () => {
    const service = setup(false);

    expect(service.plannedSteps(PORTAL_TOURS.portal).map(s => s.title)).toEqual([
      'Lançamos o PO UI v22!',
      'Busque no portal',
      'Ajuste a aparência',
      'Curtiu? Deixe uma estrela',
      'Veja o tour quando quiser'
    ]);

    media = [TOUR_MEDIA.headerTools, TOUR_MEDIA.sideMenuClosed]; // 961–1199px

    expect(service.plannedSteps(PORTAL_TOURS.portal).map(s => s.title)).toEqual([
      'Lançamos o PO UI v22!',
      'Busque no portal',
      'Ajuste a aparência',
      'Curtiu? Deixe uma estrela',
      'Veja o tour quando quiser'
    ]);

    media = PHONE;

    expect(service.plannedSteps(PORTAL_TOURS.portal).map(s => s.title)).toEqual([
      'Lançamos o PO UI v22!',
      'Busque no portal',
      'Ajuste a aparência',
      'Curtiu? Deixe uma estrela'
    ]);
    expect(service.plannedSteps(PORTAL_TOURS.guides)).toEqual([]);
  });

  it('auto-start desligado (specs, e2e): não abre nada ao navegar', fakeAsync(() => {
    setup(false).start();
    navigate('/documentation');
    settle();

    expect(guide.start).not.toHaveBeenCalled();
  }));

  it('abre o tour do portal uma vez só, com todos os passos da largura, e grava o visto com a versão', fakeAsync(() => {
    setup(true).start();
    navigate('/');
    settle();

    expect(guide.start).toHaveBeenCalledTimes(1);
    expect(lastTitles()).toEqual([
      'Lançamos o PO UI v22!',
      'Busque no portal',
      'Ajuste a aparência',
      'Curtiu? Deixe uma estrela',
      'Veja o tour quando quiser'
    ]);
    expect(localStorage.getItem('@po-ui/portal/tour-portal-v22.0.0')).toBe('1');
    expect(guide.setOptions).toHaveBeenCalledWith(
      jasmine.objectContaining({
        allowClose: true,
        allowScroll: true,
        literals: jasmine.objectContaining({ done: 'Concluir' })
      })
    );

    endTour('closed');
    navigate('/icons');
    settle();

    expect(guide.start).toHaveBeenCalledTimes(1);
  }));

  it('espera um alvo obrigatório que chega depois (ícones do header), em vez de abrir sem ele', fakeAsync(() => {
    const appearance = root.querySelector('button[aria-label="Aparência"]');

    appearance.remove();
    setup(true).start();
    navigate('/');
    tick(2000);
    flushMicrotasks();

    expect(guide.start).not.toHaveBeenCalled();

    root.querySelector('po-header').appendChild(appearance);
    settle();

    expect(lastTitles()).toEqual([
      'Lançamos o PO UI v22!',
      'Busque no portal',
      'Ajuste a aparência',
      'Curtiu? Deixe uma estrela',
      'Veja o tour quando quiser'
    ]);
  }));

  it('alvo obrigatório não aparece: não abre pela metade nem grava o visto', fakeAsync(() => {
    root.querySelector('button[aria-label="Aparência"]').remove();
    setup(true).start();
    navigate('/');
    tick(READY_TIMEOUT_MS + 500);
    flushMicrotasks();

    expect(guide.start).not.toHaveBeenCalled();
    expect(localStorage.getItem('@po-ui/portal/tour-portal-v22.0.0')).toBeNull();
  }));

  it('tooltip reescreveu o aria-label (" Aparência"): o passo continua no tour', fakeAsync(() => {
    root.querySelector('button[aria-label="Aparência"]').setAttribute('aria-label', ' Aparência');
    root.querySelector('button[aria-label="Fazer tour"]').setAttribute('aria-label', ' Fazer tour');
    setup(true).start();
    navigate('/');
    settle();

    expect(lastTitles()).toEqual([
      'Lançamos o PO UI v22!',
      'Busque no portal',
      'Ajuste a aparência',
      'Curtiu? Deixe uma estrela',
      'Veja o tour quando quiser'
    ]);
  }));

  it('portal concluído: o tour da página entra em seguida, com o menu lateral primeiro', fakeAsync(() => {
    setup(true).start();
    navigate('/documentation');
    settle();
    endTour('completed');
    settle();

    expect(guide.start).toHaveBeenCalledTimes(2);
    // sem api-preview na página (modo lista): o passo opcional sai, os outros ficam
    expect(lastTitles()).toEqual([
      'Menu por categorias',
      'Escolha como ver',
      'Filtre pelo nome',
      'Categorias',
      'Pronto para começar'
    ]);
    expect(guide.setSteps.calls.mostRecent().args[0][0].element).toBe(
      root.querySelector('[data-tour="docs-menu"] .po-menu')
    );
  }));

  it('celular: o passo do menu aponta para o ☰', fakeAsync(() => {
    media = PHONE;
    localStorage.setItem(tourSeenKey(PORTAL_TOURS.portal), '1');
    setup(true).start();
    navigate('/documentation');
    settle();

    const [menu] = guide.setSteps.calls.mostRecent().args[0];

    expect(menu.title).toBe('Menu por categorias');
    expect((menu.element as HTMLElement).querySelector('i.an-list')).not.toBeNull();
  }));

  it('"Concluir" no último passo (o serviço emite closed) também encadeia o da página', fakeAsync(() => {
    setup(true).start();
    navigate('/documentation');
    settle();
    endTour('closed', 2, 3);
    settle();

    expect(guide.start).toHaveBeenCalledTimes(2);
  }));

  it('portal fechado (Esc/X): o da página fica para a próxima visita', fakeAsync(() => {
    setup(true).start();
    navigate('/documentation');
    settle();
    endTour('closed');
    settle();

    expect(guide.start).toHaveBeenCalledTimes(1);

    navigate('/documentation');
    settle();

    expect(guide.start).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem('@po-ui/portal/tour-api-reference-v22.0.0')).toBe('1');
  }));

  it('"Fazer tour" abre o tour da página atual, mesmo já visto; sem tour próprio, o do portal', async () => {
    const service = setup(false);

    localStorage.setItem(tourSeenKey(PORTAL_TOURS['api-reference']), '1');
    router.url = '/documentation';

    expect(await service.startForCurrentPage()).toBe(true);
    expect(lastTitles()[0]).toBe('Menu por categorias');

    active = false;
    router.url = '/icons';

    expect(await service.startForCurrentPage()).toBe(true);
    expect(lastTitles()[0]).toBe('Lançamos o PO UI v22!');
  });

  describe('página do componente: um "visto" por modo', () => {
    /** Página do componente nos dois modos (como o gerador: os dois montados, um escondido). */
    const mountComponent = (mode: 'web' | 'doc', related = true) => {
      root.insertAdjacentHTML(
        'beforeend',
        `<po-page-default data-tour="component-page">
          <div class="po-page-header-actions">
            <button aria-label="Ver exemplos" style="width:50px;height:20px"></button>
            <button style="width:50px;height:20px">Voltar</button>
          </div>
          <div data-tour-mode="web" ${mode === 'web' ? '' : 'hidden'}>
            <div data-tour="sample-tabs" style="width:200px;height:40px">
              <div role="tab" style="width:40px;height:20px">HTML</div>
            </div>
          </div>
          <div data-tour-mode="doc" ${mode === 'doc' ? '' : 'hidden'}>
            ${related ? '<blockquote data-tour="api-related" style="height:20px">Subcomponentes</blockquote>' : ''}
          </div>
        </po-page-default>`
      );
    };
    /** Troca o modo na tela, como o [hidden] do gerador faz ao mudar ?view. */
    const showMode = (mode: 'web' | 'doc') =>
      root
        .querySelectorAll<HTMLElement>('[data-tour-mode]')
        .forEach(el => (el.hidden = el.dataset['tourMode'] !== mode));
    const webKey = '@po-ui/portal/tour-component-web-v22.0.0';
    const docKey = '@po-ui/portal/tour-component-doc-v22.0.0';

    beforeEach(() => localStorage.setItem(tourSeenKey(PORTAL_TOURS.portal), '1'));

    it('entra em ?view=doc: comuns + subcomponentes; troca para web: só os passos de exemplos', fakeAsync(() => {
      mountComponent('doc');
      setup(true).start();
      navigate('/documentation/po-accordion?view=doc');
      settle();

      expect(lastTitles()).toEqual(['Exemplos ou documentação', 'Voltar à lista', 'Componentes relacionados']);
      expect(localStorage.getItem(docKey)).toBe('1');
      expect(localStorage.getItem(webKey)).toBeNull();

      endTour('closed');
      // logo após a navegação o modo antigo ainda está na tela: espera o pedido na URL
      navigate('/documentation/po-accordion?view=web');
      tick(1000);
      expect(guide.start).toHaveBeenCalledTimes(1);
      showMode('web');
      settle();

      expect(guide.start).toHaveBeenCalledTimes(2);
      expect(lastTitles()).toEqual(['Veja e copie o código', 'Copie o código']);
      expect(localStorage.getItem(webKey)).toBe('1');

      // os dois modos vistos: nada abre mais
      endTour('closed');
      navigate('/documentation/po-accordion?view=doc');
      showMode('doc');
      settle();
      expect(guide.start).toHaveBeenCalledTimes(2);
    }));

    it('sem ?view vale o modo na tela (exemplos); depois a documentação só com os subcomponentes', fakeAsync(() => {
      mountComponent('web');
      setup(true).start();
      navigate('/documentation/po-accordion');
      settle();

      expect(lastTitles()).toEqual([
        'Exemplos ou documentação',
        'Voltar à lista',
        'Veja e copie o código',
        'Copie o código'
      ]);

      endTour('closed');
      showMode('doc');
      navigate('/documentation/po-accordion?view=doc');
      settle();

      expect(lastTitles()).toEqual(['Componentes relacionados']);
    }));

    it('modo sem passo visível (documentação sem subcomponentes): não abre e não grava o visto', fakeAsync(() => {
      mountComponent('web', false);
      localStorage.setItem(webKey, '1');
      showMode('doc');
      setup(true).start();
      navigate('/documentation/po-accordion?view=doc');
      settle();

      expect(guide.start).not.toHaveBeenCalled();
      expect(localStorage.getItem(docKey)).toBeNull();
    }));

    it('"Fazer tour" mostra o tour completo do modo atual, mesmo com o outro modo visto', async () => {
      mountComponent('web');
      localStorage.setItem(docKey, '1');
      localStorage.setItem(webKey, '1');
      router.url = '/documentation/po-accordion?view=web';

      expect(await setup(false).startForCurrentPage()).toBe(true);
      expect(lastTitles()).toEqual([
        'Exemplos ou documentação',
        'Voltar à lista',
        'Veja e copie o código',
        'Copie o código'
      ]);
    });

    it('pelo menu (sem ?view): a página monta com a documentação visível e passa para exemplos; vale o padrão (web)', fakeAsync(() => {
      // 1º ciclo da página nova: a área doc aparece antes de o componente trocar para exemplos
      mountComponent('doc');
      setup(true).start();
      navigate('/documentation/po-list-view');
      tick(100);
      showMode('web');
      settle();
      tick(500);
      flushMicrotasks();

      expect(lastTitles()).toEqual([
        'Exemplos ou documentação',
        'Voltar à lista',
        'Veja e copie o código',
        'Copie o código'
      ]);
      expect(lastTitles()).not.toContain('Componentes relacionados');
    }));

    it('sem ?view e sem exemplos na página: o padrão é a documentação', fakeAsync(() => {
      mountComponent('doc');
      // página sem exemplos: sem a área web e sem a ação de troca de modo
      root.querySelector('[data-tour-mode="web"]').remove();
      root.querySelector('button[aria-label="Ver exemplos"]').remove();
      setup(true).start();
      navigate('/documentation/po-accordion-item');
      settle();

      expect(lastTitles()).toEqual(['Voltar à lista', 'Componentes relacionados']);
    }));

    it('passo de um modo só entra com o alvo visível DENTRO da área daquele modo', () => {
      mountComponent('web');
      // "Componentes relacionados" visível, mas fora da área doc (ex.: sobra da página anterior)
      root.insertAdjacentHTML('beforeend', '<blockquote data-tour="api-related" style="height:20px">x</blockquote>');
      root.querySelector('[data-tour-mode="doc"] [data-tour="api-related"]').remove();
      const service = setup(false);

      expect(service.resolveSteps(service.componentTour('doc', false))).toEqual([]);

      showMode('doc');
      root
        .querySelector('[data-tour-mode="doc"]')
        .insertAdjacentHTML(
          'beforeend',
          '<blockquote data-tour="api-related" style="height:20px">Subcomponentes</blockquote>'
        );

      expect(service.resolveSteps(service.componentTour('doc', false)).map(s => s.title)).toEqual([
        'Componentes relacionados'
      ]);
    });

    it('encadeamento: tour 1 concluído abre o do modo atual', fakeAsync(() => {
      localStorage.clear();
      mountComponent('doc');
      setup(true).start();
      navigate('/documentation/po-accordion?view=doc');
      settle();
      expect(lastTitles()[0]).toBe('Lançamos o PO UI v22!');

      endTour('completed');
      settle();
      expect(lastTitles()).toEqual(['Exemplos ou documentação', 'Voltar à lista', 'Componentes relacionados']);
    }));
  });

  it('link com #âncora não abre sozinho', fakeAsync(() => {
    setup(true).start();
    navigate('/documentation/po-button?view=doc#prop-p-kind');
    settle();

    expect(guide.start).not.toHaveBeenCalled();
  }));

  it('navegou antes de o alvo aparecer: não abre na página errada', fakeAsync(() => {
    localStorage.setItem(tourSeenKey(PORTAL_TOURS.portal), '1');
    root.querySelector('[data-tour="api-category"]').remove();
    setup(true).start();
    navigate('/documentation');
    tick(1000);
    navigate('/icons');
    root.insertAdjacentHTML('beforeend', '<h2 data-tour="api-category" style="height:20px">Ações</h2>');
    tick(READY_TIMEOUT_MS);
    flushMicrotasks();

    expect(guide.start).not.toHaveBeenCalled();
  }));
});

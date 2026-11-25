import {
  PORTAL_TOURS,
  PortalTour,
  PortalTourStep,
  TOUR_MEDIA,
  isVisible,
  openComponentsGroup,
  pageTourFor
} from './portal-tour.steps';

/** Resolve o alvo do passo no documento atual (só alvos visíveis contam). */
const resolve = (step: PortalTourStep): Element | null => {
  if (step.target === undefined) return null;
  const element =
    typeof step.target === 'string'
      ? (Array.from(document.querySelectorAll(step.target)).find(isVisible) ?? null)
      : step.target(document);

  return isVisible(element) ? element : null;
};

const titles = (tour: PortalTour) => tour.steps.map(step => step.title);
const step = (tour: PortalTour, title: string, media?: string) =>
  tour.steps.find(s => s.title === title && (media === undefined || s.media === media));

/** Header como o po-header renderiza: botões só com ícone, nome no aria-label. */
const HEADER = `
  <po-header>
    <button style="width:20px;height:20px"><i class="an an-list"></i></button>
    <button aria-label="Github" style="width:20px;height:20px"><i class="an an-github-logo"></i></button>
    <button aria-label="Fazer tour" style="width:20px;height:20px"><i class="an an-signpost"></i></button>
    <button aria-label="Aparência" style="width:20px;height:20px"><i class="an an-palette"></i></button>
  </po-header>`;

describe('portal-tour.steps', () => {
  let root: HTMLElement;

  const mount = (html: string) => {
    root = document.createElement('div');
    root.innerHTML = html;
    document.body.appendChild(root);
  };

  afterEach(() => root?.remove());

  it('escolhe o tour pela rota (sem query nem fragmento)', () => {
    expect(pageTourFor('/documentation')?.id).toBe('api-reference');
    expect(pageTourFor('/documentation?x=1')?.id).toBe('api-reference');
    expect(pageTourFor('/documentation/po-button?view=doc#prop-p-kind')?.id).toBe('component');
    expect(pageTourFor('/documentation/ia-tools-llms')).toBeUndefined();
    expect(pageTourFor('/guides')?.id).toBe('guides');
    expect(pageTourFor('/guides/getting-started')?.id).toBe('guides');
    expect(pageTourFor('/')).toBeUndefined();
    expect(pageTourFor('/icons')).toBeUndefined();
  });

  it('todo tour tem versão, textos e no máximo um passo central (sem alvo) para todas as larguras', () => {
    Object.values(PORTAL_TOURS).forEach(tour => {
      expect(tour.version).toBe('22.0.0');
      tour.steps.forEach(s => {
        expect(s.title.length).toBeGreaterThan(0);
        expect(s.content.length).toBeGreaterThan(0);
      });
      expect(tour.steps.filter(s => s.target === undefined && !s.media).length).toBeLessThanOrEqual(1);
    });
  });

  describe('1. portal (header)', () => {
    const tour = PORTAL_TOURS.portal;

    it('v22 no centro, busca, aparência, estrela no GitHub e "Fazer tour" (sem menu lateral nem item "Componentes")', () => {
      expect(titles(tour)).toEqual([
        'Lançamos o PO UI v22!',
        'Busque no portal',
        'Ajuste a aparência',
        'Curtiu? Deixe uma estrela',
        'Curtiu? Deixe uma estrela',
        'Veja o tour quando quiser'
      ]);
      expect(tour.steps.map(s => s.media)).toEqual([
        undefined,
        undefined,
        undefined,
        TOUR_MEDIA.headerTools,
        TOUR_MEDIA.headerToolsHidden,
        TOUR_MEDIA.headerTools
      ]);
      expect(tour.steps[0].target).toBeUndefined();
      expect(tour.steps[4].target).toBeUndefined();
      expect(tour.steps.every(s => !s.optional)).toBe(true);
    });

    it('acha os alvos do header', () => {
      mount(`<div data-tour="search" style="width:200px;height:20px"></div>${HEADER}`);

      expect(
        tour.steps
          .filter(s => s.target !== undefined)
          .map(resolve)
          .every(Boolean)
      ).toBe(true);
      expect(resolve(tour.steps[3]).getAttribute('aria-label')).toBe('Github');
    });

    it('a estrela é pedida no repositório po-angular, em nova aba', () => {
      expect(tour.steps[3].content).toContain(
        'href="https://github.com/po-ui/po-angular" target="_blank" rel="noopener noreferrer"'
      );
      expect(tour.steps[4].content).toBe(tour.steps[3].content);
    });

    it('acha Aparência e Fazer tour mesmo com o aria-label reescrito pelo po-tooltip (" Aparência")', () => {
      mount(
        HEADER.replace('aria-label="Aparência"', 'aria-label=" Aparência"').replace(
          'aria-label="Fazer tour"',
          'aria-label=" Fazer tour"'
        )
      );

      expect(resolve(step(tour, 'Ajuste a aparência'))).not.toBeNull();
      expect(resolve(step(tour, 'Veja o tour quando quiser'))).not.toBeNull();
    });
  });

  describe('3. API Reference', () => {
    const tour = PORTAL_TOURS['api-reference'];

    it('menu lateral primeiro (ou o ☰ com o menu fechado), depois grid/lista, filtro, categorias, preview e resumo', () => {
      expect(titles(tour)).toEqual([
        'Menu por categorias',
        'Menu por categorias',
        'Escolha como ver',
        'Filtre pelo nome',
        'Categorias',
        'Exemplo funcionando',
        'Pronto para começar'
      ]);
      expect(tour.steps[0].media).toBe(TOUR_MEDIA.sideMenu);
      expect(tour.steps[1].media).toBe(TOUR_MEDIA.sideMenuClosed);
      expect(step(tour, 'Exemplo funcionando').optional).toBe(true);
      expect(tour.steps[6].target).toBeUndefined();
    });

    it('acha o menu lateral, o ☰ e os alvos da listagem', () => {
      mount(`${HEADER}
        <po-menu data-tour="docs-menu"><div class="po-menu" style="width:200px;height:200px"></div></po-menu>
        <po-page-list data-tour="api-page"><div class="po-page-list-filter-wrapper" style="width:200px;height:20px"></div></po-page-list>
        <div data-tour="api-view"><po-button-group style="display:block;width:200px;height:20px"></po-button-group></div>
        <h2 data-tour="api-category" style="height:20px">Ações</h2>
        <div data-tour="api-preview" style="width:200px;height:100px"></div>`);

      expect(tour.steps.slice(0, 6).map(resolve).every(Boolean)).toBe(true);
      expect(resolve(tour.steps[1]).querySelector('i.an-list')).not.toBeNull();
    });

    it('menu na gaveta fechada (fora da tela) não conta como visível', () => {
      mount(
        `<po-menu data-tour="docs-menu"><div class="po-menu" style="position:fixed;left:-400px;width:200px;height:200px"></div></po-menu>`
      );

      expect(resolve(tour.steps[0])).toBeNull();
    });

    it('antes do passo do menu, abre o grupo "Componentes" pelo clique do po-menu (só se estiver fechado)', () => {
      mount(`<po-menu data-tour="docs-menu"><div class="po-menu" style="width:200px;height:200px">
        <div class="po-menu-item po-menu-item-grouper-down" aria-label="Componentes" style="height:20px"></div>
      </div></po-menu>`);
      const group = root.querySelector<HTMLElement>('.po-menu-item');
      const click = spyOn(group, 'click');

      expect(tour.steps[0].beforeHighlight).toBe(openComponentsGroup);

      openComponentsGroup(document);
      expect(click).toHaveBeenCalledTimes(1);

      group.classList.replace('po-menu-item-grouper-down', 'po-menu-item-grouper-up');
      openComponentsGroup(document);
      expect(click).toHaveBeenCalledTimes(1);
    });
  });

  describe('4. página do componente', () => {
    const tour = PORTAL_TOURS.component;
    const page = (body: string) => `
      <po-page-default data-tour="component-page"><div class="po-page-header-actions">
        <button aria-label="Ver documentação" style="width:50px;height:20px">Ver documentação</button>
        <button style="width:50px;height:20px">Voltar</button>
      </div>${body}</po-page-default>`;

    it('troca de modo e voltar (comuns), abas e copiar código (web), subcomponentes (doc)', () => {
      expect(titles(tour)).toEqual([
        'Exemplos ou documentação',
        'Voltar à lista',
        'Veja e copie o código',
        'Copie o código',
        'Componentes relacionados'
      ]);
      expect(tour.steps.map(s => s.mode)).toEqual([undefined, undefined, 'web', 'web', 'doc']);
      expect(tour.steps.map(s => !s.optional)).toEqual([false, true, true, true, false]);
    });

    it('modo exemplos: copiar código aponta para a aba HTML quando o código está fechado; sem subcomponentes', () => {
      mount(
        page(`
        <div data-tour="sample-tabs" style="width:200px;height:40px">
          <div role="tab" style="width:40px;height:20px">Preview</div><div role="tab" style="width:40px;height:20px">HTML</div>
          <div style="display:none"><div class="docs-code-block"><span class="copy-code"></span></div></div>
        </div>
        <blockquote data-tour="api-related" style="display:none">Subcomponentes</blockquote>`)
      );

      const found = tour.steps.map(resolve);

      expect(found.slice(0, 3).every(Boolean)).toBe(true);
      expect(found[3].textContent.trim()).toBe('HTML');
      expect(found[4]).toBeNull();
    });

    it('código aberto: copiar código aponta para o botão', () => {
      mount(
        page(
          `<div data-tour="sample-tabs"><div class="docs-code-block"><span class="copy-code" style="display:inline-block;width:20px;height:20px"></span></div></div>`
        )
      );

      expect(resolve(tour.steps[3]).classList).toContain('copy-code');
    });

    it('modo documentação: sem abas de exemplo, com subcomponentes', () => {
      mount(
        page(`
        <div data-tour="sample-tabs" style="display:none"></div>
        <blockquote data-tour="api-related" style="height:20px">Subcomponentes</blockquote>`)
      );

      expect(tour.steps.map(resolve).map(Boolean)).toEqual([true, true, false, false, true]);
    });
  });

  describe('5. guias', () => {
    const tour = PORTAL_TOURS.guides;

    it('só as categorias, com o menu lateral aberto (acima de 1200px)', () => {
      expect(titles(tour)).toEqual(['Guias por assunto']);
      expect(tour.steps.every(s => s.media === TOUR_MEDIA.sideMenu)).toBe(true);
    });

    it('acha o menu de guias', () => {
      mount(`<po-menu data-tour="guides-menu"><div class="po-menu" style="width:200px;height:200px"></div></po-menu>`);

      expect(resolve(tour.steps[0])).not.toBeNull();
    });
  });
});

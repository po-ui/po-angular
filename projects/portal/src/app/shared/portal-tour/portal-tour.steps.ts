import { PoUserGuidePosition } from '@po-ui/ng-components';

/** Alvo do passo: seletor CSS ou função que acha o elemento na hora (para alvos dentro de componentes PO UI). */
export type PortalTourTarget = string | ((doc: Document) => Element | null);

export interface PortalTourStep {
  /** Sem alvo: o passo aparece no centro da tela (ex.: resumo no fim). */
  target?: PortalTourTarget;
  /**
   * Largura em que o passo existe (media query). Fora dela o passo não entra no tour: o conjunto de passos
   * depende só da página e da largura, nunca do que já renderizou.
   */
  media?: string;
  /**
   * O alvo pode não existir nesta página (modo lista, componente sem exemplos ou sem subcomponentes).
   * Passo obrigatório (padrão): o tour espera o alvo aparecer antes de abrir.
   */
  optional?: boolean;
  /**
   * Página do componente: o passo só existe neste modo (`?view=web|doc`). Sem `mode`, o passo é comum aos dois
   * e só aparece no 1º modo visto (o "visto" é por modo).
   */
  mode?: ComponentMode;
  /** Antes de destacar o passo (ex.: abrir um grupo do menu pelo clique do próprio po-menu). */
  beforeHighlight?: (doc: Document) => void;
  title: string;
  content: string;
  position?: PoUserGuidePosition;
}

/** Modo da página do componente: exemplos (`web`) ou documentação (`doc`). */
export type ComponentMode = 'web' | 'doc';

/** `component-web` e `component-doc`: o tour da página do componente com o "visto" de cada modo. */
export type PortalTourId = 'portal' | 'api-reference' | 'component' | `component-${ComponentMode}` | 'guides';

export interface PortalTour {
  id: PortalTourId;
  /** Versão do portal em que o tour foi publicado (ex.: '22.0.0'): quem viu a versão antiga vê a nova uma vez. */
  version: string;
  steps: Array<PortalTourStep>;
}

/**
 * Larguras do layout do portal (medidas no Chrome; vêm do po-style e do po-menu):
 * - ícones do header (Github, Instagram, Fazer tour): acima de 960px (até 960px só o último, Aparência);
 * - menu lateral (documentação e guias): acima de 1200px; até 1200px ele abre pelo ☰ do header.
 */
export const TOUR_MEDIA = {
  headerTools: '(min-width: 961px)',
  headerToolsHidden: '(max-width: 960px)',
  sideMenu: '(min-width: 1201px)',
  sideMenuClosed: '(max-width: 1200px)'
};

/** Elemento visível na tela (o po-tab esconde com display:none; no celular o menu fica na gaveta fechada). */
export function isVisible(element: Element | null): element is HTMLElement {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const view = element.ownerDocument.defaultView;

  return element.getClientRects().length > 0 && rect.width > 0 && rect.right > 0 && rect.left < (view?.innerWidth ?? 0);
}

/** 1º elemento visível do seletor. */
export function firstVisible(doc: Document, selector: string): HTMLElement | null {
  return Array.from(doc.querySelectorAll(selector)).find(isVisible) ?? null;
}

/**
 * Botão visível cujo nome é um dos informados. O nome é comparado sem espaços nas pontas: o po-tooltip,
 * ao passar o mouse ou focar, reescreve o aria-label como `textContent + ' ' + tooltip` (" Aparência").
 */
export function buttonNamed(doc: Document, scope: string, names: Array<string>): HTMLElement | null {
  return (
    Array.from(doc.querySelectorAll<HTMLElement>(`${scope} button`)).find(
      button =>
        isVisible(button) && names.includes((button.getAttribute('aria-label') || button.textContent || '').trim())
    ) ?? null
  );
}

/** Botão ☰ do header (ícone de menu do po-header): abre o menu lateral quando ele está fechado. */
const menuButton = (doc: Document) => firstVisible(doc, 'po-header button:has(i.an-list)');

/**
 * Abre o grupo "Componentes" do menu lateral (se estiver fechado), para o passo mostrar as categorias.
 * Usa o clique do próprio po-menu: nada de CSS nem estado interno.
 */
export function openComponentsGroup(doc: Document): void {
  const group = Array.from(doc.querySelectorAll<HTMLElement>('[data-tour="docs-menu"] .po-menu-item')).find(
    item => isVisible(item) && item.getAttribute('aria-label') === 'Componentes'
  );

  if (group?.classList.contains('po-menu-item-grouper-down')) group.click();
}

/** "Copiar código" visível; se o código está fechado, a aba HTML do 1º exemplo (é ali que o botão aparece). */
function copyCode(doc: Document): HTMLElement | null {
  return (
    firstVisible(doc, '[data-tour="sample-tabs"] .copy-code') ??
    Array.from(doc.querySelectorAll<HTMLElement>('[data-tour="sample-tabs"] [role="tab"]')).find(
      tab => isVisible(tab) && tab.textContent?.trim() === 'HTML'
    ) ??
    null
  );
}

/** Pedido de estrela no GitHub (o ícone do header leva para a organização; a estrela é no repositório). */
const GITHUB_STAR_CONTENT =
  'Se o PO UI ajuda no seu dia a dia, deixe uma ⭐ no <a href="https://github.com/po-ui/po-angular" target="_blank" rel="noopener noreferrer">repositório do GitHub</a>. Isso ajuda o projeto a crescer.';

const HEADER_ACTIONS = '[data-tour="component-page"] .po-page-header-actions';

export const PORTAL_TOURS: Record<'portal' | 'api-reference' | 'component' | 'guides', PortalTour> = {
  // 1. Header: o mesmo em qualquer página. Etapas por largura: ≥961px 5; ≤960px 4.
  portal: {
    id: 'portal',
    version: '22.0.0',
    steps: [
      {
        // sem alvo: aparece no centro da tela
        title: 'Lançamos o PO UI v22!',
        content:
          'A documentação também ganhou novidades: um novo tema padrão, busca em todo o portal, componentes por categoria, exemplos funcionando e troca de tema. Veja em poucos passos.'
      },
      {
        target: '[data-tour="search"]',
        title: 'Busque no portal',
        content:
          'Encontre componentes, propriedades, eventos, guias e ícones em um só lugar. Use <kbd>Ctrl</kbd>+<kbd>K</kbd> (ou <kbd>⌘</kbd>+<kbd>K</kbd> no Mac) para abrir de qualquer página.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: doc => buttonNamed(doc, 'po-header', ['Aparência']),
        title: 'Ajuste a aparência',
        content:
          'Veja os componentes no tema que sua aplicação usa: escolha o tema, o modo claro ou escuro e a densidade. A escolha fica salva neste navegador.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: doc => buttonNamed(doc, 'po-header', ['Github']),
        media: TOUR_MEDIA.headerTools,
        title: 'Curtiu? Deixe uma estrela',
        content: GITHUB_STAR_CONTENT,
        position: PoUserGuidePosition.Bottom
      },
      {
        // até 960px o ícone do Github fica escondido no header: o passo aparece no centro
        media: TOUR_MEDIA.headerToolsHidden,
        title: 'Curtiu? Deixe uma estrela',
        content: GITHUB_STAR_CONTENT
      },
      {
        target: doc => buttonNamed(doc, 'po-header', ['Fazer tour']),
        media: TOUR_MEDIA.headerTools,
        title: 'Veja o tour quando quiser',
        content: 'Cada página tem o seu tour. Clique em <strong>Fazer tour</strong> para rever o desta página.',
        position: PoUserGuidePosition.Bottom
      }
    ]
  },

  // 3. API Reference (/documentation).
  'api-reference': {
    id: 'api-reference',
    version: '22.0.0',
    steps: [
      {
        target: '[data-tour="docs-menu"] .po-menu',
        media: TOUR_MEDIA.sideMenu,
        beforeHighlight: openComponentsGroup,
        title: 'Menu por categorias',
        content:
          'Os componentes estão agrupados pelo que fazem: Ações, Formulário, Seleção e outros. Um item com uma categoria entre parênteses é um atalho para onde ele está de fato.',
        position: PoUserGuidePosition.Right
      },
      {
        // menu fechado (celular e telas até 1200px): aponta o ☰ que abre o mesmo menu
        target: menuButton,
        media: TOUR_MEDIA.sideMenuClosed,
        title: 'Menu por categorias',
        content:
          'Toque no ☰ para abrir o menu. Lá os componentes estão agrupados pelo que fazem: Ações, Formulário, Seleção e outros.',
        position: PoUserGuidePosition.Bottom
      },
      {
        // só o po-button-group, não a faixa inteira
        target: '[data-tour="api-view"] po-button-group',
        title: 'Escolha como ver',
        content:
          'Em <strong>Grid</strong>, cada componente aparece num card com um exemplo funcionando. Em <strong>Lista</strong>, você vê só os nomes, para achar mais rápido. A escolha fica salva.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: '[data-tour="api-page"] .po-page-list-filter-wrapper',
        title: 'Filtre pelo nome',
        content: 'Digite parte do nome, como "table" ou "data". Só ficam as categorias com resultado.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: '[data-tour="api-category"]',
        title: 'Categorias',
        content: 'A lista segue as categorias do menu. O número ao lado mostra quantos componentes há em cada uma.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: '[data-tour="api-preview"]',
        optional: true, // só na visão em grid
        title: 'Exemplo funcionando',
        content:
          'O exemplo do card é o componente de verdade, não uma imagem. Clique no título para abrir os exemplos completos.',
        position: PoUserGuidePosition.Top
      },
      {
        title: 'Pronto para começar',
        content:
          'Escolha um componente. Na página dele você vê exemplos com código para copiar e todas as propriedades e eventos.'
      }
    ]
  },

  // 4. Página do componente (/documentation/<nome>), nos dois modos (?view=web|doc).
  component: {
    id: 'component',
    version: '22.0.0',
    steps: [
      {
        target: doc => buttonNamed(doc, HEADER_ACTIONS, ['Ver exemplos', 'Ver documentação']),
        optional: true, // componente sem exemplos não tem a troca de modo
        title: 'Exemplos ou documentação',
        content:
          'Alterne entre os exemplos e a documentação da API, com propriedades, eventos e métodos. O link da página guarda o modo escolhido.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: doc => buttonNamed(doc, HEADER_ACTIONS, ['Voltar']),
        title: 'Voltar à lista',
        content: 'Volta para a lista de todos os componentes.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: '[data-tour="sample-tabs"]',
        mode: 'web',
        title: 'Veja e copie o código',
        content:
          'Em <strong>Preview</strong> você usa o exemplo. Nas outras abas está o código dele: HTML, TypeScript e CSS.',
        position: PoUserGuidePosition.Top
      },
      {
        target: copyCode,
        mode: 'web',
        title: 'Copie o código',
        content: 'Abra uma aba de código e use o botão no canto para copiar o arquivo inteiro e colar no seu projeto.',
        position: PoUserGuidePosition.Bottom
      },
      {
        target: '[data-tour="api-related"]',
        mode: 'doc',
        optional: true, // só quando há pai ou subcomponentes
        title: 'Componentes relacionados',
        content:
          'Aqui estão os componentes que fazem parte deste ou que ele usa. Clique em um para ver a documentação dele.',
        position: PoUserGuidePosition.Bottom
      }
    ]
  },

  // 5. Guias (/guides): o menu lateral só aparece acima de 1200px; abaixo disso o tour não abre.
  guides: {
    id: 'guides',
    version: '22.0.0',
    steps: [
      {
        target: '[data-tour="guides-menu"] .po-menu',
        media: TOUR_MEDIA.sideMenu,
        title: 'Guias por assunto',
        content:
          'Os guias estão agrupados por assunto, como Começando e Temas. Comece por <strong>Começando</strong> se é a sua primeira vez com o PO UI.',
        position: PoUserGuidePosition.Right
      }
    ]
  }
};

/** Tour da página pela rota (sem query nem fragmento). Páginas sem tour próprio: `undefined`. */
export function pageTourFor(url: string): PortalTour | undefined {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '');

  if (path === '/documentation') {
    return PORTAL_TOURS['api-reference'];
  }

  if (/^\/documentation\/po-[\w-]+$/.test(path)) {
    return PORTAL_TOURS.component;
  }

  if (path === '/guides' || path.startsWith('/guides/')) {
    return PORTAL_TOURS.guides;
  }

  return undefined;
}

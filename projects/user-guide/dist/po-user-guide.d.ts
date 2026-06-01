/**
 * Interfaces públicas do bundle vanilla `@po-ui/user-guide`.
 *
 * São definições enxutas e independentes do projeto Angular `@po-ui/ng-components`,
 * adequadas para a entrega inicial via CDN.
 */
/** Posição do popover em relação ao elemento destacado. */
type PoUserGuidePosition = 'top' | 'bottom' | 'left' | 'right' | 'over' | 'auto';
/** Alinhamento do popover em relação ao elemento destacado. */
type PoUserGuideAlign = 'start' | 'center' | 'end';
/** Identificadores dos botões exibidos no popover do tour. */
type PoUserGuideButton = 'next' | 'previous' | 'close';
/**
 * Descreve um único passo do tour guiado.
 */
interface PoUserGuideStep {
  /**
   * Elemento alvo destacado durante a execução do passo.
   *
   * Aceita um seletor CSS válido ou uma referência direta a um `Element` do DOM.
   * Quando omitido, o passo é exibido centralizado, sem destacar nenhum elemento.
   */
  element?: string | Element;
  /** Título exibido no topo do popover. */
  title?: string;
  /**
   * Conteúdo do passo. Aceita HTML, que é sanitizado por DOMPurify antes da renderização.
   */
  content: string;
  /** Posição do popover em relação ao elemento destacado. */
  position?: PoUserGuidePosition;
  /** Alinhamento do popover em relação ao elemento destacado. */
  align?: PoUserGuideAlign;
  /** Sobrescreve o label do botão "Próximo" para este passo. */
  nextLabel?: string;
  /** Sobrescreve o label do botão "Anterior" para este passo. */
  previousLabel?: string;
  /** Sobrescreve o label do botão "Finalizar" no último passo. */
  doneLabel?: string;
  /** Conjunto de botões a exibir neste passo. Quando omitido, todos são exibidos. */
  showButtons?: Array<PoUserGuideButton>;
}
/**
 * Configurações globais aplicadas a toda a execução do tour.
 */
interface PoUserGuideOptions {
  /** Permite encerrar o tour clicando fora do popover ou pelo botão "Fechar" (X). */
  allowClose?: boolean;
  /** Mantém a rolagem da página livre durante o tour. */
  allowScroll?: boolean;
  /** Exibe indicador textual de progresso (ex.: "1 de 5"). */
  showProgress?: boolean;
  /** Habilita controle por teclado (Esc / setas / Enter). */
  keyboardControl?: boolean;
  /** Opacidade do overlay no intervalo `[0, 1]`. */
  overlayOpacity?: number;
  /** Label padrão do botão "Próximo". */
  nextLabel?: string;
  /** Label padrão do botão "Anterior". */
  previousLabel?: string;
  /** Label padrão do botão "Finalizar" no último passo. */
  doneLabel?: string;
  /** Label do botão "Fechar" (X). */
  closeLabel?: string;
  /**
   * Template do indicador de progresso. Aceita `{{current}}` e `{{total}}`.
   * Quando nenhum placeholder estiver presente, o texto é exibido literalmente.
   */
  progressTemplate?: string;
  /** Classe CSS adicional aplicada ao popover. */
  popoverClass?: string;
  /** Callback invocado a cada mudança de passo. */
  onStepChange?: (event: PoUserGuideStepChangeEvent) => void;
  /** Callback invocado ao iniciar o tour. */
  onTourStart?: (event: PoUserGuideStartEvent) => void;
  /** Callback invocado ao encerrar o tour. */
  onTourEnd?: (event: PoUserGuideEndEvent) => void;
}
/** Direção da transição entre passos do tour. */
type PoUserGuideDirection = 'start' | 'next' | 'previous' | 'goto';
/** Motivo do encerramento do tour. */
type PoUserGuideEndReason = 'completed' | 'closed';
/** Evento emitido a cada mudança de passo. */
interface PoUserGuideStepChangeEvent {
  step: PoUserGuideStep;
  index: number;
  direction: PoUserGuideDirection;
  totalSteps: number;
}
/** Evento emitido no início do tour. */
interface PoUserGuideStartEvent {
  totalSteps: number;
  startIndex: number;
  timestamp: number;
}
/** Evento emitido no encerramento do tour. */
interface PoUserGuideEndEvent {
  reason: PoUserGuideEndReason;
  lastIndex: number;
  totalSteps: number;
}

/**
 * Versão standalone (vanilla) do `PoUserGuide`, distribuída via CDN no pacote `@po-ui/user-guide`.
 *
 * A classe expõe uma API encadeável e mínima para criação de tours guiados, sem dependência de
 * Angular. Internamente usa `driver.js` (embutido no bundle) para a renderização do popover e
 * `DOMPurify` (também embutido) para sanitização de conteúdo HTML.
 *
 * @example
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.iife.js"></script>
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.css" />
 * <script>
 *   PoUserGuide.create()
 *     .setSteps([{ element: '#hello', title: 'Olá', content: 'Bem-vindo!' }])
 *     .start();
 * </script>
 * ```
 */
declare class PoUserGuide {
  private static readonly STYLES_FLAG;
  private steps;
  private options;
  private driverInstance;
  private currentIndex;
  private pendingEndReason;
  /** Cria uma nova instância do `PoUserGuide`. */
  static create(): PoUserGuide;
  /** Configura a lista de passos do tour. */
  setSteps(steps: Array<PoUserGuideStep>): this;
  /** Configura as opções globais do tour. */
  setOptions(options?: PoUserGuideOptions): this;
  /**
   * Inicia o tour a partir do passo informado em `startIndex` (padrão `0`).
   *
   * Se um tour já estiver em execução, ele é encerrado antes do novo iniciar.
   *
   * @throws Erro se a lista de passos não tiver sido configurada ou `startIndex` for inválido.
   */
  start(startIndex?: number): void;
  /** Avança para o próximo passo. */
  next(): void;
  /** Retrocede para o passo anterior. */
  previous(): void;
  /** Move o tour para o passo identificado por `index`. */
  goTo(index: number): void;
  /** Encerra o tour em execução. */
  close(): void;
  /** Indica se há um tour em execução. */
  isActive(): boolean;
  /** Retorna o passo ativo, ou `null` se não houver tour em execução. */
  getCurrentStep(): PoUserGuideStep | null;
  /** Retorna o índice do passo ativo, ou `-1` se não houver tour em execução. */
  getCurrentIndex(): number;
  private validateSteps;
  private resolveOptions;
  private sanitize;
  private injectStyles;
  private buildDriverConfig;
  private mapSteps;
  private resolveShowButtons;
  private renderPopover;
  private handleHighlight;
  private handleDestroyed;
  private handleCloseClick;
}

export { PoUserGuide };
export type {
  PoUserGuideAlign,
  PoUserGuideButton,
  PoUserGuideDirection,
  PoUserGuideEndEvent,
  PoUserGuideEndReason,
  PoUserGuideOptions,
  PoUserGuidePosition,
  PoUserGuideStartEvent,
  PoUserGuideStep,
  PoUserGuideStepChangeEvent
};

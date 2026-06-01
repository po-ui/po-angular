/**
 * Interfaces públicas do bundle vanilla `@po-ui/user-guide`.
 *
 * São definições enxutas e independentes do projeto Angular `@po-ui/ng-components`,
 * adequadas para a entrega inicial via CDN.
 */

/** Posição do popover em relação ao elemento destacado. */
export type PoUserGuidePosition = 'top' | 'bottom' | 'left' | 'right' | 'over' | 'auto';

/** Alinhamento do popover em relação ao elemento destacado. */
export type PoUserGuideAlign = 'start' | 'center' | 'end';

/** Identificadores dos botões exibidos no popover do tour. */
export type PoUserGuideButton = 'next' | 'previous' | 'close';

/**
 * Descreve um único passo do tour guiado.
 */
export interface PoUserGuideStep {
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
export interface PoUserGuideOptions {
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
export type PoUserGuideDirection = 'start' | 'next' | 'previous' | 'goto';

/** Motivo do encerramento do tour. */
export type PoUserGuideEndReason = 'completed' | 'closed';

/** Evento emitido a cada mudança de passo. */
export interface PoUserGuideStepChangeEvent {
  step: PoUserGuideStep;
  index: number;
  direction: PoUserGuideDirection;
  totalSteps: number;
}

/** Evento emitido no início do tour. */
export interface PoUserGuideStartEvent {
  totalSteps: number;
  startIndex: number;
  timestamp: number;
}

/** Evento emitido no encerramento do tour. */
export interface PoUserGuideEndEvent {
  reason: PoUserGuideEndReason;
  lastIndex: number;
  totalSteps: number;
}

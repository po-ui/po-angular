import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define a seção de Actions do header.
 *
 * Indicação de uso:
 * - Primeira ação destinada à app launcher.
 * - Segunda ação (terceiro ícone) destinada à notificações.
 * - Terceira ação (segundo ícone) destinada para agrupamento de ações.
 *
 * > Caso seja passado items e popover, o componente irá renderizar o popover e os itens serão ignorados.
 *
 */
export interface PoHeaderActionTool {
  /**
   *
   * @optional
   *
   * @description
   *
   * Título da ação
   */
  label?: string;
  /**
   *
   * @optional
   *
   * @description
   *
   * Texto que será apresentado na tooltip
   */
  tooltip?: string;
  /**
   *
   * @optional
   *
   * @description
   *
   * Ícone do botão de ação
   */
  icon?: string;
  /**
   *
   * @optional
   *
   * @description
   *
   * Template que será utilizado na ação
   */
  popover?: PoHeaderActionPopoverAction;
  /**
   *
   * @optional
   *
   * @description
   *
   * Evento emitido ao clicar em uma ação
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */

  action?: Function;

  /**
   *
   * @optional
   *
   * @description
   *
   * Itens de ações
   *
   */
  items?: Array<PoHeaderActionToolItem>;

  /**
   *
   * @optional
   *
   * @description
   *
   * Valor númerico com a repsentação de notificações
   *
   */
  badge?: number;

  /**
   *
   *
   * @description
   *
   * link utilizado no redirecionamento das páginas.
   *
   */
  link?: string;

  //interno
  $selected?;
}

/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define um template para uma ação.
 *
 */
export interface PoHeaderActionPopoverAction {
  /**
   *
   * @description
   *
   * Template que será renderizado dentro do popover
   */
  content: TemplateRef<any>;
}

/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define uma lista de ações.
 *
 */
export interface PoHeaderActionToolItem {
  /**
   *
   * @description
   *
   * Label da ação
   */
  label: string;

  /**
   *
   * @description
   *
   * Evento emitido ao clicar em uma ação
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action: Function;
}

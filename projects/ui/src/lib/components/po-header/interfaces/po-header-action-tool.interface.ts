import { TemplateRef } from '@angular/core';

/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define a seção de Actions do header.
 *
 * > Caso seja passado items e popover, o componente irá renderizar o popover e os itens serão ignorados
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
  title?: string;
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
   * Evento emitida ao clicar em uma ação
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
   * Título do cabeçalho do template
   */
  title: string;

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
   * Evento emitida ao clicar em uma ação
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action: Function;
}

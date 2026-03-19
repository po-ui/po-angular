import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean, uuid } from '../../../utils/util';

/**
 * @description
 *
 * O componente `po-tab` renderiza uma aba na qual envolve um conteúdo HTML.
 *
 * Com este componente é possível atribuir um rótulo para auxiliar na identificação do conteúdo, ativar para que o mesmo seja exibido,
 * desabilitar para impossibilitar o acesso, bem como ocultar para indisponibilizar a aba.
 *
 * > Para controlar a navegação entre diversas abas, utilizar o componente [`po-tabs`](/documentation/po-tabs) ou [`po-context-tabs`](/documentation/po-context-tabs).
 */
@Directive()
export abstract class PoTabBaseComponent {
  /** Rótulo da aba. */
  @Input('p-label') label: string;

  /**
   * @optional
   *
   * @description
   *
   * Esconde o botão de fechar a aba.
   *
   * > Atenção: Propriedade disponível somente no `po-context-tabs`.
   *
   * @default `false`
   */
  @Input({ alias: 'p-hide-close', transform: convertToBoolean }) hideClose: boolean = false;

  /** Método disparado ao clicar na aba. */
  @Output('p-click') click = new EventEmitter();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao clicar no botão de fechar a aba.
   *
   * > Atenção: Propriedade disponível somente no `po-context-tabs`.
   *
   */
  @Output('p-close-tab') closeTab = new EventEmitter();

  // ID da aba
  id?: string = uuid();

  private _active?: boolean = false;
  private _disabled?: boolean = false;
  private _hide?: boolean = false;
  widthButton;

  /**
   * @optional
   *
   * @description
   *
   * Ativa a aba exibindo seu conteúdo.
   *
   * > Sugere-se utilizar na aba de conteúdo inicial.
   *
   * @default `false`
   */
  @Input('p-active') set active(active: boolean) {
    this._active = convertToBoolean(active);
    this.setDisplayOnActive();
  }

  get active(): boolean {
    return this._active;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita a aba.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(disabled: boolean) {
    this._disabled = convertToBoolean(disabled);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Oculta a aba.
   *
   * > Atenção: Para correto funcionamento do componente, indicamos essa propriedade para esconder e exibir e não *ngIf.
   *
   * @default `false`
   */
  @Input('p-hide') set hide(hide: boolean) {
    this._hide = convertToBoolean(hide);
  }

  get hide(): boolean {
    return this._hide;
  }

  protected abstract setDisplayOnActive();
}

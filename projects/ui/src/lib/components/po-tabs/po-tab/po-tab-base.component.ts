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
 * > Para controlar a navegação entre diversas abas, utilizar o componente [`po-tabs`](/documentation/po-tabs).
 */
@Directive()
export abstract class PoTabBaseComponent {
  private _active?: boolean = false;
  private _disabled?: boolean = false;
  private _hide?: boolean = false;

  // ID da aba
  id?: string = uuid();

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
   * @default `false`
   */
  @Input('p-hide') set hide(hide: boolean) {
    this._hide = convertToBoolean(hide);
  }

  get hide(): boolean {
    return this._hide;
  }

  /** Rótulo da aba. */
  @Input('p-label') label: string;

  /** Método disparado ao clicar na aba. */
  @Output('p-click') click = new EventEmitter();

  protected abstract setDisplayOnActive();
}

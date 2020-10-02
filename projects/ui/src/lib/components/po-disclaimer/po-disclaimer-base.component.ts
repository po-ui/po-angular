import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

const PO_DISCLAIMER_TYPES = ['default', 'danger'];
const PO_DISCLAIMER_DEFAULT_TYPE = 'default';

/**
 * @docsPrivate
 *
 * @description
 *
 * O componente po-disclaimer é responsável por representar tags.
 * Seu uso é recomendado em buscas e em campos onde é necessário representar objetos selecionados,
 * como por exemplo, no po-multi-select.
 *
 */
@Directive()
export class PoDisclaimerBaseComponent {
  private _type: string = 'default';
  private _hideClose?: boolean = false;

  showDisclaimer = true;

  /**
   * Label que aparecerá dentro do po-disclaimer.
   * Quando não for definido um label será apresentada a propriedade p-value.
   */
  @Input('p-label') label?: string;

  /** Valor do po-disclaimer. */
  @Input('p-value') value: string;

  /** Nome da propriedade vinculada à este po-disclaimer. */
  @Input('p-property') property?: string;

  /**
   * @description
   *
   * Esta propriedade esconde o botão para fechamento do po-disclaimer, ao utilizar esta propriedade
   * sem passar valor a mesma é setada como false, onde o botão de fechamento está visível.
   *
   * @default false
   */
  @Input('p-hide-close') set hideClose(value: boolean) {
    this._hideClose = <any>value === '' ? true : convertToBoolean(value);
  }

  get hideClose(): boolean {
    return this._hideClose;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao fechar o disclaimer.
   * Para este evento será passado como parâmetro um objeto com value, label e property.
   */
  @Output('p-close-action') closeAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @description
   *
   * Tipo do po-disclaimer. Pode ser 'default' ou 'danger'.
   *
   * @default default
   * @optional
   */
  @Input('p-type') set type(type: string) {
    this._type = PO_DISCLAIMER_TYPES.includes(type) ? type : PO_DISCLAIMER_DEFAULT_TYPE;
  }

  get type(): string {
    return this._type;
  }

  close(): void {
    this.showDisclaimer = false;
    this.closeAction.emit({ value: this.value, label: this.label, property: this.property });
  }

  getLabel() {
    return this.label ? this.label : this.value;
  }
}

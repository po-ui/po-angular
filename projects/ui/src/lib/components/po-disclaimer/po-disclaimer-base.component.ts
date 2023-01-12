import { PoLanguageService } from './../../services/po-language/po-language.service';
import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { PoDisclaimerLiterals } from './po-disclaimer.literals';

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
   * @optional
   *
   * @description
   *
   * Evento disparado ao fechar o disclaimer.
   * Para este evento será passado como parâmetro um objeto com value, label e property.
   */
  @Output('p-close-action') closeAction: EventEmitter<any> = new EventEmitter<any>();

  literals: any;
  showDisclaimer = true;

  private _type: string = 'default';
  private _hideClose?: boolean = false;

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

  constructor(private languageService: PoLanguageService) {
    const language = this.languageService.getShortLanguage();
    this.literals = {
      ...PoDisclaimerLiterals[language]
    };
  }

  close(): void {
    this.showDisclaimer = false;
    this.closeAction.emit({ value: this.value, label: this.label, property: this.property });
  }

  getLabel() {
    return this.label ? this.label : this.value;
  }

  setAriaLabel() {
    return this.label ? this.label + ' ' + this.literals.remove : this.value + ' ' + this.literals.remove;
  }
}

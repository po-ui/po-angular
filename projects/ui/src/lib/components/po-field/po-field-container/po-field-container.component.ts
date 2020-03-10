import { Component, Input } from '@angular/core';

import { convertToBoolean, getShortBrowserLanguage } from '../../../utils/util';

/**
 * @docsPrivate
 *
 * Componente de uso interno, responsável por atribuir uma label para o campo
 */
@Component({
  selector: 'po-field-container',
  templateUrl: './po-field-container.component.html'
})
export class PoFieldContainerComponent {
  private _optional: boolean = false;

  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help: string;

  /** Indica se o campo será opcional. */
  @Input('p-optional') set optional(value: boolean) {
    this._optional = convertToBoolean(value);
  }

  get optional() {
    return this._optional;
  }

  getOptionalText() {
    const browserLanguage = getShortBrowserLanguage();

    const optional = {
      pt: '(Opcional)',
      en: '(Optional)',
      es: '(Opcional)'
    };

    return optional[browserLanguage];
  }
}

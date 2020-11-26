import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poFieldContainerLiterals } from './po-field-container-literals';

/**
 * @docsPrivate
 *
 * Componente de uso interno, responsável por atribuir uma label para o campo
 */
@Component({
  selector: 'po-field-container',
  templateUrl: './po-field-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoFieldContainerComponent {
  literals;

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

  constructor(languageService: PoLanguageService) {
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poFieldContainerLiterals[language]
    };
  }
}

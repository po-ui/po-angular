import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
export class PoFieldContainerComponent implements OnInit, OnChanges {
  /** Indica se o campo será desabilitado. */
  @Input('p-disabled') disabled: boolean;

  /** Identificador do campo */
  @Input('p-id') id: string;

  /** Label do campo. */
  @Input('p-label') label?: string;

  /** Texto de apoio do campo. */
  @Input('p-help') help: string;

  literals: object;
  requirement: string;

  private _optional: boolean = false;
  private _required: boolean = false;

  /** Indica se o campo será opcional. */
  @Input('p-optional') set optional(value: boolean) {
    this._optional = convertToBoolean(value);
  }

  get optional() {
    return this._optional;
  }

  /** Indica se o campo será obrigatório. */
  @Input('p-required') set required(value: boolean) {
    this._required = convertToBoolean(value);
  }

  get required() {
    return this._required;
  }

  /** Define se a indicação de campo obrigatório será exibida. */
  @Input('p-show-required') showRequired: boolean = false;

  constructor(languageService: PoLanguageService) {
    const language = languageService.getShortLanguage();

    this.literals = {
      ...poFieldContainerLiterals[language]
    };
  }

  ngOnInit(): void {
    this.setRequirement();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.help || changes.label || changes.optional || changes.required || changes.showRequired) {
      this.setRequirement();
    }
  }

  private setRequirement(): void {
    if (this.label || this.help) {
      if (!this.required && this.optional) {
        this.requirement = this.literals['optional'];
      } else if (this.required && this.showRequired) {
        this.requirement = this.literals['required'];
      } else {
        this.requirement = undefined;
      }
    }
  }
}

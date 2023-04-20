import { Component, forwardRef, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoTableColumn } from '../interfaces/po-table-column.interface';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoCheckboxGroupComponent } from '../../po-field/po-checkbox-group/po-checkbox-group.component';

export const poTableListManagerLiterals = {
  en: {
    up: 'up',
    down: 'down',
    otherColumns: 'Other columns'
  },
  es: {
    up: 'arriba',
    down: 'abajo',
    otherColumns: 'Otras columnas'
  },
  pt: {
    up: 'acima',
    down: 'abaixo',
    otherColumns: 'Outras colunas'
  },
  ru: {
    up: 'вверх',
    down: 'вниз',
    otherColumns: 'Другие столбцы'
  }
};

type Direction = 'up' | 'down';

@Component({
  selector: 'po-table-list-manager',
  templateUrl: './po-table-list-manager.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoTableListManagerComponent),
      multi: true
    }
  ]
})
export class PoTableListManagerComponent extends PoCheckboxGroupComponent {
  @Output('p-change-position')
  private changePosition = new EventEmitter<any>();

  @Input('p-columns-manager') columnsManager: Array<PoTableColumn>;

  literals;

  constructor(languageService: PoLanguageService, changeDetector: ChangeDetectorRef) {
    super(changeDetector);

    const language = languageService.getShortLanguage();

    this.literals = {
      ...poTableListManagerLiterals[poLocaleDefault],
      ...poTableListManagerLiterals[language]
    };
  }

  emitChangePosition(option, direction: Direction) {
    const infoPosition = { option, direction };
    const hasDisabled: boolean = this.verifyArrowDisabled(option, direction);
    if (!hasDisabled) {
      this.changePosition.emit(infoPosition);
    }
  }

  verifyArrowDisabled(option, direction: Direction) {
    const index = this.columnsManager.findIndex(el => el.property === option.value);
    const existsDetail = this.columnsManager.some(function (el) {
      return el.property === 'detail';
    });
    const valueSubtraction = existsDetail ? 2 : 1;

    if (index === 0 && direction === 'up') {
      return true;
    }

    if (index === this.columnsManager.length - valueSubtraction && direction === 'down') {
      return true;
    }

    return false;
  }
}

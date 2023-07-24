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
    otherColumns: 'Other columns',
    fixedColumns: 'Fixed'
  },
  es: {
    up: 'arriba',
    down: 'abajo',
    otherColumns: 'Otras columnas',
    fixedColumns: 'Fijado'
  },
  pt: {
    up: 'acima',
    down: 'abaixo',
    otherColumns: 'Outras colunas',
    fixedColumns: 'Fixo'
  },
  ru: {
    up: 'вверх',
    down: 'вниз',
    otherColumns: 'Другие столбцы',
    fixedColumns: 'зафиксированный'
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

  @Output('p-change-fixed')
  private changeColumnFixed = new EventEmitter<any>();

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
    if (!this.isFixed(option)) {
      const infoPosition = { option, direction };
      const hasDisabled: boolean = this.verifyArrowDisabled(option, direction);
      // this.mantemFixo(option);
      if (!hasDisabled) {
        this.changePosition.emit(infoPosition);
      }
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

  emitFixed(option) {
    if (option.visible) {
      const index = this.columnsManager.findIndex(el => el.property === option.value);

      if (
        this.columnsManager[index].fixed === null ||
        this.columnsManager[index].fixed === undefined ||
        this.columnsManager[index].fixed === false
      ) {
        this.columnsManager[index].fixed = true;
        option.fixed = true;
      } else {
        this.columnsManager[index].fixed = false;
        option.fixed = false;
      }
      this.changeColumnFixed.emit(option);
    }
  }

  isFixed(option) {
    const index = this.columnsManager.findIndex(el => el.property === option.value);
    if (this.columnsManager[index].fixed === true) {
      return true;
    }
    return false;
  }

  eventClick(option) {
    console.log(option);
    if (this.isFixed(option)) {
      const index = this.columnsManager.findIndex(el => el.property === option.value);
      this.columnsManager[index].fixed = false;
      option.fixed = false;
    } else {
      console.log('não esta fixo');
    }
    this.checkOption(option);
  }

  existedFixedItem() {
    return this.columnsManager.some(option => option['fixed'] === true);
  }
}

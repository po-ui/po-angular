import { ChangeDetectorRef, Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { poLocaleDefault } from '../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { convertToBoolean } from '../../../utils/util';
import { PoCheckboxGroupComponent } from '../../po-field/po-checkbox-group/po-checkbox-group.component';
import { PoTableColumn } from '../interfaces/po-table-column.interface';

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

  @Input({ alias: 'p-hide-action-fixed-columns', transform: convertToBoolean }) hideActionFixedColumns: boolean = false;

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

    if (index !== 0 && direction === 'up' && this.columnsManager[index - 1].fixed) {
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

  existedFixedItem() {
    return this.columnsManager.some(option => option['fixed'] === true);
  }

  checksIfHasFiveFixed(option) {
    const isMoreThanFive = this.columnsManager.filter(item => item.fixed === true).length > 4;
    const isNotFixed = !this.isFixed(option);

    return isMoreThanFive && isNotFixed;
  }

  clickSwitch(option) {
    this.checkOption(option);
  }
}

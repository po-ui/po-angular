import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  QueryList,
  ViewChildren
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoTimerBaseComponent } from './po-timer-base.component';
import { PoTimerLiterals } from './po-timer.literals';

/**
 * @docsExtends PoTimerBaseComponent
 *
 * @example
 *
 * <example name="po-timer-basic" title="PO Timer Basic">
 *  <file name="sample-po-timer-basic/sample-po-timer-basic.component.html"> </file>
 *  <file name="sample-po-timer-basic/sample-po-timer-basic.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-timer',
  templateUrl: './po-timer.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PoTimerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTimerComponent extends PoTimerBaseComponent {
  @ViewChildren('cell') cells: QueryList<ElementRef>;

  ariaLabel: string;
  literals: any;

  constructor() {
    const languageService = inject(PoLanguageService);

    super(languageService);

    const language = languageService.getShortLanguage();
    this.literals = {
      ...PoTimerLiterals[language]
    };
    this.ariaLabel = this.literals.selectTime;
  }

  /** Implementação do ControlValueAccessor */
  writeValue(value: string): void {
    this.setValueFromString(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /** Navegação por teclado entre células. */
  onCellKeydown(event: KeyboardEvent, column: string, currentValue: number): void {
    const list = this.getColumnList(column);
    const currentIndex = list.indexOf(currentValue);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : list.length - 1;
        this.focusCell(column, list[nextIndex]);
        break;

      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < list.length - 1 ? currentIndex + 1 : 0;
        this.focusCell(column, list[nextIndex]);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectValue(column, currentValue);
        break;

      case 'Escape':
        event.preventDefault();
        this.close.emit();
        break;
    }
  }

  private getColumnList(column: string): Array<number> {
    switch (column) {
      case 'hour':
        return this.hours;
      case 'minute':
        return this.minutes;
      case 'second':
        return this.seconds;
      default:
        return [];
    }
  }

  private selectValue(column: string, value: number): void {
    switch (column) {
      case 'hour':
        this.selectHour(value);
        break;
      case 'minute':
        this.selectMinute(value);
        break;
      case 'second':
        this.selectSecond(value);
        break;
    }
  }

  private focusCell(column: string, value: number): void {
    const formattedValue = value.toString().padStart(2, '0');
    const buttons = document.querySelectorAll(
      `po-timer .po-timer-column[aria-label="${this.getColumnLabel(column)}"] .po-timer-cell`
    );
    buttons.forEach((btn: HTMLElement) => {
      if (btn.textContent?.trim() === formattedValue) {
        btn.focus();
      }
    });
  }

  private getColumnLabel(column: string): string {
    switch (column) {
      case 'hour':
        return this.literals.hours;
      case 'minute':
        return this.literals.minutes;
      case 'second':
        return this.literals.seconds;
      default:
        return '';
    }
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject
} from '@angular/core';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoTimerBaseComponent } from './po-timer-base.component';

/**
 * @docsExtends PoTimerBaseComponent
 *
 * @example
 *
 * <example name="po-timer-basic" title="PO Timer Basic">
 *  <file name="sample-po-timer-basic/sample-po-timer-basic.component.html"> </file>
 *  <file name="sample-po-timer-basic/sample-po-timer-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-timer-labs" title="PO Timer Labs">
 *  <file name="sample-po-timer-labs/sample-po-timer-labs.component.html"> </file>
 *  <file name="sample-po-timer-labs/sample-po-timer-labs.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-timer',
  templateUrl: './po-timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoTimerComponent extends PoTimerBaseComponent implements OnInit {
  @ViewChildren('hourCell') hourCells: QueryList<ElementRef>;
  @ViewChildren('minuteCell') minuteCells: QueryList<ElementRef>;
  @ViewChildren('secondCell') secondCells: QueryList<ElementRef>;

  private changeDetector = inject(ChangeDetectorRef);

  constructor() {
    const languageService = inject(PoLanguageService);
    super(languageService);
  }

  ngOnInit(): void {
    this.generateHours();
    this.generateMinutes();
    this.generateSeconds();
  }

  /** Seleciona uma hora. */
  onSelectHour(hour: number): void {
    if (this.isHourDisabled(hour)) {
      return;
    }

    this.selectedHour = hour;
    this.emitChange();
    this.changeDetector.markForCheck();
  }

  /** Seleciona um minuto. */
  onSelectMinute(minute: number): void {
    if (this.isMinuteDisabled(minute)) {
      return;
    }

    this.selectedMinute = minute;
    this.emitChange();
    this.changeDetector.markForCheck();
  }

  /** Seleciona um segundo. */
  onSelectSecond(second: number): void {
    if (this.isSecondDisabled(second)) {
      return;
    }

    this.selectedSecond = second;
    this.emitChange();
    this.changeDetector.markForCheck();
  }

  /** Alterna o período AM/PM. */
  onSelectPeriod(newPeriod: string): void {
    this.period = newPeriod;
    this.emitChange();
    this.changeDetector.markForCheck();
  }

  /** Trata navegação via teclado nas células. */
  onCellKeydown(event: KeyboardEvent, type: 'hour' | 'minute' | 'second', index: number): void {
    const cells = this.getCellsList(type);

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.focusCell(cells, index - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusCell(cells, index + 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectCellByType(type, index);
        break;
      default:
        break;
    }
  }

  /** Define o horário a partir de um valor externo. */
  writeValue(time: string): void {
    this.setTimeFromString(time);
    this.changeDetector.markForCheck();
  }

  private emitChange(): void {
    const value = this.buildTimeValue();

    if (value) {
      this.change.emit(value);
    }
  }

  private getCellsList(type: 'hour' | 'minute' | 'second'): QueryList<ElementRef> {
    switch (type) {
      case 'hour':
        return this.hourCells;
      case 'minute':
        return this.minuteCells;
      case 'second':
        return this.secondCells;
      default:
        return this.hourCells;
    }
  }

  private focusCell(cells: QueryList<ElementRef>, index: number): void {
    if (!cells) {
      return;
    }

    const cellArray = cells.toArray();

    if (index >= 0 && index < cellArray.length) {
      cellArray[index].nativeElement.focus();
    }
  }

  private selectCellByType(type: 'hour' | 'minute' | 'second', index: number): void {
    switch (type) {
      case 'hour':
        this.onSelectHour(this.hours[index]);
        break;
      case 'minute':
        this.onSelectMinute(this.minutes[index]);
        break;
      case 'second':
        this.onSelectSecond(this.seconds[index]);
        break;
    }
  }
}

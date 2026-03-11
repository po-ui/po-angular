import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  ViewChildren,
  inject
} from '@angular/core';

import { PoLanguageService } from '../../services/po-language/po-language.service';

import { PoTimerBaseComponent } from './po-timer-base.component';

/** Número de repetições do array para simular o infinity scroll. */
const INFINITY_SCROLL_REPEAT = 3;

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

  /** Arrays triplicados para simular infinity scroll. */
  displayHours: Array<number> = [];
  displayMinutes: Array<number> = [];
  displaySeconds: Array<number> = [];

  private changeDetector = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  constructor() {
    const languageService = inject(PoLanguageService);
    super(languageService);
  }

  ngOnInit(): void {
    this.generateHours();
    this.generateMinutes();
    this.generateSeconds();
    this.buildDisplayArrays();
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
        this.navigateInfinityScroll(type, index, -1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateInfinityScroll(type, index, 1);
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

  /** Trata o scroll da roda do mouse nas colunas (infinity scroll). */
  onColumnWheel(event: WheelEvent, type: 'hour' | 'minute' | 'second'): void {
    event.preventDefault();

    const scrollContainer = this.getScrollContainer(type);
    if (!scrollContainer) {
      return;
    }

    const scrollAmount = event.deltaY > 0 ? 40 : -40;

    this.ngZone.runOutsideAngular(() => {
      scrollContainer.scrollTop += scrollAmount;
      this.checkInfinityScrollBounds(scrollContainer, type);
    });
  }

  /** Define o horário a partir de um valor externo. */
  writeValue(time: string): void {
    this.setTimeFromString(time);
    this.changeDetector.markForCheck();
  }

  /** Track function para o @for do infinity scroll. */
  trackByIndex(index: number, _item: number): number {
    return index;
  }

  private buildDisplayArrays(): void {
    this.displayHours = this.repeatArray(this.hours);
    this.displayMinutes = this.repeatArray(this.minutes);
    this.displaySeconds = this.repeatArray(this.seconds);
  }

  private repeatArray(source: Array<number>): Array<number> {
    if (!source || source.length === 0) {
      return [];
    }

    const result: Array<number> = [];
    for (let i = 0; i < INFINITY_SCROLL_REPEAT; i++) {
      result.push(...source);
    }
    return result;
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

  private getScrollContainer(type: 'hour' | 'minute' | 'second'): HTMLElement {
    const cells = this.getCellsList(type);
    if (!cells || cells.length === 0) {
      return null;
    }
    return cells.first.nativeElement.parentElement;
  }

  private checkInfinityScrollBounds(container: HTMLElement, type: 'hour' | 'minute' | 'second'): void {
    const sourceArray = this.getSourceArray(type);
    if (!sourceArray || sourceArray.length === 0) {
      return;
    }

    const cellHeight = container.scrollHeight / (sourceArray.length * INFINITY_SCROLL_REPEAT);
    const sectionHeight = cellHeight * sourceArray.length;

    if (container.scrollTop <= cellHeight) {
      container.scrollTop += sectionHeight;
    } else if (container.scrollTop >= sectionHeight * 2 - container.clientHeight) {
      container.scrollTop -= sectionHeight;
    }
  }

  private getSourceArray(type: 'hour' | 'minute' | 'second'): Array<number> {
    switch (type) {
      case 'hour':
        return this.hours;
      case 'minute':
        return this.minutes;
      case 'second':
        return this.seconds;
      default:
        return this.hours;
    }
  }

  private navigateInfinityScroll(type: 'hour' | 'minute' | 'second', currentIndex: number, direction: number): void {
    const cells = this.getCellsList(type);
    if (!cells) {
      return;
    }

    const newIndex = currentIndex + direction;
    const cellArray = cells.toArray();

    if (newIndex >= 0 && newIndex < cellArray.length) {
      cellArray[newIndex].nativeElement.focus();
    }
  }

  private selectCellByType(type: 'hour' | 'minute' | 'second', index: number): void {
    const displayArray = this.getDisplayArray(type);
    if (index >= 0 && index < displayArray.length) {
      switch (type) {
        case 'hour':
          this.onSelectHour(displayArray[index]);
          break;
        case 'minute':
          this.onSelectMinute(displayArray[index]);
          break;
        case 'second':
          this.onSelectSecond(displayArray[index]);
          break;
      }
    }
  }

  private getDisplayArray(type: 'hour' | 'minute' | 'second'): Array<number> {
    switch (type) {
      case 'hour':
        return this.displayHours;
      case 'minute':
        return this.displayMinutes;
      case 'second':
        return this.displaySeconds;
      default:
        return this.displayHours;
    }
  }
}

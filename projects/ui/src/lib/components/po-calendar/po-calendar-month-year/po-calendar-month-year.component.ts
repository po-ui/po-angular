import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';

import { PoCalendarLangService } from '../services/po-calendar.lang.service';
import { PoButtonComponent } from '../../po-button/po-button.component';

@Component({
  selector: 'po-calendar-month-year',
  template: `
    <div
      class="po-calendar-month-year-container"
      [class.po-calendar-month-year-container--year-only]="isYearMode"
    >
      @if (isMonthYearMode) {
        <div class="po-calendar-month-year-month-list" role="listbox" aria-label="Months">
          @for (month of displayMonths; track trackByMonth($index); let i = $index) {
            <div
              class="po-calendar-month-year-month-item"
              [class.po-calendar-month-year-month-item--selected]="isMonthSelected(i)"
              role="option"
              [attr.aria-selected]="isMonthSelected(i)"
            >
              <po-button
                #monthButton
                [p-kind]="getMonthButtonKind(i)"
                [p-label]="month"
                [p-disabled]="isMonthDisabled(i)"
                [p-size]="size"
                [attr.tabindex]="getMonthTabIndex(i)"
                (p-click)="onSelectMonth(i)"
                (keydown)="onMonthKeydown($event, i)"
              >
              </po-button>
            </div>
          }
        </div>
      }

      <div
        class="po-calendar-month-year-year-list"
        [class.po-calendar-month-year-year-list--full-width]="isYearMode"
        role="listbox"
        aria-label="Years"
        (keydown)="onYearListKeydown($event)"
      >
        @for (year of displayYears; track trackByYear($index, year); let i = $index) {
          <div
            class="po-calendar-month-year-year-item"
            [class.po-calendar-month-year-year-item--selected]="isYearSelected(year)"
            role="option"
            [attr.aria-selected]="isYearSelected(year)"
          >
            <po-button
              #yearButton
              [p-kind]="getYearButtonKind(year)"
              [p-label]="year.toString()"
              [p-disabled]="isYearDisabled(year)"
              [p-size]="size"
              [attr.tabindex]="getYearTabIndex(i)"
              (p-click)="onSelectYear(year)"
              (keydown)="onYearKeydown($event, i)"
            >
            </po-button>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarMonthYearComponent implements OnInit, OnChanges {
  private readonly poCalendarLangService = inject(PoCalendarLangService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input('p-locale') set locale(value: string) {
    this._locale = value;
    this.setupMonths();
  }
  get locale(): string {
    return this._locale;
  }

  @Input('p-selected-month') selectedMonth: number = null;
  @Input('p-selected-year') selectedYear: number = null;
  @Input('p-min-date') minDate: Date;
  @Input('p-max-date') maxDate: Date;
  @Input('p-year-range') yearRange: number = 150;
  @Input('p-mode') mode: 'monthYear' | 'year' = 'monthYear';
  @Input('p-size') size: string;

  @Output('p-select') select = new EventEmitter<{ month?: number; year: number }>();
  @Output('p-close') close = new EventEmitter<void>();

  @ViewChildren('monthButton') monthButtons: QueryList<PoButtonComponent>;
  @ViewChildren('yearButton') yearButtons: QueryList<PoButtonComponent>;

  displayMonths: Array<string> = [];
  displayYears: Array<number> = [];

  focusedMonthIndex: number = 0;
  focusedYearIndex: number = 0;

  private _locale: string;
  private currentYear: number = new Date().getFullYear();

  get isMonthYearMode(): boolean {
    return this.mode === 'monthYear';
  }

  get isYearMode(): boolean {
    return this.mode === 'year';
  }

  ngOnInit(): void {
    this.setupMonths();
    this.setupYears();
    this.setInitialFocus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.locale && !changes.locale.firstChange) {
      this.setupMonths();
    }
    if (changes.yearRange || changes.minDate || changes.maxDate) {
      this.setupYears();
    }
    if (changes.selectedMonth || changes.selectedYear) {
      this.setInitialFocus();
    }
  }

  private setupMonths(): void {
    if (this._locale) {
      this.poCalendarLangService.setLanguage(this._locale);
    }
    this.displayMonths = this.poCalendarLangService.getMonthsArray().map(
      (month: string) => month.charAt(0).toUpperCase() + month.slice(1)
    );
    this.cdr.markForCheck();
  }

  private setupYears(): void {
    const baseYear = this.currentYear;
    let minYear = baseYear - this.yearRange;
    let maxYear = baseYear + this.yearRange;

    if (this.minDate) {
      const minDateYear = this.minDate instanceof Date ? this.minDate.getFullYear() : new Date(this.minDate).getFullYear();
      if (minDateYear > minYear) {
        minYear = minDateYear;
      }
    }

    if (this.maxDate) {
      const maxDateYear = this.maxDate instanceof Date ? this.maxDate.getFullYear() : new Date(this.maxDate).getFullYear();
      if (maxDateYear < maxYear) {
        maxYear = maxDateYear;
      }
    }

    this.displayYears = [];
    for (let i = minYear; i <= maxYear; i++) {
      this.displayYears.push(i);
    }
    this.cdr.markForCheck();
  }

  private setInitialFocus(): void {
    if (this.selectedMonth !== null && this.selectedMonth !== undefined && this.selectedMonth >= 0 && this.selectedMonth <= 11) {
      this.focusedMonthIndex = this.selectedMonth;
    } else {
      this.focusedMonthIndex = 0;
    }

    if (this.selectedYear !== null && this.selectedYear !== undefined) {
      const yearIndex = this.displayYears.indexOf(this.selectedYear);
      this.focusedYearIndex = yearIndex !== -1 ? yearIndex : this.displayYears.indexOf(this.currentYear);
    } else {
      this.focusedYearIndex = this.displayYears.indexOf(this.currentYear);
    }

    if (this.focusedYearIndex === -1) {
      this.focusedYearIndex = 0;
    }
  }

  onSelectMonth(monthIndex: number): void {
    this.selectedMonth = monthIndex;
    this.focusedMonthIndex = monthIndex;
    this.emitSelection();
    this.cdr.markForCheck();
  }

  onSelectYear(year: number): void {
    this.selectedYear = year;
    this.focusedYearIndex = this.displayYears.indexOf(year);
    this.emitSelection();
    this.cdr.markForCheck();
  }

  private emitSelection(): void {
    if (this.isMonthYearMode) {
      if (this.selectedMonth !== null && this.selectedMonth !== undefined && this.selectedYear !== null && this.selectedYear !== undefined) {
        this.select.emit({ month: this.selectedMonth, year: this.selectedYear });
      }
    } else {
      if (this.selectedYear !== null && this.selectedYear !== undefined) {
        this.select.emit({ year: this.selectedYear });
      }
    }
  }

  isMonthSelected(index: number): boolean {
    return this.selectedMonth === index;
  }

  isYearSelected(year: number): boolean {
    return this.selectedYear === year;
  }

  isMonthDisabled(monthIndex: number): boolean {
    if (!this.selectedYear) {
      return false;
    }

    if (this.minDate) {
      const minYear = this.minDate.getFullYear();
      const minMonth = this.minDate.getMonth();
      if (this.selectedYear < minYear || (this.selectedYear === minYear && monthIndex < minMonth)) {
        return true;
      }
    }

    if (this.maxDate) {
      const maxYear = this.maxDate.getFullYear();
      const maxMonth = this.maxDate.getMonth();
      if (this.selectedYear > maxYear || (this.selectedYear === maxYear && monthIndex > maxMonth)) {
        return true;
      }
    }

    return false;
  }

  isYearDisabled(year: number): boolean {
    if (this.minDate && year < this.minDate.getFullYear()) {
      return true;
    }
    if (this.maxDate && year > this.maxDate.getFullYear()) {
      return true;
    }
    return false;
  }

  getMonthButtonKind(index: number): string {
    return this.isMonthSelected(index) ? 'secondary' : 'tertiary';
  }

  getYearButtonKind(year: number): string {
    return this.isYearSelected(year) ? 'secondary' : 'tertiary';
  }

  getMonthTabIndex(index: number): number {
    return index === this.focusedMonthIndex ? 0 : -1;
  }

  getYearTabIndex(index: number): number {
    return index === this.focusedYearIndex ? 0 : -1;
  }

  onMonthKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateMonth(index, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateMonth(index, -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isMonthDisabled(index)) {
          this.onSelectMonth(index);
        }
        break;
      case 'Tab':
        if (event.shiftKey) {
          event.preventDefault();
          this.close.emit();
        }
        break;
    }
  }

  onYearKeydown(event: KeyboardEvent, yearIndex: number): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateYear(yearIndex, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateYear(yearIndex, -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.isYearDisabled(this.displayYears[yearIndex])) {
          this.onSelectYear(this.displayYears[yearIndex]);
        }
        break;
      case 'Tab':
        if (!event.shiftKey && this.isYearMode) {
          event.preventDefault();
          this.close.emit();
        }
        if (event.shiftKey && !this.isMonthYearMode) {
          event.preventDefault();
          this.close.emit();
        }
        break;
    }
  }

  onYearListKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      this.close.emit();
    }
  }

  private navigateMonth(currentIndex: number, direction: number): void {
    let newIndex = currentIndex + direction;
    while (newIndex >= 0 && newIndex < this.displayMonths.length) {
      if (!this.isMonthDisabled(newIndex)) {
        this.focusedMonthIndex = newIndex;
        this.cdr.detectChanges();
        this.focusMonthButton(newIndex);
        return;
      }
      newIndex += direction;
    }
  }

  private navigateYear(currentIndex: number, direction: number): void {
    let newIndex = currentIndex + direction;
    while (newIndex >= 0 && newIndex < this.displayYears.length) {
      if (!this.isYearDisabled(this.displayYears[newIndex])) {
        this.focusedYearIndex = newIndex;
        this.cdr.detectChanges();
        this.focusYearButton(newIndex);
        return;
      }
      newIndex += direction;
    }
  }

  private focusMonthButton(index: number): void {
    setTimeout(() => {
      const buttons = this.elementRef.nativeElement.querySelectorAll('.po-calendar-month-year-month-item po-button');
      if (buttons[index]) {
        const btn = buttons[index].querySelector('button');
        btn?.focus();
      }
    }, 0);
  }

  private focusYearButton(index: number): void {
    setTimeout(() => {
      const container = this.elementRef.nativeElement.querySelector('.po-calendar-month-year-year-list');
      const buttons = container?.querySelectorAll('.po-calendar-month-year-year-item po-button');
      if (buttons && buttons[index]) {
        const btn = buttons[index].querySelector('button');
        btn?.focus();
        btn?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  focusFirstMonth(): void {
    setTimeout(() => {
      this.focusMonthButton(this.focusedMonthIndex);
    }, 50);
  }

  focusFirstYear(): void {
    setTimeout(() => {
      this.focusYearButton(this.focusedYearIndex);
    }, 50);
  }

  scrollToSelectedYear(): void {
    setTimeout(() => {
      const container = this.elementRef.nativeElement.querySelector('.po-calendar-month-year-year-list');
      if (container) {
        const selectedEl = container.querySelector('.po-calendar-month-year-year-item--selected');
        if (selectedEl) {
          selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        } else {
          const currentYearIndex = this.displayYears.indexOf(this.currentYear);
          if (currentYearIndex !== -1) {
            const items = container.querySelectorAll('.po-calendar-month-year-year-item');
            if (items[currentYearIndex]) {
              items[currentYearIndex].scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          }
        }
      }
    }, 100);
  }

  trackByMonth(index: number): number {
    return index;
  }

  trackByYear(index: number, year: number): number {
    return year;
  }
}

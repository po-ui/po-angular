import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';

import { PoCalendarRangePreset } from '../interfaces/po-calendar-range-preset.interface';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';

@Component({
  selector: 'po-calendar-preset-list',
  templateUrl: './po-calendar-preset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarPresetListComponent implements AfterViewChecked {
  private readonly poCalendarLangService = inject(PoCalendarLangService);
  private readonly elementRef = inject(ElementRef);

  @Input('p-size') size: string;
  @Input('p-locale') locale: string;
  @Input('p-presets') presets: Array<PoCalendarRangePreset> = [];
  @Input('p-selected-preset') selectedPreset: string | null = null;

  @Output('p-close-calendar') closeCalendar = new EventEmitter<void>();
  @Output('p-select-preset') selectPreset = new EventEmitter<{ label: string; start: Date; end: Date }>();

  focusedIndex: number = 0;

  ngAfterViewChecked(): void {
    this.syncInnerButtonTabIndexes();
  }

  focusFirstPreset(): void {
    const buttons = this.getPresetButtons();
    this.focusPreset(buttons, 0);
  }

  focusLastPreset(): void {
    const buttons = this.getPresetButtons();
    const lastIndex = buttons.length - 1;
    this.focusPreset(buttons, Math.max(lastIndex, 0));
  }

  getDisplayLabel(preset: PoCalendarRangePreset): string {
    this.poCalendarLangService.setLanguage(this.locale);
    return this.poCalendarLangService.getPresetLabel(preset.label);
  }

  getTabIndex(index: number): number {
    return index === this.focusedIndex ? 0 : -1;
  }

  isSelected(preset: PoCalendarRangePreset): boolean {
    return this.selectedPreset === preset.label;
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    const buttons = this.getPresetButtons();

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = index < this.presets.length - 1 ? index + 1 : index;
      this.focusPreset(buttons, nextIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = index > 0 ? index - 1 : index;
      this.focusPreset(buttons, prevIndex);
    } else if (event.key === 'Tab' && !event.shiftKey) {
      this.resetFocusToFirst();
    } else if (event.key === 'Tab' && event.shiftKey) {
      this.closeCalendar.emit();
    }
  }

  resetFocusToFirst(): void {
    this.focusedIndex = 0;
  }

  onPresetClick(preset: PoCalendarRangePreset): void {
    const { start, end } = preset.dateRange(new Date());
    this.selectPreset.emit({ label: preset.label, start, end });
  }

  private focusPreset(buttons: Array<HTMLButtonElement>, index: number): void {
    if (buttons[index]) {
      this.focusedIndex = index;
      this.syncInnerButtonTabIndexes();
      buttons[index].focus();
    }
  }

  private getPresetButtons(): Array<HTMLButtonElement> {
    return Array.from(this.elementRef.nativeElement.querySelectorAll('.po-calendar-preset-item .po-button'));
  }

  private syncInnerButtonTabIndexes(): void {
    const buttons = this.getPresetButtons();
    buttons.forEach((button, index) => {
      button.setAttribute('tabindex', index === this.focusedIndex ? '0' : '-1');
    });
  }
}

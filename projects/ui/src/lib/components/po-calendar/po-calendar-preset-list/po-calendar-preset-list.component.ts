import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';

import { PoCalendarRangePreset } from '../interfaces/po-calendar-range-preset.interface';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';

@Component({
  selector: 'po-calendar-preset-list',
  templateUrl: './po-calendar-preset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarPresetListComponent {
  private readonly poCalendarLangService = inject(PoCalendarLangService);
  private _locale: string;

  @Input('p-size') size: string;
  @Input('p-presets') presets: Array<PoCalendarRangePreset> = [];
  @Input('p-selected-preset') selectedPreset: string | null = null;
  @Input('p-responsive') responsive: boolean = false;
  @Input('p-locale')
  set locale(value: string) {
    this._locale = value;
    this.poCalendarLangService.setLanguage(value);
  }

  get locale(): string {
    return this._locale;
  }

  @Output('p-close-calendar') closeCalendar = new EventEmitter<void>();
  @Output('p-select-preset') selectPreset = new EventEmitter<{ label: string; start: Date; end: Date }>();

  @ViewChildren('presetButton') presetButtons: QueryList<HTMLButtonElement>;

  focusedIndex: number = 0;

  getDisplayLabel(preset: PoCalendarRangePreset): string {
    return this.poCalendarLangService.getPresetLabel(preset.label);
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
    } else if (event.key === 'Tab' && event.shiftKey && !this.responsive) {
      this.closeCalendar.emit();
    }
  }

  resetFocusToFirst(): void {
    this.focusedIndex = 0;
  }

  isPresetDisabled(preset: PoCalendarRangePreset): boolean {
    return preset.isDisabled === true;
  }

  onPresetClick(preset: PoCalendarRangePreset): void {
    if (this.isPresetDisabled(preset)) {
      return;
    }
    const { start, end } = preset.dateRange(new Date());
    this.selectPreset.emit({ label: preset.label, start, end });
  }

  private focusPreset(buttons: Array<HTMLButtonElement>, index: number): void {
    if (buttons[index]) {
      this.focusedIndex = index;
      buttons[index].focus();
    }
  }

  private getPresetButtons(): Array<HTMLButtonElement> {
    return this.presetButtons.toArray();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { PoCalendarRangePreset } from '../interfaces/po-calendar-range-preset.interface';
import { PoCalendarLangService } from '../services/po-calendar.lang.service';

@Component({
  selector: 'po-calendar-preset-list',
  templateUrl: './po-calendar-preset-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoCalendarPresetListComponent {
  private poCalendarLangService = inject(PoCalendarLangService);

  @Input('p-presets') presets: Array<PoCalendarRangePreset> = [];
  @Input('p-locale') locale: string;
  @Input('p-selected-preset') selectedPreset: string | null = null;

  @Output('p-select-preset') selectPreset = new EventEmitter<{ label: string; start: Date; end: Date }>();

  getDisplayLabel(preset: PoCalendarRangePreset): string {
    this.poCalendarLangService.setLanguage(this.locale);
    return this.poCalendarLangService.getPresetLabel(preset.label);
  }

  onPresetClick(preset: PoCalendarRangePreset): void {
    const { start, end } = preset.dateRange(new Date());
    this.selectPreset.emit({ label: preset.label, start, end });
  }

  isSelected(preset: PoCalendarRangePreset): boolean {
    return this.selectedPreset === preset.label;
  }
}

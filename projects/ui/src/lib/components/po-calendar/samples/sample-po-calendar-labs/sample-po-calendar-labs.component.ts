import { Component, OnInit } from '@angular/core';

import { PoRadioGroupOption, PoCalendarMode, PoCalendarRangePreset } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-calendar-labs',
  templateUrl: './sample-po-calendar-labs.component.html',
  standalone: false
})
export class SamplePoCalendarLabsComponent implements OnInit {
  calendar: string = '';
  event: string = '';
  infoValue: any;
  locale: string = '';
  maxDate: string | Date = '';
  minDate: string | Date = '';
  mode: any;
  monthYearEvent: any;
  size: string = '';
  rangePresets: boolean = false;
  rangePresetsOrder: 'asc' | 'desc' = 'asc';
  customPresets: Array<PoCalendarRangePreset> = [];
  useCustomPresets: boolean = false;

  readonly localeOptions: Array<PoRadioGroupOption> = [
    { label: 'pt', value: 'pt' },
    { label: 'es', value: 'es' },
    { label: 'en', value: 'en' },
    { label: 'ru', value: 'ru' }
  ];

  readonly calendarModeOptions: Array<PoRadioGroupOption> = [
    { label: 'Range', value: PoCalendarMode.Range },
    { label: 'Unset', value: '' }
  ];

  public readonly sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' }
  ];

  public readonly presetsOrderOptions: Array<PoRadioGroupOption> = [
    { label: 'ASC', value: 'asc' },
    { label: 'DESC', value: 'desc' }
  ];

  readonly sampleCustomPresets: Array<PoCalendarRangePreset> = [
    {
      label: 'Próximos 3 meses',
      dateRange: (today: Date) => {
        const end = new Date(today);
        end.setMonth(end.getMonth() + 3);
        return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), end };
      }
    },
    {
      label: 'Última semana',
      dateRange: (today: Date) => {
        const start = new Date(today);
        start.setDate(start.getDate() - 7);
        return { start, end: new Date(today.getFullYear(), today.getMonth(), today.getDate()) };
      }
    }
  ];

  ngOnInit() {
    this.restore();
  }

  onCustomPresetsChange(value: boolean) {
    this.useCustomPresets = value;
    this.customPresets = value ? [...this.sampleCustomPresets] : [];
  }

  changeEvent(type: string, event?: any) {
    if (type === 'p-change') {
      this.calendar = event;
      this.infoValue = event;
    }

    if (type === 'p-change-month-year') {
      this.monthYearEvent = event;
      this.infoValue = event;
    }

    this.event = type;
  }

  restore() {
    this.calendar = '';
    this.event = '';
    this.infoValue = '';
    this.locale = '';
    this.maxDate = '';
    this.minDate = '';
    this.mode = undefined;
    this.size = 'medium';
    this.rangePresets = false;
    this.rangePresetsOrder = 'asc';
    this.customPresets = [];
    this.useCustomPresets = false;
  }
}

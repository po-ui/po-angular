import { Component, OnInit } from '@angular/core';

import { PoRadioGroupOption, PoCalendarMode } from '@po-ui/ng-components';

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

  ngOnInit() {
    this.restore();
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
  }
}

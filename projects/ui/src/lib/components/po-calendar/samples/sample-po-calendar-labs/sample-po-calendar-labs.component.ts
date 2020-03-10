import { Component, OnInit } from '@angular/core';

import { PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-calendar-labs',
  templateUrl: './sample-po-calendar-labs.component.html'
})
export class SamplePoCalendarLabsComponent implements OnInit {
  calendar;
  event;
  locale: string;
  maxDate: string | Date;
  minDate: string | Date;

  readonly localeOptions: Array<PoRadioGroupOption> = [
    { label: 'pt', value: 'pt' },
    { label: 'es', value: 'es' },
    { label: 'en', value: 'en' }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.calendar = undefined;
    this.event = undefined;
    this.locale = undefined;
    this.maxDate = undefined;
    this.minDate = undefined;
  }
}

import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoRadioGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-timer-labs',
  templateUrl: './sample-po-timer-labs.component.html',
  standalone: false
})
export class SamplePoTimerLabsComponent implements OnInit {
  event: string;
  format: string;
  locale: string;
  maxTime: string;
  minTime: string;
  minuteInterval: number;
  secondInterval: number;
  properties: Array<string>;
  size: string;
  timerValue: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'showSeconds', label: 'Show Seconds' }];

  public readonly formatOptions: Array<PoRadioGroupOption> = [
    { label: '24', value: '24' },
    { label: '12', value: '12' }
  ];

  public readonly localeOptions: Array<PoRadioGroupOption> = [
    { label: 'pt', value: 'pt' },
    { label: 'en', value: 'en' },
    { label: 'es', value: 'es' },
    { label: 'ru', value: 'ru' }
  ];

  public readonly sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.event = undefined;
    this.format = undefined;
    this.locale = undefined;
    this.maxTime = undefined;
    this.minTime = undefined;
    this.minuteInterval = undefined;
    this.secondInterval = undefined;
    this.properties = [];
    this.size = 'medium';
    this.timerValue = undefined;
  }
}

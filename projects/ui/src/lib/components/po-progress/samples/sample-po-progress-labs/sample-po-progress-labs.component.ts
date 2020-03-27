import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoProgressStatus, PoRadioGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-progress-labs',
  templateUrl: './sample-po-progress-labs.component.html'
})
export class SamplePoProgressLabsComponent implements OnInit {
  event: any;
  info: string;
  infoIcon: string;
  properties: Array<string>;
  status: PoProgressStatus;
  text: string;
  value: number;

  infoIconsOptions: Array<PoRadioGroupOption> = [
    { label: 'po-icon-exclamation', value: 'po-icon-exclamation' },
    { label: 'po-icon-ok', value: 'po-icon-ok' },
    { label: 'po-icon-user', value: 'po-icon-user' },
    { label: 'po-icon-no-signal', value: 'po-icon-no-signal' }
  ];

  propertiesOptions: Array<PoCheckboxGroupOption> = [{ label: 'Indeterminate', value: 'indeterminate' }];

  statusOptions: Array<PoRadioGroupOption> = [
    { label: 'Default', value: PoProgressStatus.Default },
    { label: 'Success', value: PoProgressStatus.Success },
    { label: 'Error', value: PoProgressStatus.Error }
  ];

  ngOnInit() {
    this.restore();
  }

  onEvent(event) {
    this.event = event;
  }

  restore() {
    this.event = undefined;
    this.info = undefined;
    this.infoIcon = undefined;
    this.properties = [];
    this.status = undefined;
    this.text = undefined;
    this.value = undefined;
  }
}

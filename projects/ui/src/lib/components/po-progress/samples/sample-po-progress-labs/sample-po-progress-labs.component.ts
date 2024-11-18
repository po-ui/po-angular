import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoProgressStatus, PoRadioGroupOption, PoProgressSize } from '@po-ui/ng-components';

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
  size: PoProgressSize = PoProgressSize.large;
  text: string;
  value: number;

  infoIconsOptions: Array<PoRadioGroupOption> = [
    { label: 'ph ph-warning-circle', value: 'ph ph-warning-circle' },
    { label: 'ph ph-check', value: 'ph ph-check' },
    { label: 'ph ph-user', value: 'ph ph-user' },
    { label: 'ph ph-cloud-slash', value: 'ph ph-cloud-slash' }
  ];

  propertiesOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Disabled Cancel', value: 'disabledCancel' },
    { label: 'Indeterminate', value: 'indeterminate' },
    { label: 'Show percentage', value: 'showPercentage' }
  ];

  statusOptions: Array<PoRadioGroupOption> = [
    { label: 'Default', value: PoProgressStatus.Default },
    { label: 'Success', value: PoProgressStatus.Success },
    { label: 'Error', value: PoProgressStatus.Error }
  ];

  sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'Medium', value: PoProgressSize.medium },
    { label: 'Large', value: PoProgressSize.large }
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
    this.size = PoProgressSize.large;
  }
}

import { Component, OnInit } from '@angular/core';

import { PoRadioGroupOption, PoSelectOption, PoTagOrientation, PoTagType } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-tag-labs',
  templateUrl: './sample-po-tag-labs.component.html',
  styles: [
    `
      .sample-tag-color-circle {
        border-radius: 10px;
        display: inline-block;
        height: 16px;
        margin-right: 4px;
        vertical-align: middle;
        width: 16px;
      }
    `
  ]
})
export class SamplePoTagLabsComponent implements OnInit {
  color: string;
  event: string;
  icon: boolean | string;
  inverse: boolean;
  label: string;
  orientation: PoTagOrientation;
  type: PoTagType;
  value: string;

  public readonly iconList: Array<PoSelectOption> = [
    { label: 'po-icon-bluetooth', value: 'po-icon-bluetooth' },
    { label: 'po-icon-like', value: 'po-icon-like' },
    { label: 'po-icon-light', value: 'po-icon-light' },
    { label: 'po-icon-star', value: 'po-icon-star' },
    { label: 'po-icon-settings', value: 'po-icon-settings' },
    { label: 'po-icon-world', value: 'po-icon-world' },
    { label: 'fa fa-address-card', value: 'fa fa-address-card' },
    { label: 'fa fa-bell', value: 'fa fa-bell' }
  ];

  public readonly orientationOptions: Array<PoRadioGroupOption> = [
    { label: 'Horizontal', value: PoTagOrientation.Horizontal },
    { label: 'Vertical', value: PoTagOrientation.Vertical }
  ];

  public readonly typeOptions: Array<PoRadioGroupOption> = [
    { label: 'None', value: undefined },
    { label: 'Info', value: PoTagType.Info },
    { label: 'Danger', value: PoTagType.Danger },
    { label: 'Success', value: PoTagType.Success },
    { label: 'Warning', value: PoTagType.Warning }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.color = undefined;
    this.icon = undefined;
    this.label = undefined;
    this.orientation = undefined;
    this.value = 'PO Tag';
    this.type = undefined;
    this.event = '';
    this.inverse = false;
  }
}

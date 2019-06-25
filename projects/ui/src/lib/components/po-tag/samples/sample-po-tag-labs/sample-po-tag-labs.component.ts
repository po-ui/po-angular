import { Component, OnInit } from '@angular/core';

import { PoRadioGroupOption, PoTagOrientation, PoTagType } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-tag-labs',
  templateUrl: './sample-po-tag-labs.component.html',
})
export class SamplePoTagLabsComponent implements OnInit {

  event: string;
  icon: boolean;
  label: string;
  orientation: PoTagOrientation;
  type: PoTagType;
  value: string;

  public readonly orientationOptions: Array<PoRadioGroupOption> = [
    { label: 'Horizontal', value: PoTagOrientation.Horizontal },
    { label: 'Vertical', value: PoTagOrientation.Vertical }
  ];

  public readonly typeOptions: Array<PoRadioGroupOption> = [
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
    this.icon = undefined;
    this.label = undefined;
    this.orientation = undefined;
    this.value = 'Portinari Tag';
    this.type = undefined;
    this.event = '';
  }

}

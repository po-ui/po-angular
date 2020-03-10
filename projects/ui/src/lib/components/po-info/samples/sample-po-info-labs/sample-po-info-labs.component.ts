import { Component, OnInit } from '@angular/core';

import { PoInfoOrientation, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-info-labs',
  templateUrl: './sample-po-info-labs.component.html'
})
export class SamplePoInfoLabsComponent implements OnInit {
  label: string;
  labelSize: number;
  orientation: PoInfoOrientation;
  url: string;
  value: string;

  public readonly orientationOptions: Array<PoRadioGroupOption> = [
    { label: 'Horizontal', value: PoInfoOrientation.Horizontal },
    { label: 'Vertical', value: PoInfoOrientation.Vertical }
  ];

  ngOnInit() {
    this.restore();
  }

  restore() {
    this.label = 'Portinari Info';
    this.labelSize = undefined;
    this.orientation = undefined;
    this.url = undefined;
    this.value = undefined;
  }
}

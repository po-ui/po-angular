import { Component, OnInit } from '@angular/core';
import { PoRadioGroupOption } from '@po-ui/ng-components';
@Component({
  selector: 'sample-po-checkbox-labs',
  templateUrl: './sample-po-checkbox-labs.component.html'
})
export class SamplePoCheckboxLabsComponent implements OnInit {
  checkbox: boolean | null;
  disabled: boolean;
  size: string;
  event: string;
  label: string;

  sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' },
    { label: 'large', value: 'large' }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.checkbox = undefined;
    this.disabled = false;
    this.event = undefined;
    this.label = undefined;
    this.size = 'medium';
  }
}

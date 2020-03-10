import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sample-po-checkbox-labs',
  templateUrl: './sample-po-checkbox-labs.component.html'
})
export class SamplePoCheckboxLabsComponent implements OnInit {
  checkbox: boolean | null;
  disabled: boolean;
  event: string;
  label: string;

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
  }
}

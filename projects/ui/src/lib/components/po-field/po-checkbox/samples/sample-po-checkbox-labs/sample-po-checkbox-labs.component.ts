import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sample-po-checkbox-labs',
  templateUrl: './sample-po-checkbox-labs.component.html',
  standalone: false
})
export class SamplePoCheckboxLabsComponent implements OnInit {
  additionalHelpTooltip: string;
  checkbox: boolean | null;
  disabled: boolean;
  help: string;
  size: boolean;
  event: string;
  label: string;

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.additionalHelpTooltip = '';
    this.checkbox = undefined;
    this.disabled = false;
    this.event = undefined;
    this.help = '';
    this.label = undefined;
  }
}

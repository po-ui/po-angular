import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-textarea-labs',
  templateUrl: './sample-po-textarea-labs.component.html'
})
export class SamplePoTextareaLabsComponent implements OnInit {
  event: string;
  help: string;
  label: string;
  maxlength: number;
  minlength: number;
  placeholder: string;
  properties: Array<string>;
  rows: string;
  textarea: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'optional', label: 'Optional' },
    { value: 'readonly', label: 'Read Only' },
    { value: 'required', label: 'Required' }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.textarea = undefined;
    this.label = undefined;
    this.help = undefined;
    this.minlength = undefined;
    this.maxlength = undefined;
    this.event = undefined;
    this.rows = undefined;
    this.placeholder = '';
    this.properties = [];
  }
}

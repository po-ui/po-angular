import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoSelectOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-input-labs',
  templateUrl: './sample-po-input-labs.component.html'
})
export class SamplePoInputLabsComponent implements OnInit {
  input: string;
  errorPattern: string;
  event: string;
  help: string;
  icon: string;
  label: string;
  mask: string;
  maxlength: number;
  minlength: number;
  pattern: string;
  placeholder: string;
  properties: Array<string>;

  public readonly iconOptions: Array<PoSelectOption> = [
    { value: 'po-icon-portinari', label: 'po-icon-portinari' },
    { value: 'po-icon-search', label: 'po-icon-search' },
    { value: 'po-icon-world', label: 'po-icon-world' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'maskFormatModel', label: 'Formatted Model' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
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
    this.input = undefined;
  }
}

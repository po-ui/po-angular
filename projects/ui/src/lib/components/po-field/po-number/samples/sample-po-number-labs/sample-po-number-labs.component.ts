import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoSelectOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-number-labs',
  templateUrl: './sample-po-number-labs.component.html',
  standalone: false
})
export class SamplePoNumberLabsComponent implements OnInit {
  event: string;
  messageErrorPattern: string;
  help: string;
  icon: string;
  label: string;
  max: number;
  maxlength: number;
  min: number;
  minlength: number;
  number: number;
  placeholder: string;
  properties: Array<string>;
  step: string;

  public readonly iconOptions: Array<PoSelectOption> = [
    { value: 'ph ph-currency-circle-dollar', label: 'ph ph-currency-circle-dollar' },
    { value: 'ph ph-currency-btc', label: 'ph ph-currency-btc' },
    { value: 'fa fa-calculator', label: 'fa fa-calculator' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
    { value: 'optional', label: 'Optional' },
    { value: 'readonly', label: 'Read Only' },
    { value: 'required', label: 'Required' },
    { value: 'requiredFieldErrorMessage', label: 'Required Field Error Message' },
    { value: 'showRequired', label: 'Show Required' },
    { value: 'errorLimit', label: 'Limit Error Message' }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.number = undefined;
    this.max = undefined;
    this.maxlength = undefined;
    this.min = undefined;
    this.minlength = undefined;
    this.event = '';
    this.messageErrorPattern = '';
    this.label = undefined;
    this.placeholder = '';
    this.help = '';
    this.icon = '';
    this.step = undefined;
    this.properties = [];
  }
}

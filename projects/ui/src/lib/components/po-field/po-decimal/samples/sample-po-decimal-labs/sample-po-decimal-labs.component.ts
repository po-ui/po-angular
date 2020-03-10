import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoSelectOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-decimal-labs',
  templateUrl: './sample-po-decimal-labs.component.html'
})
export class SamplePoDecimalLabsComponent implements OnInit {
  decimal: number;
  decimalsLength: number;
  event: string;
  help: string;
  icon: string;
  label: string;
  placeholder: string;
  properties: Array<string>;
  thousandMaxlength: number;

  public readonly iconOptions: Array<PoSelectOption> = [
    { value: 'po-icon-cart', label: 'po-icon-cart' },
    { value: 'po-icon-finance-secure', label: 'po-icon-finance-secure' },
    { value: 'po-icon-debit-payment', label: 'po-icon-debit-payment' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
    { value: 'optional', label: 'Optional' },
    { value: 'readonly', label: 'Read Only' },
    { value: 'required', label: 'Required' }
  ];

  get maxDecimalsLength() {
    return 16 - this.thousandMaxlength || 15;
  }

  get maxThousandMaxlength() {
    return 16 - this.decimalsLength || 13;
  }

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  restore() {
    this.decimal = undefined;
    this.decimalsLength = undefined;
    this.event = '';
    this.help = undefined;
    this.icon = undefined;
    this.label = undefined;
    this.placeholder = '';
    this.thousandMaxlength = undefined;

    this.properties = [];
  }
}

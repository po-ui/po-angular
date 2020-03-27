import { Component, OnInit } from '@angular/core';

import {
  PoCheckboxGroupOption,
  PoMultiselectLiterals,
  PoMultiselectOption,
  PoRadioGroupOption
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-multiselect-labs',
  templateUrl: './sample-po-multiselect-labs.component.html'
})
export class SamplePoMultiselectLabsComponent implements OnInit {
  customLiterals: PoMultiselectLiterals;
  event: string;
  filterMode: string;
  help: string;
  label: string;
  literals: string;
  multiselect: Array<string>;
  option: PoMultiselectOption;
  options: Array<PoMultiselectOption>;
  placeholder: string;
  placeholderSearch: string;
  properties: Array<string>;

  public readonly filterModeOptions: Array<PoRadioGroupOption> = [
    { label: 'Starts With', value: 'startsWith' },
    { label: 'Contains', value: 'contains' },
    { label: 'Ends With', value: 'endsWith' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'required', label: 'Required' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'optional', label: 'Optional' },
    { value: 'hideSearch', label: 'Hide Search' },
    { value: 'sort', label: 'Sort' }
  ];

  ngOnInit() {
    this.restore();
  }

  addOption() {
    this.options = [...this.options, { ...this.option }];
    this.option = { label: undefined, value: undefined };
  }

  changeEvent(event: string) {
    this.event = event;
  }

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  restore() {
    this.customLiterals = undefined;
    this.help = '';
    this.filterMode = undefined;
    this.label = undefined;
    this.literals = '';
    this.placeholder = '';
    this.placeholderSearch = undefined;
    this.properties = [];

    this.option = { label: undefined, value: undefined };
    this.options = [];

    this.event = '';
    this.multiselect = [];
  }
}

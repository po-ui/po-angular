import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoComboLiterals, PoComboOption, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-combo-labs',
  templateUrl: './sample-po-combo-labs.component.html'
})
export class SamplePoComboLabsComponent implements OnInit {

  combo: string;
  customLiterals: PoComboLiterals;
  debounceTime: number;
  event: string;

  fieldLabel: string;
  fieldValue: string;
  filterMinlength: number;
  filterMode: string;
  filterService: string;

  help: string;
  icon: string;
  label: string;
  literals: string;
  placeholder: string;
  properties: Array<string>;

  option: PoComboOption;
  options: Array<PoComboOption>;

  public readonly filterModeOptions: Array<PoRadioGroupOption> = [
    { label: 'Starts With', value: 'startsWith' },
    { label: 'Contains', value: 'contains' },
    { label: 'Ends With', value: 'endsWith' }
  ];

  public readonly iconsOptions: Array<PoRadioGroupOption> = [
    { label: 'Company', value: 'po-icon-company' },
    { label: 'Gas', value: 'po-icon-gas' },
    { label: 'Light', value: 'po-icon-light' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'changeOnEnter', label: 'Change On Enter' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'optional', label: 'Optional' },
    { value: 'disabledInitFilter', label: 'Disabled Init Filter' },
    { value: 'required', label: 'Required' },
    { value: 'sort', label: 'Sort' }
  ];

  ngOnInit() {
    this.restore();
  }

  addOption() {
    this.options = [...this.options, Object.assign({}, this.option)];
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
    this.combo = undefined;
    this.customLiterals = undefined;
    this.event = '';

    this.debounceTime = undefined;
    this.fieldLabel = '';
    this.fieldValue = '';
    this.filterMinlength = undefined;
    this.filterService = '';
    this.filterMode = undefined;

    this.help = undefined;
    this.label = undefined;
    this.literals = '';
    this.icon = undefined;

    this.option = {label: undefined, value: undefined};
    this.options = [];
    this.placeholder = '';
    this.properties = [];
  }

}

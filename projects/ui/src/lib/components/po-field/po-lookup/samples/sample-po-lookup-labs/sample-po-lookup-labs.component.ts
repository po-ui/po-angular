import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoLookupColumn, PoLookupFilter, PoLookupLiterals } from '@portinari/portinari-ui';

import { SamplePoLookupService } from '../sample-po-lookup.service';

@Component({
  selector: 'sample-po-lookup-labs',
  templateUrl: './sample-po-lookup-labs.component.html',
  providers: [SamplePoLookupService]
})
export class SamplePoLookupLabsComponent implements OnInit {
  columns: Array<PoLookupColumn>;
  columnsName: Array<string>;
  customLiterals: PoLookupLiterals;
  event: string;
  fieldFormat: (objectSelected) => string;
  fieldLabel: string;
  fieldValue: string;
  filterService: PoLookupFilter | string;
  help: string;
  label: string;
  literals: string;
  lookup: any;
  placeholder: string;
  properties: Array<string>;

  private readonly columnsDefinition = {
    value: <PoLookupColumn>{ property: 'id', label: 'Id' },
    label: <PoLookupColumn>{ property: 'name', label: 'Name' },
    phone: <PoLookupColumn>{ property: 'phone', label: 'Phone' },
    email: <PoLookupColumn>{ property: 'email', label: 'Email' }
  };

  public readonly columnsOptions: Array<PoCheckboxGroupOption> = [
    { value: 'value', label: 'Id' },
    { value: 'label', label: 'Name' },
    { value: 'phone', label: 'Phone' },
    { value: 'email', label: 'Email' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'fieldFormat', label: 'Field format' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
    { value: 'optional', label: 'Optional' },
    { value: 'required', label: 'Required' }
  ];

  constructor(public sampleFilterService: SamplePoLookupService) {}

  ngOnInit(): void {
    this.restore();
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

  fieldFormatFn(objectSelected) {
    return `${objectSelected.id} - ${objectSelected.name}`;
  }

  onChangeProperties(properties: Array<string>) {
    if (properties.includes('fieldFormat')) {
      this.fieldFormat = this.fieldFormatFn;
    } else {
      this.fieldFormat = undefined;
    }
  }

  restore() {
    this.columnsName = ['value', 'label'];
    this.customLiterals = undefined;
    this.updateColumns();

    this.fieldLabel = 'label';
    this.fieldValue = 'value';

    this.event = undefined;
    this.filterService = undefined;
    this.label = undefined;
    this.literals = undefined;
    this.help = undefined;
    this.lookup = undefined;
    this.placeholder = '';
    this.properties = [];
  }

  updateColumns() {
    this.columns = [];

    this.columnsName.forEach(column => this.columns.push(this.columnsDefinition[column]));
  }
}

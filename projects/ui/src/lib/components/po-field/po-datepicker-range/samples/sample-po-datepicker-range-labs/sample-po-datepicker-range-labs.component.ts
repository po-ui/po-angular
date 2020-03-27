import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoDatepickerRange, PoDatepickerRangeLiterals } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-datepicker-range-labs',
  templateUrl: './sample-po-datepicker-range-labs.component.html'
})
export class SamplePoDatepickerRangeLabsComponent implements OnInit {
  clean: boolean;
  customLiterals: PoDatepickerRangeLiterals;
  datepickerRange: PoDatepickerRange;
  endDate: string | Date;
  event: string;
  help: string;
  label: string;
  literals: string;
  properties: Array<string>;
  startDate: string | Date;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
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

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  getDatepickerRange() {
    return JSON.stringify(this.datepickerRange);
  }

  restore() {
    this.clean = undefined;
    this.customLiterals = undefined;
    this.endDate = undefined;
    this.event = undefined;
    this.help = undefined;
    this.label = undefined;
    this.literals = undefined;
    this.properties = [];
    this.startDate = undefined;
    setTimeout(() => (this.datepickerRange = undefined));
  }
}

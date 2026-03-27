import { Component, OnInit } from '@angular/core';

import {
  PoCheckboxGroupOption,
  PoDatepickerRange,
  PoDatepickerRangeLiterals,
  PoRadioGroupOption,
  PoSelectOption,
  PoCalendarRangePreset
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-datepicker-range-labs',
  templateUrl: './sample-po-datepicker-range-labs.component.html',
  standalone: false
})
export class SamplePoDatepickerRangeLabsComponent implements OnInit {
  helperText: string;
  clean: boolean;
  customLiterals: PoDatepickerRangeLiterals;
  datepickerRange: PoDatepickerRange;
  endDate: string | Date;
  event: string;
  help: string;
  label: string;
  placeholder: PoDatepickerRange = {
    start: '',
    end: ''
  };
  literals: string;
  properties: Array<string>;
  fieldErrorMessage: string;
  startDate: string | Date;
  maxDate: string | Date;
  minDate: string | Date;
  locale: string;
  size: string;
  rangePresets: boolean;
  rangePresetsOrder: 'asc' | 'desc';
  customPresets: Array<PoCalendarRangePreset>;
  useCustomPresets: boolean;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
    { value: 'optional', label: 'Optional' },
    { value: 'readonly', label: 'Read Only' },
    { value: 'required', label: 'Required' },
    { value: 'showRequired', label: 'Show Required' },
    { value: 'errorLimit', label: 'Limit Error Message' },
    { value: 'labelTextWrap', label: 'Label Text Wrap' },
    { value: 'loading', label: 'Loading' },
    { value: 'compactLabel', label: 'Compact Label' }
  ];

  public readonly localeOptions: Array<PoSelectOption> = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Português', value: 'pt' },
    { label: 'Pусский', value: 'ru' }
  ];

  public readonly sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' }
  ];

  public readonly presetsOrderOptions: Array<PoRadioGroupOption> = [
    { label: 'ASC', value: 'asc' },
    { label: 'DESC', value: 'desc' }
  ];

  readonly sampleCustomPresets: Array<PoCalendarRangePreset> = [
    {
      label: 'Próximos 3 meses',
      dateRange: (today: Date) => {
        const end = new Date(today);
        end.setMonth(end.getMonth() + 3);
        return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate()), end };
      }
    },
    {
      label: 'Última semana',
      dateRange: (today: Date) => {
        const start = new Date(today);
        start.setDate(start.getDate() - 7);
        return { start, end: new Date(today.getFullYear(), today.getMonth(), today.getDate()) };
      }
    }
  ];

  ngOnInit() {
    this.restore();
  }

  changeEvent(event: string) {
    this.event = event;
  }

  onCustomPresetsChange(value: boolean) {
    this.useCustomPresets = value;
    this.customPresets = value ? [...this.sampleCustomPresets] : [];
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

  changePlaceholderStart(value: any) {
    this.placeholder = { ...this.placeholder, start: value };
  }

  changePlaceholderEnd(value: any) {
    this.placeholder = { ...this.placeholder, end: value };
  }

  restore() {
    this.helperText = '';
    this.clean = undefined;
    this.customLiterals = undefined;
    this.endDate = undefined;
    this.event = undefined;
    this.help = undefined;
    this.label = undefined;
    this.placeholder = {
      start: '',
      end: ''
    };
    this.literals = undefined;
    this.properties = [];
    this.fieldErrorMessage = '';
    this.startDate = undefined;
    this.maxDate = undefined;
    this.minDate = undefined;
    this.locale = undefined;
    this.size = 'medium';
    this.rangePresets = false;
    this.rangePresetsOrder = 'asc';
    this.customPresets = [];
    this.useCustomPresets = false;
    setTimeout(() => (this.datepickerRange = undefined));
  }
}

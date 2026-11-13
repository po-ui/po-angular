import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';

import { PoCheckboxGroupOption, PoDatepickerIsoFormat, PoRadioGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-datepicker-labs',
  templateUrl: './sample-po-datepicker-labs.component.html',
  standalone: false
})
export class SamplePoDatepickerLabsComponent {
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly model = signal<string | Date | undefined>(undefined);
  readonly modelAsText = computed<string>(() => {
    const model = this.model();
    return model instanceof Date ? model.toString() : (model ?? '');
  });
  readonly event = signal<string>('');
  readonly showDatepicker = signal<boolean>(true);

  readonly errorPattern = signal<string>('');
  readonly format = signal<string>('dd/mm/yyyy');
  readonly help = signal<string | undefined>(undefined);
  readonly helper = signal<string>('');
  readonly isoFormat = signal<PoDatepickerIsoFormat | undefined>(undefined);
  readonly label = signal<string | undefined>(undefined);
  readonly locale = signal<string>('');
  readonly maxDate = signal<string | Date>('');
  readonly minDate = signal<string | Date>('');
  readonly mode = signal<'month-year' | 'year' | undefined>(undefined);
  readonly placeholder = signal<string>('');
  readonly properties = signal<Array<string>>([]);
  readonly size = signal<string>('medium');

  readonly isoFormatOptions: Array<PoRadioGroupOption> = [
    { label: 'Basic', value: PoDatepickerIsoFormat.Basic },
    { label: 'Extended', value: PoDatepickerIsoFormat.Extended }
  ];

  readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'clean', label: 'Clean' },
    { value: 'disabled', label: 'Disabled' },
    { value: 'noAutocomplete', label: 'No Autocomplete' },
    { value: 'optional', label: 'Optional' },
    { value: 'readonly', label: 'Read Only' },
    { value: 'required', label: 'Required' },
    { value: 'requiredFieldErrorMessage', label: 'Required Field Error Message' },
    { value: 'showRequired', label: 'Show Required' },
    { value: 'errorLimit', label: 'Limit Error Message' },
    { value: 'labelTextWrap', label: 'Label Text Wrap' },
    { value: 'loading', label: 'Loading' },
    { value: 'compactLabel', label: 'Compact Label' }
  ];

  readonly formatOptions: Array<PoRadioGroupOption> = [
    { label: 'dd/mm/yyyy', value: 'dd/mm/yyyy' },
    { label: 'mm/dd/yyyy', value: 'mm/dd/yyyy' },
    { label: 'yyyy/mm/dd', value: 'yyyy/mm/dd' }
  ];

  readonly localeOptions: Array<PoRadioGroupOption> = [
    { label: 'pt', value: 'pt' },
    { label: 'en', value: 'en' },
    { label: 'es', value: 'es' },
    { label: 'ru', value: 'ru' }
  ];

  readonly modeOptions: Array<PoRadioGroupOption> = [
    { label: 'month-year', value: 'month-year' },
    { label: 'year', value: 'year' }
  ];

  readonly sizeOptions: Array<PoRadioGroupOption> = [
    { label: 'small', value: 'small' },
    { label: 'medium', value: 'medium' }
  ];

  hasProperty(property: string): boolean {
    return this.properties().includes(property);
  }

  changeEvent(event: string): void {
    this.event.set(event);
  }

  changeFormat(format: string): void {
    this.format.set(format);
    this.remountDatepickerWhenMode();
  }

  changeLocale(locale: string): void {
    this.locale.set(locale);
    this.remountDatepickerWhenMode();
  }

  changeMode(mode: 'month-year' | 'year'): void {
    this.mode.set(mode);
    this.model.set(undefined);
    this.remountDatepicker();
  }

  restore(): void {
    this.model.set(undefined);
    this.event.set('');
    this.errorPattern.set('');
    this.format.set('dd/mm/yyyy');
    this.help.set(undefined);
    this.helper.set('');
    this.isoFormat.set(undefined);
    this.label.set(undefined);
    this.locale.set('');
    this.maxDate.set('');
    this.minDate.set('');
    this.mode.set(undefined);
    this.placeholder.set('');
    this.properties.set([]);
    this.size.set('medium');
    this.remountDatepicker();
  }

  private remountDatepicker(): void {
    this.showDatepicker.set(false);
    this.changeDetector.detectChanges();
    this.showDatepicker.set(true);
    this.changeDetector.detectChanges();
  }

  private remountDatepickerWhenMode(): void {
    if (this.mode()) {
      this.remountDatepicker();
    }
  }
}

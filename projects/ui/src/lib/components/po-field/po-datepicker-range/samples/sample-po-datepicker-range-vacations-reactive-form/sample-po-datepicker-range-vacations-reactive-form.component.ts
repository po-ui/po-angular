import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PoDatepickerRange, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-datepicker-range-vacations-reactive-form',
  templateUrl: './sample-po-datepicker-range-vacations-reactive-form.component.html'
})
export class SamplePoDatepickerRangeVacationsReactiveFormComponent implements OnInit {
  datepickerRange: PoDatepickerRange;
  formVacationSuggestion: FormGroup;
  quantityOfDays: number;
  reason: string;

  cancel: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: 'Cancel'
  };

  submit: PoModalAction = {
    action: () => {
      this.poModal.close();
      this.formVacationSuggestion.reset();
      this.poNotification.success('Vacation suggestion submitted!');
    },
    label: 'Submit'
  };

  get validateForm() {
    return !(
      this.formVacationSuggestion.valid &&
      this.formVacationSuggestion.get('datepickerRange').value.start &&
      this.formVacationSuggestion.get('datepickerRange').value.end
    );
  }

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private poNotification: PoNotificationService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formVacationSuggestion = this.formBuilder.group({
      datepickerRange: [undefined, Validators.required],
      quantityOfDays: [undefined],
      reason: [undefined]
    });
  }

  calculateQuantityOfVacationDays() {
    const start = new Date(this.formVacationSuggestion.get('datepickerRange').value.start);
    const end = new Date(this.formVacationSuggestion.get('datepickerRange').value.end);

    const result = Math.floor(
      (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
        (1000 * 60 * 60 * 24)
    );

    this.formVacationSuggestion.get('quantityOfDays').setValue(result);
  }

  clean() {
    this.formVacationSuggestion.reset();
  }

  submitForm() {
    this.datepickerRange = this.formVacationSuggestion.get('datepickerRange').value;
    this.reason = this.formVacationSuggestion.get('reason').value;
    this.quantityOfDays = this.formVacationSuggestion.get('quantityOfDays').value;
  }
}

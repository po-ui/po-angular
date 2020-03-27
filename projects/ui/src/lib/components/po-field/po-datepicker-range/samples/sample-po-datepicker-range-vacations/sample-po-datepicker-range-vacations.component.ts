import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PoDatepickerRange, PoModalAction, PoModalComponent, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-datepicker-range-vacations',
  templateUrl: './sample-po-datepicker-range-vacations.component.html'
})
export class SamplePoDatepickerRangeVacationsComponent {
  datepickerRange: PoDatepickerRange;
  quantityOfDays: number = undefined;
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
      this.datepickerRange &&
      this.datepickerRange.start &&
      this.datepickerRange.end
    );
  }

  @ViewChild('formVacationSuggestion', { static: true }) formVacationSuggestion: FormControl;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private poNotification: PoNotificationService) {}

  calculateQuantityOfVacationDays() {
    const start = new Date(this.datepickerRange.start);
    const end = new Date(this.datepickerRange.end);

    this.quantityOfDays = Math.floor(
      (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
        Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
        (1000 * 60 * 60 * 24)
    );
  }

  clean() {
    this.datepickerRange = undefined;
    this.quantityOfDays = undefined;
    this.reason = undefined;
  }
}

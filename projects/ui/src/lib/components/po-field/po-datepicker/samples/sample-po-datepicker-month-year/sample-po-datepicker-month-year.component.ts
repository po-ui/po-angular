import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-datepicker-month-year',
  templateUrl: './sample-po-datepicker-month-year.component.html',
  standalone: false
})
export class SamplePoDatepickerMonthYearComponent {
  selectedMonthYear: string;
  event: string;

  changeEvent(event: string) {
    this.event = event;
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-datepicker-year',
  templateUrl: './sample-po-datepicker-year.component.html',
  standalone: false
})
export class SamplePoDatepickerYearComponent {
  selectedYear: string;
  event: string;

  changeEvent(event: string) {
    this.event = event;
  }
}

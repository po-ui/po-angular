import { Component } from '@angular/core';

import { PoButtonGroupItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-group-opening-service-ticket',
  templateUrl: './sample-po-button-group-opening-service-ticket.component.html',
  standalone: false
})
export class SamplePoButtonGroupOpeningServiceTicketComponent {
  selectedWeekDay: string = '';
  selectedPeriod: string = '';

  weekDays: Array<PoButtonGroupItem> = [
    { label: 'Mon', tooltip: 'Monday', action: this.selectWeekDay.bind(this) },
    { label: 'Tue', tooltip: 'Tuesday', action: this.selectWeekDay.bind(this) },
    { label: 'Wed', tooltip: 'Wednesday', action: this.selectWeekDay.bind(this) },
    { label: 'Thu', tooltip: 'Thursday', action: this.selectWeekDay.bind(this) },
    { label: 'Fri', tooltip: 'Friday', action: this.selectWeekDay.bind(this) }
  ];

  periods: Array<PoButtonGroupItem> = [
    { label: 'Morning', action: this.selectPeriod.bind(this) },
    { label: 'Afternoon', action: this.selectPeriod.bind(this) },
    { label: 'Evening', action: this.selectPeriod.bind(this) }
  ];

  selectWeekDay(button: PoButtonGroupItem): void {
    this.selectedWeekDay = button.selected ? button.label! : '';
  }

  selectPeriod(button: PoButtonGroupItem): void {
    this.selectedPeriod = button.selected ? button.label! : '';
  }
}

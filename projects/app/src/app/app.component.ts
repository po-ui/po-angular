import { Component } from '@angular/core';

import { PoTimerFormat } from '../../../../ui/src/lib/components/po-timer/enums/po-timer-format.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  format24 = PoTimerFormat.Format24;
  format12 = PoTimerFormat.Format12;

  selectedTime24 = '';
  selectedTime12 = '';
  selectedTimeWithSeconds = '';
  selectedTimeMinMax = '';
  selectedTimeInterval = '';

  onTimeChange24(time: string): void {
    this.selectedTime24 = time;
  }

  onTimeChange12(time: string): void {
    this.selectedTime12 = time;
  }

  onTimeChangeWithSeconds(time: string): void {
    this.selectedTimeWithSeconds = time;
  }

  onTimeChangeMinMax(time: string): void {
    this.selectedTimeMinMax = time;
  }

  onTimeChangeInterval(time: string): void {
    this.selectedTimeInterval = time;
  }
}

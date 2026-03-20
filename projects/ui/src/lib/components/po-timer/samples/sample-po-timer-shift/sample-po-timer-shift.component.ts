import { Component, inject } from '@angular/core';

import { PoNotificationService, PoRadioGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-timer-shift',
  templateUrl: './sample-po-timer-shift.component.html',
  standalone: false
})
export class SamplePoTimerShiftComponent {
  private poNotification = inject(PoNotificationService);

  shiftStart: string;
  shiftEnd: string;
  shift: string = 'morning';

  public readonly shiftOptions: Array<PoRadioGroupOption> = [
    { label: 'Manhã (06:00 - 14:00)', value: 'morning' },
    { label: 'Tarde (14:00 - 22:00)', value: 'afternoon' },
    { label: 'Noite (22:00 - 06:00)', value: 'night' }
  ];

  get shiftMinTime(): string {
    switch (this.shift) {
      case 'morning':
        return '06:00';
      case 'afternoon':
        return '14:00';
      case 'night':
        return '22:00';
      default:
        return '00:00';
    }
  }

  get shiftMaxTime(): string {
    switch (this.shift) {
      case 'morning':
        return '14:00';
      case 'afternoon':
        return '22:00';
      case 'night':
        return '23:59';
      default:
        return '23:59';
    }
  }

  save() {
    this.poNotification.success(`Turno salvo: ${this.shiftStart} - ${this.shiftEnd}`);
  }
}

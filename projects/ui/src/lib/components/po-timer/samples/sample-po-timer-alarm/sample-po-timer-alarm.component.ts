import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-timer-alarm',
  templateUrl: './sample-po-timer-alarm.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SamplePoTimerAlarmComponent {
  private poNotification = inject(PoNotificationService);

  alarmTime: string;

  setAlarm() {
    this.poNotification.success(`Alarme configurado para ${this.alarmTime}.`);
  }

  clearAlarm() {
    this.alarmTime = undefined;
    this.poNotification.information('Alarme removido.');
  }
}

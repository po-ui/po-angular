import { Component } from '@angular/core';

import { PoButtonGroupItem, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-group-attendance',
  templateUrl: './sample-po-button-group-attendance.component.html'
})
export class SamplePoButtonGroupAttendanceComponent {
  attendances: Array<PoButtonGroupItem> = [
    { label: 'Appointment', icon: 'po-icon-calendar', action: this.getPassword.bind(this) },
    { label: 'Emergency', icon: 'po-icon-injector', action: this.getPassword.bind(this) },
    { label: 'Exams', icon: 'po-icon-exam', action: this.getPassword.bind(this) }
  ];

  constructor(private poNotification: PoNotificationService) {}

  getPassword(attendance) {
    const password = this.randomPassword();
    const typeNotification = this.getTypeNotification(attendance.label);

    this.poNotification[typeNotification](`
      Type of attendance: ${attendance.label} -
      Your password: ${password}
    `);
  }

  getTypeNotification(label: string = ''): string {
    switch (label) {
      case 'Emergency':
        return 'error';
      case 'Appointment':
        return 'information';
      case 'Exams':
        return 'success';
    }
  }

  randomPassword() {
    return Math.random().toString().slice(2, 5);
  }
}

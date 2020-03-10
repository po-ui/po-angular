import { Component } from '@angular/core';

import { PoButtonGroupItem, PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-button-group-attendance',
  templateUrl: './sample-po-button-group-attendance.component.html'
})
export class SamplePoButtonGroupAttendanceComponent {
  attendances: Array<PoButtonGroupItem> = [
    { label: 'Appointment', icon: 'po-icon-calendar', action: this.getPassword },
    { label: 'Emergency', icon: 'po-icon-injector', action: this.getPassword },
    { label: 'Exams', icon: 'po-icon-exam', action: this.getPassword }
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
    return Math.random()
      .toString()
      .slice(2, 5);
  }
}

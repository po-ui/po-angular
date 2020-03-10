import { Component, ViewChild } from '@angular/core';

import { PoModalAction, PoModalComponent } from '@portinari/portinari-ui';
import { PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-login-confirm',
  templateUrl: './sample-po-login-confirm.component.html'
})
export class SamplePoLoginConfirmComponent {
  userLogin: string;
  userPassword: string;

  primaryAction: PoModalAction = {
    label: 'Confirm',
    action: () => {
      this.confirmAction();
    }
  };

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private poNotification: PoNotificationService) {}

  openModal() {
    this.poModal.open();
  }

  private cleanForm() {
    this.userLogin = '';
    this.userPassword = '';
  }

  private confirmAction() {
    if (this.userLogin && this.userPassword) {
      this.poNotification.success(`Discount successfully applied to user ${this.userLogin}!`);

      this.poModal.close();
      this.cleanForm();
    }
  }
}

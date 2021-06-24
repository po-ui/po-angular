import { Component, ViewChild } from '@angular/core';

import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-login-confirm',
  templateUrl: './sample-po-login-confirm.component.html'
})
export class SamplePoLoginConfirmComponent {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  userLogin: string;
  userPassword: string;

  primaryAction: PoModalAction = {
    label: 'Confirm',
    action: () => {
      this.confirmAction();
    }
  };

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

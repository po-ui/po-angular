import { Component, ViewChild } from '@angular/core';

import { PoModalPasswordRecoveryComponent, PoModalPasswordRecoveryType } from '@portinari/portinari-templates';

@Component({
  selector: 'sample-po-modal-password-recovery-request',
  templateUrl: './sample-po-modal-password-recovery-request.component.html'
})
export class SamplePoModalPasswordRecoveryRequestComponent {
  type: PoModalPasswordRecoveryType = PoModalPasswordRecoveryType.All;
  urlRecovery: string = 'https://thf.totvs.com.br/sample/api/users';

  @ViewChild(PoModalPasswordRecoveryComponent) poModalPasswordRecovery: PoModalPasswordRecoveryComponent;

  openPasswordRecoveryModal() {
    this.poModalPasswordRecovery.open();
  }
}

import { Component, ViewChild } from '@angular/core';

import {
  PoModalPasswordRecoveryComponent,
  PoModalPasswordRecoveryType
} from '@portinari/portinari-templates';

@Component({
  selector: 'sample-po-modal-password-recovery-request',
  templateUrl: './sample-po-modal-password-recovery-request.component.html',
})
export class SamplePoModalPasswordRecoveryRequestComponent {

  type: PoModalPasswordRecoveryType = PoModalPasswordRecoveryType.All;
  urlRecovery: string = 'https://portinari.io/sample/api/users';

  @ViewChild(PoModalPasswordRecoveryComponent, { static: false }) poModalPasswordRecovery: PoModalPasswordRecoveryComponent;

  openPasswordRecoveryModal() {
    this.poModalPasswordRecovery.open();
  }

}

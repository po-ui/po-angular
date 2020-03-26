import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldModule, PoI18nPipe, PoModalModule } from '@po-ui/ng-components';

import { PoModalPasswordRecoveryComponent } from './po-modal-password-recovery.component';
import { PoModalPasswordRecoveryErrorMessageComponent } from './po-modal-password-recovery-error-message/po-modal-password-recovery-error-message.component';
import { PoModalPasswordRecoveryService } from './po-modal-password-recovery.service';

/**
 * @description
 *
 * Módulo do template do po-modal-password-recovery.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldModule, PoModalModule],
  declarations: [PoModalPasswordRecoveryComponent, PoModalPasswordRecoveryErrorMessageComponent],
  exports: [PoModalPasswordRecoveryComponent, PoModalPasswordRecoveryErrorMessageComponent],
  providers: [PoI18nPipe, PoModalPasswordRecoveryService]
})
export class PoModalPasswordRecoveryModule {}

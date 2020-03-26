import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { PoModalPasswordRecoveryComponent } from '../po-modal-password-recovery/po-modal-password-recovery.component';
import { PoPageBackgroundModule } from '../po-page-background/index';
import { PoPageChangePasswordComponent } from './po-page-change-password.component';
import { PoPageChangePasswordService } from './po-page-change-password.service';

/**
 * @description
 *
 * Módulo do template do po-page-change-password.
 */
@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, PoModule, PoPageBackgroundModule],
  declarations: [PoPageChangePasswordComponent],
  providers: [PoPageChangePasswordService],
  exports: [PoPageChangePasswordComponent]
})
export class PoPageChangePasswordModule {}

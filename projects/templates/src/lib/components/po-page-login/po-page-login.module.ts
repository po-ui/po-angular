import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { PoModalPasswordRecoveryComponent } from '../po-modal-password-recovery/po-modal-password-recovery.component';
import { PoPageBackgroundModule } from '../po-page-background/index';
import { PoPageLoginComponent } from './po-page-login.component';
import { PoPageLoginPopoverComponent } from './po-page-login-popover/po-page-login-popover.component';
import { PoPageLoginService } from './po-page-login.service';

/**
 * @description
 *
 * Módulo do template do po-page-login.
 */
@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, PoPageBackgroundModule, PoModule],
  declarations: [PoPageLoginComponent, PoPageLoginPopoverComponent],
  exports: [PoPageLoginComponent],
  providers: [PoPageLoginService]
})
export class PoPageLoginModule {}

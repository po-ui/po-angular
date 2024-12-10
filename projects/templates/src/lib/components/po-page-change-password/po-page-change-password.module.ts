import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

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

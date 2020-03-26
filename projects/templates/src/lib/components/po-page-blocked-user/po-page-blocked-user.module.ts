import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { PoPageBackgroundModule } from '../po-page-background/index';
import { PoPageBlockedUserComponent } from './po-page-blocked-user.component';
import { PoPageBlockedUserContactsComponent } from './po-page-blocked-user-contacts/po-page-blocked-user-contacts.component';
import { PoPageBlockedUserReasonComponent } from './po-page-blocked-user-reason/po-page-blocked-user-reason.component';

/**
 * @description
 *
 * Módulo do template do po-page-blocked-user.
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoModule, PoPageBackgroundModule],
  declarations: [PoPageBlockedUserComponent, PoPageBlockedUserContactsComponent, PoPageBlockedUserReasonComponent],
  exports: [PoPageBlockedUserComponent, PoPageBlockedUserContactsComponent, PoPageBlockedUserReasonComponent]
})
export class PoPageBlockedUserModule {}

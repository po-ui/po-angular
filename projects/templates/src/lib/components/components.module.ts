import { NgModule } from '@angular/core';

import { PoModalPasswordRecoveryModule } from './po-modal-password-recovery/po-modal-password-recovery.module';
import { PoPageBackgroundModule } from './po-page-background/po-page-background.module';
import { PoPageBlockedUserModule } from './po-page-blocked-user/po-page-blocked-user.module';
import { PoPageChangePasswordModule } from './po-page-change-password/po-page-change-password.module';
import { PoPageDynamicDetailModule } from './po-page-dynamic-detail/po-page-dynamic-detail.module';
import { PoPageDynamicEditModule } from './po-page-dynamic-edit/po-page-dynamic-edit.module';
import { PoPageDynamicSearchModule } from './po-page-dynamic-search/po-page-dynamic-search.module';
import { PoPageDynamicTableModule } from './po-page-dynamic-table/po-page-dynamic-table.module';
import { PoPageJobSchedulerModule } from './po-page-job-scheduler/po-page-job-scheduler.module';
import { PoPageLoginModule } from './po-page-login/po-page-login.module';

@NgModule({
  imports: [
    PoModalPasswordRecoveryModule,
    PoPageBackgroundModule,
    PoPageBlockedUserModule,
    PoPageChangePasswordModule,
    PoPageDynamicDetailModule,
    PoPageDynamicEditModule,
    PoPageDynamicSearchModule,
    PoPageDynamicTableModule,
    PoPageJobSchedulerModule,
    PoPageLoginModule
  ],
  exports: [
    PoModalPasswordRecoveryModule,
    PoPageBackgroundModule,
    PoPageBlockedUserModule,
    PoPageChangePasswordModule,
    PoPageDynamicDetailModule,
    PoPageDynamicEditModule,
    PoPageDynamicSearchModule,
    PoPageDynamicTableModule,
    PoPageJobSchedulerModule,
    PoPageLoginModule
  ]
})
export class PoComponentsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoAvatarModule } from './../po-avatar/po-avatar.module';
import { PoPopupModule } from '../po-popup/po-popup.module';
import { PoToolbarActionsComponent } from './po-toolbar-actions/po-toolbar-actions.component';
import { PoToolbarComponent } from './po-toolbar.component';
import { PoToolbarNotificationComponent } from './po-toolbar-notification/po-toolbar-notification.component';
import { PoToolbarProfileComponent } from './po-toolbar-profile/po-toolbar-profile.component';

/**
 * @description
 *
 * Módulo do componente po-toolbar
 *
 */
@NgModule({
  imports: [CommonModule, PoAvatarModule, PoPopupModule],
  declarations: [
    PoToolbarActionsComponent,
    PoToolbarComponent,
    PoToolbarNotificationComponent,
    PoToolbarProfileComponent
  ],
  exports: [PoToolbarComponent],
  providers: [],
  schemas: []
})
export class PoToolbarModule {}

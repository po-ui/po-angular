import { NgModule } from '@angular/core';

import { PoActiveOverlayModule } from './po-active-overlay/po-active-overlay.module';
import { PoColorPaletteModule } from './po-color-palette/po-color-palette.module';
import { PoComponentInjectorModule } from './po-component-injector/po-component-injector.module';
import { PoControlPositionModule } from './po-control-position/po-control-position.module';
import { PoDateTimeModule } from './po-date/po-date.module';
import { PoDialogModule } from './po-dialog/po-dialog.module';
import { PoI18nPipe } from './po-i18n/po-i18n.pipe';
import { PoLanguageModule } from './po-language/po-language.module';
import { PoNotificationModule } from './po-notification/po-notification.module';

@NgModule({
  declarations: [PoI18nPipe],
  imports: [
    PoActiveOverlayModule,
    PoColorPaletteModule,
    PoComponentInjectorModule,
    PoControlPositionModule,
    PoDateTimeModule,
    PoDialogModule,
    PoLanguageModule,
    PoNotificationModule
  ],
  exports: [
    PoActiveOverlayModule,
    PoColorPaletteModule,
    PoComponentInjectorModule,
    PoControlPositionModule,
    PoDateTimeModule,
    PoDialogModule,
    PoI18nPipe,
    PoNotificationModule
  ],
  providers: [],
  bootstrap: []
})
export class PoServicesModule {}

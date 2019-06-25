import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoLanguageModule } from './../../services/po-language/po-language.module';

import { PoLoadingComponent } from './po-loading.component';
import { PoLoadingOverlayComponent } from './po-loading-overlay/po-loading-overlay.component';

/**
 *
 * @description
 *
 * Módulo do componente po-loading-overlay.
 */
@NgModule({
  imports: [
    CommonModule,
    PoLanguageModule
  ],
  declarations: [
    PoLoadingComponent,
    PoLoadingOverlayComponent
  ],
  exports: [
    PoLoadingComponent,
    PoLoadingOverlayComponent
  ]
})
export class PoLoadingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoLanguageModule } from './../../services/po-language/po-language.module';

import { PoLoadingComponent } from './po-loading.component';
import { PoLoadingIconComponent } from './po-loading-icon/po-loading-icon.component';
import { PoLoadingOverlayComponent } from './po-loading-overlay/po-loading-overlay.component';
import { PoOverlayModule } from '../po-overlay/po-overlay.module';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

/**
 *
 * @description
 *
 * Módulo do componente po-loading-overlay.
 */
@NgModule({
  declarations: [PoLoadingComponent, PoLoadingIconComponent, PoLoadingOverlayComponent, LoadingSpinnerComponent],
  exports: [PoLoadingComponent, PoLoadingIconComponent, PoLoadingOverlayComponent, LoadingSpinnerComponent],
  imports: [CommonModule, PoLanguageModule, PoOverlayModule]
})
export class PoLoadingModule {}

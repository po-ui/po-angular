import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoProgressBarComponent } from './po-progress-bar/po-progress-bar.component';
import { PoProgressComponent } from './po-progress.component';
import { PoButtonModule } from '../po-button/po-button.module';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoLabelModule } from '../po-label/po-label.module';

/**
 * @description
 *
 * Módulo do componente `po-progress`.
 */
@NgModule({
  imports: [CommonModule, PoButtonModule, PoIconModule, PoLabelModule],
  exports: [PoProgressComponent],
  declarations: [PoProgressBarComponent, PoProgressComponent]
})
export class PoProgressModule {}

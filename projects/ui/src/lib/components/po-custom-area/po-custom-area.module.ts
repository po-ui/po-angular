import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoCustomAreaComponent } from './po-custom-area.component';
import { HttpClientModule } from '@angular/common/http';

/**
 * @description
 *
 * Módulo do componente `po-custom-area`
 */
@NgModule({
  declarations: [PoCustomAreaComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [PoCustomAreaComponent]
})
export class PoCustomAreaModule {}

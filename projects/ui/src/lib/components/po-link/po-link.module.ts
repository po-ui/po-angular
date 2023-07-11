import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoLinkComponent } from './po-link.component';
import { RouterModule } from '@angular/router';

/**
 * @description
 *
 * Módulo do componente po-link.
 */
@NgModule({
  declarations: [PoLinkComponent],
  imports: [CommonModule, RouterModule],
  exports: [PoLinkComponent]
})
export class PoLinkModule {}

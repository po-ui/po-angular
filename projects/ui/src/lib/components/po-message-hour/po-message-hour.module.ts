import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PoMessageHourComponent } from './po-message-hour.component';
import { PoLinkModule } from '../po-link';

/**
 * @description
 *
 * Módulo do componente po-message-hour.
 */
@NgModule({
  declarations: [PoMessageHourComponent],
  imports: [CommonModule, RouterModule, PoLinkModule],
  exports: [PoMessageHourComponent, PoLinkModule]
})
export class PoMessageHourModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPageDynamicService } from './po-page-dynamic.service';
/**
 * @description
 *
 * Módulo do serviço do po-page-dynamic-service.
 */
@NgModule({
  imports: [CommonModule],
  providers: [PoPageDynamicService]
})
export class PoPageDynamicModule {}

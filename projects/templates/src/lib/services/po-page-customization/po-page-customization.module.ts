import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoPageCustomizationService } from './po-page-customization.service';

/**
 * @description
 *
 * Módulo do serviço do po-page-customization-service.
 */
@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [PoPageCustomizationService]
})
export class PoPageCustomizationModule {}

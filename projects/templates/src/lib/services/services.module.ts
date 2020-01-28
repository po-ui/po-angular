import { NgModule } from '@angular/core';

import { PoPageCustomizationModule } from './po-page-customization/po-page-customization.module';

@NgModule({
  imports: [
    PoPageCustomizationModule
  ],
  exports: [
    PoPageCustomizationModule
  ]
})
export class PoServicesModule { }

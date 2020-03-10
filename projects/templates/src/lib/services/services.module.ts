import { NgModule } from '@angular/core';

import { PoPageCustomizationModule } from './po-page-customization/po-page-customization.module';
import { PoPageDynamicModule } from './po-page-dynamic/po-page-dynamic.module';

@NgModule({
  imports: [PoPageCustomizationModule, PoPageDynamicModule],
  exports: [PoPageCustomizationModule, PoPageDynamicModule]
})
export class PoServicesModule {}

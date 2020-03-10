import { NgModule } from '@angular/core';

import { PoComponentsModule } from './components/components.module';
import { PoServicesModule } from './services/services.module';

@NgModule({
  imports: [PoComponentsModule, PoServicesModule],
  exports: [PoComponentsModule, PoServicesModule]
})
export class PoTemplatesModule {}

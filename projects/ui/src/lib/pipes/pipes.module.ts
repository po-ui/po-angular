import { NgModule } from '@angular/core';

import { PoDecimalFormatModule } from '../pipes/po-decimal/po-decimal.module';
import { PoTimeModule } from '../pipes/po-time/po-time.module';

@NgModule({
  declarations: [],
  imports: [PoTimeModule, PoDecimalFormatModule],
  exports: [PoTimeModule, PoDecimalFormatModule],
  providers: [],
  bootstrap: []
})
export class PoPipesModule {}

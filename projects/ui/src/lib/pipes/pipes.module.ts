import { NgModule } from '@angular/core';

import { PoTimeModule } from '../pipes/po-time/po-time.module';

@NgModule({
  declarations: [],
  imports: [PoTimeModule],
  exports: [PoTimeModule],
  providers: [],
  bootstrap: []
})
export class PoPipesModule {}

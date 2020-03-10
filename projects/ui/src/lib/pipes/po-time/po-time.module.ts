import { NgModule } from '@angular/core';

import { PoTimePipe } from './po-time.pipe';

/**
 * @description
 *
 * Módulo do pipe `po-time`.
 */
@NgModule({
  declarations: [PoTimePipe],
  imports: [],
  exports: [PoTimePipe],
  providers: [],
  bootstrap: []
})
export class PoTimeModule {}

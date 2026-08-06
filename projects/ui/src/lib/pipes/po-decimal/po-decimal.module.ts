import { NgModule } from '@angular/core';

import { PoDecimalFormatPipe } from './po-decimal.pipe';

@NgModule({
  imports: [PoDecimalFormatPipe],
  exports: [PoDecimalFormatPipe]
})
export class PoDecimalFormatModule {}

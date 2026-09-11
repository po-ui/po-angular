import { NgModule } from '@angular/core';

import { PoDragDropModule } from './po-drag-drop/po-drag-drop.module';
import { PoTooltipModule } from './po-tooltip/po-tooltip.module';

@NgModule({
  declarations: [],
  imports: [PoDragDropModule, PoTooltipModule],
  exports: [PoDragDropModule, PoTooltipModule],
  providers: [],
  bootstrap: []
})
export class PoDirectivesModule {}

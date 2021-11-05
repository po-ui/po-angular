import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PoDisclaimerGroupModule } from '../../po-disclaimer-group/po-disclaimer-group.module';
import { PoDisclaimerModule } from '../../po-disclaimer/po-disclaimer.module';
import { PoModalModule } from '../../po-modal/po-modal.module';
import { PoTableModule } from '../../po-table/po-table.module';
import { PoCleanModule } from '../po-clean/po-clean.module';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoLookupModalComponent } from './po-lookup-modal/po-lookup-modal.component';
import { PoLookupComponent } from './po-lookup.component';

@NgModule({
  declarations: [PoLookupComponent, PoLookupModalComponent],
  imports: [
    FormsModule,
    CommonModule,
    PoCleanModule,
    PoFieldContainerModule,
    PoDisclaimerModule,
    PoModalModule,
    PoTableModule,
    PoDisclaimerModule,
    PoDisclaimerGroupModule
  ],
  exports: [PoLookupComponent, PoLookupModalComponent]
})
export class PoLookupModule {}

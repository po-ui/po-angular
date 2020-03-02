import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';

import { PoLookupComponent } from './po-lookup.component';
import { PoTableModule } from '../../po-table/po-table.module';
import { PoModalModule } from '../../po-modal/po-modal.module';
import { PoLookupModalComponent } from './po-lookup-modal/po-lookup-modal.component';

/**
 * @description
 *
 * Módulo do componente `po-lookup`.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoModalModule,
    PoFieldContainerModule
  ],
  exports: [
    PoLookupComponent,
    PoLookupModalComponent
  ],
  declarations: [
    PoLookupComponent,
    PoLookupModalComponent
  ]
})
export class PoLookupModule { }

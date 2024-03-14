import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoCleanModule } from '../po-field';
import { PoIconModule } from '../po-icon';
import { PoLoadingModule } from '../po-loading';
import { PoSearchComponent } from './po-search.component';
import { FormsModule } from '@angular/forms';
import { PoAccordionModule } from '../po-accordion/po-accordion.module';
import { PoListBoxModule } from '../po-listbox';

/**
 * @description
 *
 * Módulo do componente po-search.
 */
@NgModule({
  imports: [
    CommonModule,
    PoCleanModule,
    PoIconModule,
    PoLoadingModule,
    PoAccordionModule,
    FormsModule,
    PoListBoxModule
  ],
  declarations: [PoSearchComponent],
  exports: [PoSearchComponent]
})
export class PoSearchModule {}

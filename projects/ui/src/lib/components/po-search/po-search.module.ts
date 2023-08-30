import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoCleanModule } from '../po-field';
import { PoIconModule } from '../po-icon';
import { PoLoadingModule } from '../po-loading';
import { PoSearchComponent } from './po-search.component';
import { FormsModule } from '@angular/forms';

/**
 * @description
 *
 * Módulo do componente po-search.
 */
@NgModule({
  imports: [CommonModule, PoCleanModule, PoIconModule, PoLoadingModule, FormsModule],
  declarations: [PoSearchComponent],
  exports: [PoSearchComponent]
})
export class PoSearchModule {}

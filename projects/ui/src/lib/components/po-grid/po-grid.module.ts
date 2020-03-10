import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoFieldModule } from './../../components/po-field/po-field.module';

import { PoGridCellActionComponent } from './po-grid-cell-action/po-grid-cell-action.component';
import { PoGridCellComponent } from './po-grid-cell/po-grid-cell.component';
import { PoGridComponent } from './po-grid.component';
import { PoGridHeadComponent } from './po-grid-head/po-grid-head.component';

/**
 * @description
 *
 * Módulo do componente po-grid.
 */
@NgModule({
  imports: [CommonModule, FormsModule, PoFieldModule],
  declarations: [PoGridCellActionComponent, PoGridCellComponent, PoGridComponent, PoGridHeadComponent],
  exports: [PoGridComponent]
})
export class PoGridModule {}

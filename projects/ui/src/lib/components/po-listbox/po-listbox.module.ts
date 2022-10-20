import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoListBoxComponent } from './po-listbox.component';

@NgModule({
  declarations: [PoItemListComponent, PoListBoxComponent],
  exports: [PoItemListComponent, PoListBoxComponent],
  imports: [CommonModule]
})
export class PoListBoxModule {}

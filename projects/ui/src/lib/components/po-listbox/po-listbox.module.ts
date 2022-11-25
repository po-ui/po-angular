import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoListboxComponent } from './po-listbox.component';

@NgModule({
  declarations: [PoItemListComponent, PoListboxComponent],
  exports: [PoItemListComponent, PoListboxComponent],
  imports: [CommonModule]
})
export class PoListboxModule {}

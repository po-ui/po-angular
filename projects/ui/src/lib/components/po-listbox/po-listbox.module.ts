import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoListBoxComponent } from './po-listbox.component';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoCheckboxModule } from '../po-field/po-checkbox/po-checkbox.module';
import { PoIconModule } from '../po-icon/po-icon.module';
import { CdkListboxModule } from '@angular/cdk/listbox';

@NgModule({
  declarations: [PoListBoxComponent, PoItemListComponent],
  exports: [PoListBoxComponent],
  imports: [CommonModule, PoCheckboxModule, PoIconModule, CdkListboxModule]
})
export class PoListBoxModule {}

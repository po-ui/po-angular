import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { PoListBoxComponent } from './po-listbox.component';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';
import { PoCheckboxModule } from '../po-field/po-checkbox/po-checkbox.module';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoLoadingModule } from '../po-loading/po-loading.module';

@NgModule({
  declarations: [PoListBoxComponent, PoItemListComponent, PoSearchListComponent],
  exports: [PoListBoxComponent],
  imports: [CommonModule, PoCheckboxModule, PoIconModule, PoLoadingModule, CdkListboxModule]
})
export class PoListBoxModule {}

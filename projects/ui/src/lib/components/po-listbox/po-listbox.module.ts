import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { PoTagModule } from '../po-tag';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoListBoxComponent } from './po-listbox.component';
import { PoLoadingModule } from '../po-loading/po-loading.module';
import { PoButtonModule } from '../po-button/po-button.module';
import { PoSkeletonModule } from '../po-skeleton/po-skeleton.module';
import { PoItemListComponent } from './po-item-list/po-item-list.component';
import { PoCheckboxModule } from '../po-field/po-checkbox/po-checkbox.module';
import { PoSearchListComponent } from './po-search-list/po-search-list.component';

@NgModule({
  declarations: [PoListBoxComponent, PoItemListComponent, PoSearchListComponent],
  exports: [PoListBoxComponent],
  imports: [
    CommonModule,
    PoButtonModule,
    PoCheckboxModule,
    PoIconModule,
    PoLoadingModule,
    PoSkeletonModule,
    PoTagModule,
    CdkListboxModule
  ]
})
export class PoListBoxModule {}

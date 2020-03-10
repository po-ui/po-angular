import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoNavbarItemComponent } from './po-navbar-item/po-navbar-item.component';
import { PoNavbarItemsComponent } from './po-navbar-items.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [PoNavbarItemComponent, PoNavbarItemsComponent],
  exports: [PoNavbarItemsComponent]
})
export class PoNavbarItemsModule {}

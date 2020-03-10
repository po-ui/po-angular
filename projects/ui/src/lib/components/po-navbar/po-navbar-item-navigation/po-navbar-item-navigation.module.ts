import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoNavbarItemNavigationComponent } from './po-navbar-item-navigation.component';
import { PoNavbarItemNavigationIconComponent } from './po-navbar-item-navigation-icon/po-navbar-item-navigation-icon.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [PoNavbarItemNavigationComponent, PoNavbarItemNavigationIconComponent],
  exports: [PoNavbarItemNavigationComponent]
})
export class PoNavbarItemNavigationModule {}

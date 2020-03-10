import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoBreadcrumbComponent } from './po-breadcrumb.component';
import { PoBreadcrumbDropdownComponent } from './po-breadcrumb-dropdown/po-breadcrumb-dropdown.component';
import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite/po-breadcrumb-favorite.component';
import { PoBreadcrumbItemComponent } from './po-breadcrumb-item/po-breadcrumb-item.component';

/**
 * @description
 *
 * Módulo do componente po-breadcrumb.
 *
 */
@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    PoBreadcrumbComponent,
    PoBreadcrumbDropdownComponent,
    PoBreadcrumbFavoriteComponent,
    PoBreadcrumbItemComponent
  ],
  exports: [PoBreadcrumbComponent]
})
export class PoBreadcrumbModule {}

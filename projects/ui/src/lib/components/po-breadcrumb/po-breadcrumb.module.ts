import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoBreadcrumbComponent } from './po-breadcrumb.component';
import { PoBreadcrumbFavoriteComponent } from './po-breadcrumb-favorite/po-breadcrumb-favorite.component';
import { PoLinkModule } from '../po-link/po-link.module';
import { PoPopupModule } from '../po-popup/po-popup.module';
import { PoIconModule } from '../po-icon/po-icon.module';

/**
 * @description
 *
 * Módulo do componente po-breadcrumb.
 *
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoLinkModule, PoPopupModule, PoIconModule],
  declarations: [PoBreadcrumbComponent, PoBreadcrumbFavoriteComponent],
  exports: [PoBreadcrumbComponent]
})
export class PoBreadcrumbModule {}

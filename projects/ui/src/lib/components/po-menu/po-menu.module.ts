import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoBadgeModule } from '../po-badge/po-badge.module';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoLoadingModule } from '../po-loading/po-loading.module';

import { PoMenuComponent } from './po-menu.component';
import { PoMenuFilterComponent } from './po-menu-filter/po-menu-filter.component';
import { PoMenuHeaderTemplateDirective } from './po-menu-header-template/po-menu-header-template.directive';
import { PoMenuItemComponent } from './po-menu-item/po-menu-item.component';

/**
 * @description
 *
 * Módulo do componente po-menu.
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoBadgeModule, PoFieldModule, PoLoadingModule],
  declarations: [PoMenuComponent, PoMenuFilterComponent, PoMenuHeaderTemplateDirective, PoMenuItemComponent],
  exports: [PoMenuComponent, PoMenuHeaderTemplateDirective]
})
export class PoMenuModule {}

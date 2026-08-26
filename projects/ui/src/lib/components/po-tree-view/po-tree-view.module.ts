import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PoButtonModule } from '../po-button';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoFieldModule } from '../po-field/po-field.module';
import { PoDividerModule } from '../po-divider/po-divider.module';
import { PoContainerModule } from '../po-container/po-container.module';
import { PoTooltipModule } from '../../directives/po-tooltip/po-tooltip.module';

import { PoTreeViewComponent } from './po-tree-view.component';
import { PoTreeViewItemComponent } from './po-tree-view-item/po-tree-view-item.component';
import { PoTreeViewItemContentComponent } from './po-tree-view-item-content/po-tree-view-item-content.component';

/**
 * @description
 *
 * Módulo do componente `po-tree-view`.
 */
@NgModule({
  declarations: [PoTreeViewComponent, PoTreeViewItemComponent, PoTreeViewItemContentComponent],
  exports: [PoTreeViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    PoContainerModule,
    PoFieldModule,
    PoIconModule,
    PoButtonModule,
    PoDividerModule,
    PoTooltipModule
  ]
})
export class PoTreeViewModule {}

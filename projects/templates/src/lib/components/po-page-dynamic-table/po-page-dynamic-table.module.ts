import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoTableModule } from '@po-ui/ng-components';

import { PoPageDynamicSearchModule } from '../po-page-dynamic-search/po-page-dynamic-search.module';

import { PoPageDynamicTableComponent } from './po-page-dynamic-table.component';
import { PoPageCustomizationModule } from '../../services/po-page-customization/po-page-customization.module';
import { PoPageDynamicModule } from '../../services/po-page-dynamic/po-page-dynamic.module';

/**
 * @description
 *
 * Módulo do template do po-page-dynamic-table.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    PoTableModule,
    PoPageDynamicSearchModule,
    PoPageCustomizationModule,
    PoPageDynamicModule
  ],
  declarations: [PoPageDynamicTableComponent],
  exports: [PoPageDynamicTableComponent]
})
export class PoPageDynamicTableModule {}

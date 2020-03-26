import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoDynamicModule, PoLanguageModule, PoModalModule, PoPageModule } from '@po-ui/ng-components';

import { PoPageCustomizationModule } from '../../services/po-page-customization/po-page-customization.module';

import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';
import { PoPageDynamicSearchComponent } from './po-page-dynamic-search.component';

/**
 * @description
 *
 * Módulo do template do po-page-dynamic-search.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    PoDynamicModule,
    PoLanguageModule,
    PoModalModule,
    PoPageModule,
    PoPageCustomizationModule
  ],
  declarations: [PoAdvancedFilterComponent, PoPageDynamicSearchComponent],
  exports: [PoPageDynamicSearchComponent]
})
export class PoPageDynamicSearchModule {}

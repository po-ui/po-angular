import { Component, ViewChild } from '@angular/core';

import { PoDynamicFormComponent, PoLanguageService } from '@po-ui/ng-components';

import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';
import { PoPageDynamicSearchFilters } from '../po-page-dynamic-search-filters.interface';

/**
 * @docsPrivate
 *
 * @docsExtends PoAdvancedFilterBaseComponent
 *
 * @examplePrivate
 *
 * <example-private name="po-advanced-filter" title="PO Busca Avançada">
 *   <file name="sample-po-advanced-filter.component.html"> </file>
 *   <file name="sample-po-advanced-filter.component.ts"> </file>
 * </example-private>
 */
@Component({
  selector: 'po-advanced-filter',
  templateUrl: './po-advanced-filter.component.html'
})
export class PoAdvancedFilterComponent extends PoAdvancedFilterBaseComponent {
  @ViewChild(PoDynamicFormComponent, { static: true }) poDynamicForm: PoDynamicFormComponent;

  constructor(languageService: PoLanguageService) {
    super(languageService);
  }

  open() {
    this.filter = this.keepFilters ? this.getInitialValuesFromFilter(this.filters) : {};

    this.poModal.open();
  }

  private getInitialValuesFromFilter(filters: Array<PoPageDynamicSearchFilters>) {
    return filters.reduce((result, item) => Object.assign(result, { [item.property]: item.initValue }), {});
  }
}

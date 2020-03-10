import { Component, ViewChild } from '@angular/core';

import { PoDynamicFormComponent, PoLanguageService } from '@portinari/portinari-ui';

import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';

/**
 * @docsPrivate
 *
 * @docsExtends PoAdvancedFilterBaseComponent
 *
 * @examplePrivate
 *
 * <example-private name="po-advanced-filter" title="Portinari Busca Avançada">
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
    this.filter = {};
    this.poModal.open();
  }
}

import { Component, ViewChild } from '@angular/core';

import { PoDynamicFormComponent, PoModalAction, PoModalComponent } from '@portinari/portinari-ui';

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

  filter = {};

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  @ViewChild(PoDynamicFormComponent, { static: true }) poDynamicForm: PoDynamicFormComponent;

  primaryAction: PoModalAction = {
    action: () => {
      const models = this.getValuesFromForm();

      this.searchEvent.emit(models);
      this.poModal.close();
    },
    label: this.literals.primaryActionLabel
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.poModal.close();
    },
    label: this.literals.secondaryActionLabel
  };

  // Retorna os models dos campos preenchidos
  getValuesFromForm() {
    Object.keys(this.filter).forEach(property => {
      if (this.filter[property] === undefined || this.filter[property] === '') {
        delete this.filter[property];
      }
    });

    return this.filter;
  }

  open() {
    this.filter = {};
    this.poModal.open();
  }

}

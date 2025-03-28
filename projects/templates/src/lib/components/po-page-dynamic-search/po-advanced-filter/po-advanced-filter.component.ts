import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { PoComboOption, PoDynamicFormComponent, PoLanguageService, PoThemeService } from '@po-ui/ng-components';

import { PoPageDynamicSearchFilters } from '../interfaces/po-page-dynamic-search-filters.interface';
import { PoAdvancedFilterBaseComponent } from './po-advanced-filter-base.component';

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
  templateUrl: './po-advanced-filter.component.html',
  standalone: false
})
export class PoAdvancedFilterComponent extends PoAdvancedFilterBaseComponent implements OnDestroy, OnInit {
  @ViewChild(PoDynamicFormComponent, { static: true }) poDynamicForm: PoDynamicFormComponent;

  private subscription = new Subscription();

  constructor(
    languageService: PoLanguageService,
    protected poThemeService: PoThemeService
  ) {
    super(languageService, poThemeService);
  }

  ngOnInit() {
    this.optionsServiceSubscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  open() {
    this.filter = this.keepFilters ? this.getInitialValuesFromFilter(this.filters) : {};

    this.poModal.open();
  }

  private getOptionsServiceItem(optionServiceObject: PoComboOption) {
    const objectItem = this.optionsServiceChosenOptions.map(option => option.value).indexOf(optionServiceObject.value);

    if (objectItem === -1) {
      this.optionsServiceChosenOptions = [...this.optionsServiceChosenOptions, optionServiceObject];
    }
  }

  private getInitialValuesFromFilter(filters: Array<PoPageDynamicSearchFilters>) {
    return filters.reduce((result, item) => Object.assign(result, { [item.property]: item.initValue }), {});
  }

  // Se inscreve para receber valores referentes a campos do tipo combo.
  private optionsServiceSubscribe() {
    this.subscription.add(
      this.poDynamicForm.getObjectValue().subscribe(optionServiceObject => {
        if (optionServiceObject) {
          this.getOptionsServiceItem(optionServiceObject);
        }
      })
    );
  }
}

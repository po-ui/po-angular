import { Component, ViewChild } from '@angular/core';

import { PoDisclaimerGroup, PoDynamicFieldType, PoDynamicFormField, PoPageFilter } from '@portinari/portinari-ui';

import { capitalizeFirstLetter, getBrowserLanguage } from '../../utils/util';

import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';
import { PoPageDynamicSearchBaseComponent } from './po-page-dynamic-search-base.component';

/**
 * @docsExtends PoPageDynamicSearchBaseComponent
 *
 * @example
 *
 * <example name="po-page-dynamic-search-basic" title="Portinari Page Dynamic Search Basic">
 *  <file name="sample-po-page-dynamic-search-basic/sample-po-page-dynamic-search-basic.component.html"> </file>
 *  <file name="sample-po-page-dynamic-search-basic/sample-po-page-dynamic-search-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-page-dynamic-search-hiring-processes" title="Portinari Page Dynamic Search - Hiring processes">
 *  <file name="sample-po-page-dynamic-search-hiring-processes/sample-po-page-dynamic-search-hiring-processes.component.html"> </file>
 *  <file name="sample-po-page-dynamic-search-hiring-processes/sample-po-page-dynamic-search-hiring-processes.component.ts"> </file>
 *  <file name="sample-po-page-dynamic-search-hiring-processes/sample-po-page-dynamic-search-hiring-processes.service.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-page-dynamic-search',
  templateUrl: './po-page-dynamic-search.component.html'
})
export class PoPageDynamicSearchComponent extends PoPageDynamicSearchBaseComponent {

  private readonly _disclaimerGroup: PoDisclaimerGroup = {
    change: this.onChangeDisclaimerGroup.bind(this),
    disclaimers: [],
    title: this.literals.disclaimerGroupTitle
  };

  private readonly _filterSettings: PoPageFilter = {
    action: 'onAction',
    advancedAction: 'onAdvancedAction',
    ngModel: 'quickFilter',
    placeholder: this.literals.filterSettingsPlaceholder
  };

  // Flag to control when changeDisclaimerGroup should be called
  private changeDisclaimersEnabled: boolean = false;

  private quickFilter;

  @ViewChild(PoAdvancedFilterComponent, { static: true }) poAdvancedFilter: PoAdvancedFilterComponent;

  get disclaimerGroup() {
    return Object.assign({}, this._disclaimerGroup);
  }

  get filterSettings() {
    this._filterSettings.advancedAction = this.filters.length === 0 ? undefined : 'onAdvancedAction';

    return Object.assign({}, this._filterSettings);
  }

  onAction() {
    this.changeDisclaimersEnabled = false;
    this._disclaimerGroup.disclaimers = [
      { property: 'search', label: `${this.literals.quickSearchLabel} ${this.quickFilter}`, value: this.quickFilter }
    ];

    if (this.quickSearch.observers && this.quickSearch.observers.length > 0) {
      this.quickSearch.emit(this.quickFilter);
    }

    this.quickFilter = undefined;
  }

  onAdvancedAction() {
    this.poAdvancedFilter.open();
  }

  onAdvancedSearch(filters) {
    this.changeDisclaimersEnabled = false;
    this._disclaimerGroup.disclaimers = this.setDisclaimers(filters);

    this.advancedSearch.emit(filters);
  }

  private formatDate(date: string) {
    const year = parseInt(date.substr(0, 4), 10);
    const month = parseInt(date.substr(5, 2), 10);
    const day = parseInt(date.substr(8, 2), 10);

    return new Date(year, month - 1, day).toLocaleDateString(getBrowserLanguage());
  }

  private getFieldByProperty(fields: Array<PoDynamicFormField>, fieldName: string) {
    return fields.find((field: PoDynamicFormField) => field.property === fieldName);
  }

  private onChangeDisclaimerGroup(disclaimers) {
    this.changeDisclaimersEnabled ? this.changeDisclaimers.emit(disclaimers) : this.changeDisclaimersEnabled = true;
  }

  private setDisclaimers(filters) {
    const disclaimers = [];

    Object.keys(filters).forEach(filter => {
      const field = this.getFieldByProperty(this.filters, filter);
      const label = field.label || capitalizeFirstLetter(field.property);
      const value = field.type === PoDynamicFieldType.Date ? this.formatDate(filters[filter]) : filters[filter];

      disclaimers.push({
        label: `${label}: ${value}`,
        property: filter,
        value: filters[filter]
      });
    });

    return disclaimers;
  }

}

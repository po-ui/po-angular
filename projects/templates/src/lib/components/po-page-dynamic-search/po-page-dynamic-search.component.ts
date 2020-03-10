import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import {
  PoDisclaimerGroup,
  PoDynamicFieldType,
  PoDynamicFormField,
  PoLanguageService,
  PoPageFilter
} from '@portinari/portinari-ui';

import { capitalizeFirstLetter, getBrowserLanguage } from '../../utils/util';
import { PoPageCustomizationService } from '../../services/po-page-customization/po-page-customization.service';

import { PoAdvancedFilterComponent } from './po-advanced-filter/po-advanced-filter.component';
import { PoPageDynamicSearchBaseComponent } from './po-page-dynamic-search-base.component';
import { PoPageDynamicSearchOptions } from './po-page-dynamic-search-options.interface';
import { PoPageDynamicOptionsSchema } from '../../services';

type UrlOrPoCustomizationFunction = string | (() => PoPageDynamicSearchOptions);

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
export class PoPageDynamicSearchComponent extends PoPageDynamicSearchBaseComponent implements OnInit, OnDestroy {
  private loadSubscription: Subscription;

  private readonly _disclaimerGroup: PoDisclaimerGroup = {
    change: this.onChangeDisclaimerGroup.bind(this),
    disclaimers: [],
    title: this.literals.disclaimerGroupTitle
  };

  private readonly _filterSettings: PoPageFilter = {
    action: 'onAction',
    advancedAction: 'onAdvancedAction',
    ngModel: 'quickFilter',
    placeholder: this.literals.searchPlaceholder
  };

  // Flag to control when changeDisclaimerGroup should be called
  private changeDisclaimersEnabled: boolean = false;

  private quickFilter;

  @ViewChild(PoAdvancedFilterComponent, { static: true }) poAdvancedFilter: PoAdvancedFilterComponent;

  constructor(languageService: PoLanguageService, private poPageCustomizationService: PoPageCustomizationService) {
    super(languageService);
  }

  get disclaimerGroup() {
    return Object.assign({}, this._disclaimerGroup, { title: this.literals.disclaimerGroupTitle });
  }

  get filterSettings() {
    this._filterSettings.advancedAction = this.filters.length === 0 ? undefined : 'onAdvancedAction';

    return Object.assign({}, this._filterSettings, { placeholder: this.literals.searchPlaceholder });
  }

  ngOnInit() {
    this.setAdvancedFilterLiterals(this.literals);
    if (this.onLoad) {
      this.loadOptionsOnInitialize(this.onLoad);
    }
  }

  ngOnDestroy() {
    if (this.loadSubscription) {
      this.loadSubscription.unsubscribe();
    }
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

  private applyDisclaimerLabelValue(field: any, filterValue: any) {
    const values = Array.isArray(filterValue) ? filterValue : [filterValue];

    const labels = values.map(value => {
      const filteredField = field.options.find(option => option.value === value);

      return filteredField.label || filteredField.value;
    });

    return labels.join(', ');
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

  private getFilterValueToDisclaimer(field: any, value: any) {
    if (field.type === PoDynamicFieldType.Date) {
      return this.formatDate(value);
    }

    if (field.options) {
      return this.applyDisclaimerLabelValue(field, value);
    }

    return value;
  }

  private onChangeDisclaimerGroup(disclaimers) {
    this.changeDisclaimersEnabled ? this.changeDisclaimers.emit(disclaimers) : (this.changeDisclaimersEnabled = true);
  }

  private setDisclaimers(filters) {
    const disclaimers = [];
    const properties = Object.keys(filters);

    properties.forEach(property => {
      const field = this.getFieldByProperty(this.filters, property);
      const label = field.label || capitalizeFirstLetter(field.property);
      const value = filters[property];

      disclaimers.push({
        label: `${label}: ${this.getFilterValueToDisclaimer(field, value)}`,
        property,
        value
      });
    });

    return disclaimers;
  }

  private loadOptionsOnInitialize(onLoad: UrlOrPoCustomizationFunction) {
    this.loadSubscription = this.getPoDynamicPageOptions(onLoad).subscribe(responsePoOption =>
      this.poPageCustomizationService.changeOriginalOptionsToNewOptions(this, responsePoOption)
    );
  }

  private getPoDynamicPageOptions(onLoad: UrlOrPoCustomizationFunction): Observable<PoPageDynamicSearchOptions> {
    const originalOption: PoPageDynamicSearchOptions = {
      title: this.title,
      actions: this.actions,
      breadcrumb: this.breadcrumb,
      filters: this.filters
    };

    const pageOptionSchema: PoPageDynamicOptionsSchema<PoPageDynamicSearchOptions> = {
      schema: [
        {
          nameProp: 'filters',
          merge: true,
          keyForMerge: 'property'
        },
        {
          nameProp: 'actions',
          merge: true,
          keyForMerge: 'label'
        },
        {
          nameProp: 'breadcrumb'
        },
        {
          nameProp: 'title'
        }
      ]
    };

    return this.poPageCustomizationService.getCustomOptions(onLoad, originalOption, pageOptionSchema);
  }
}

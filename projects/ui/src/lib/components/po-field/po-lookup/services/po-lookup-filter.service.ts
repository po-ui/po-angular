import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { isTypeof } from '../../../../utils/util';

import { PoLookupFilter } from '../interfaces/po-lookup-filter.interface';
import { PoLookupFilteredItemsParams } from '../interfaces/po-lookup-filtered-items-params.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço padrão utilizado para filtrar os dados do componente po-lookup.
 */
@Injectable()
export class PoLookupFilterService implements PoLookupFilter {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  private url: string;
  private fieldValue;
  private multiple = false;

  constructor(private httpClient: HttpClient) {}

  getFilteredItems(filteredItemsParams: PoLookupFilteredItemsParams): Observable<any> {
    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredItemsParams;

    const validatedFilterParams = this.validateParams(filterParams);
    const validatedAdvancedFilters = this.validateParams(advancedFilters);

    const params = { ...restFilteredItemsParams, ...validatedFilterParams, ...validatedAdvancedFilters };

    return this.httpClient.get(this.url, { headers: this.headers, params });
  }

  getObjectByValue(value: any, filterParams?: any): Observable<Array<any> | { [key: string]: any }> {
    const validatedFilterParams = this.validateParams(filterParams);

    let newURL;
    let encodedValue;

    if (this.multiple) {
      encodedValue = encodeURIComponent(Array.isArray(value) ? value.join(',') : value);
      newURL = `${this.url}?${this.fieldValue}=${encodedValue}`;
    } else {
      encodedValue = encodeURIComponent(value);
      newURL = `${this.url}/${encodedValue}`;
    }

    return this.httpClient
      .get(newURL, { headers: this.headers, params: validatedFilterParams })
      .pipe(map((response: any) => ('items' in response ? response.items : response)));
  }

  setConfig(url: string, fieldValue: string, multiple: boolean) {
    this.url = url;
    this.fieldValue = fieldValue;
    this.multiple = multiple;
  }

  private validateParams(params: any) {
    return isTypeof(params, 'object') && !Array.isArray(params) ? params : undefined;
  }
}

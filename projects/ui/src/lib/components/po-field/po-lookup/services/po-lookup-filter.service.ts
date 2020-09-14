import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

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
  private url: string;

  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  constructor(private httpClient: HttpClient) {}

  getFilteredItems(filteredItemsParams: PoLookupFilteredItemsParams): Observable<any> {
    const { filterParams, advancedFilters, ...restFilteredItemsParams } = filteredItemsParams;

    const validatedFilterParams = this.validateParams(filterParams);
    const validatedAdvancedFilters = this.validateParams(advancedFilters);

    const params = { ...restFilteredItemsParams, ...validatedFilterParams, ...validatedAdvancedFilters };

    return this.httpClient.get(this.url, { headers: this.headers, params });
  }

  getObjectByValue(value: string, filterParams?: any): Observable<any> {
    const encodedValue = encodeURIComponent(value);
    const validatedFilterParams = this.validateParams(filterParams);

    return this.httpClient.get(`${this.url}/${encodedValue}`, { headers: this.headers, params: validatedFilterParams });
  }

  setUrl(url: string) {
    this.url = url;
  }

  private validateParams(params: any) {
    return isTypeof(params, 'object') && !Array.isArray(params) ? params : undefined;
  }
}

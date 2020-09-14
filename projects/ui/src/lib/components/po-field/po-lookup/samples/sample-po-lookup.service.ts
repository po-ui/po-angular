import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoLookupFilter, PoLookupFilteredItemsParams } from '@po-ui/ng-components';

@Injectable()
export class SamplePoLookupService implements PoLookupFilter {
  private url = 'https://po-sample-api.herokuapp.com/v1/heroes';

  constructor(private httpClient: HttpClient) {}

  getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const { advancedFilters, page, pageSize } = filteredParams;
    delete filteredParams.advancedFilters;

    const params = { ...filteredParams, page: page.toString(), pageSize: pageSize.toString(), ...advancedFilters };

    return this.httpClient.get(this.url, { params });
  }

  getObjectByValue(value: string): Observable<any> {
    return this.httpClient.get(`${this.url}/${value}`);
  }
}

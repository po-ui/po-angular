import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PoLookupFilteredItemsParams, PoLookupFilter } from '../../../ui/src/lib';
import { Observable } from 'rxjs';

@Injectable()
export class AccountService implements PoLookupFilter {

  readonly url = '/dts/datasul-rest/resources/prg/cgc/v1/crmAccount';

  constructor(public http: HttpClient) { }

  getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
    const { page, pageSize } = filteredParams;
    const params = { ...filteredParams, page: page.toString(), pageSize: pageSize.toString() };

    return this.http.get(this.url, { params });
  }

  getObjectByValue(value: string): Observable<any> {
    return this.http.get(`${this.url}/${value}`);
  }
}

import { debounceTime } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { isTypeof } from '../../../utils/util';
import { PoTableFilter } from '../interfaces/po-table-filter.interface';
import { PoTableFilteredItemsParams } from '../interfaces/po-table-filtered-items-params.interface';

@Injectable({
  providedIn: 'root'
})
export class PoTableService implements PoTableFilter {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  private url: string;

  constructor(private http: HttpClient) {}

  getFilteredItems(filteredParams?: PoTableFilteredItemsParams): Observable<any> {
    const params = this.validateParams(filteredParams);

    return this.http.get(this.url, { headers: this.headers, params });
  }

  setUrl(url: string) {
    this.url = url;
  }

  scrollListener(componentListner: HTMLElement): Observable<any> {
    return fromEvent(componentListner, 'scroll').pipe(debounceTime(100));
  }

  private validateParams(params: any) {
    return isTypeof(params, 'object') && !Array.isArray(params) ? params : undefined;
  }
}

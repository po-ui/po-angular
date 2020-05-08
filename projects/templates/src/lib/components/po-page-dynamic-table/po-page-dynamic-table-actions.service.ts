import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PoPageDynamicTableActions } from './interfaces/po-page-dynamic-table-actions.interface';
import { PoPageDynamicTableBeforeNew } from './interfaces/po-page-dynamic-table-before-new.interface';

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicTableActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeNew(action?: PoPageDynamicTableActions['beforeNew']): Observable<PoPageDynamicTableBeforeNew> {
    if (action) {
      if (typeof action === 'string') {
        return this.http.post<PoPageDynamicTableBeforeNew>(action, {}, { headers: this.headers });
      }
      return of(action());
    }
    return of({});
  }
}

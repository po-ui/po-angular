import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PoPageDynamicTableActions } from './interfaces/po-page-dynamic-table-actions.interface';
import { PoPageDynamicTableBeforeNew } from './interfaces/po-page-dynamic-table-before-new.interface';
import { PoPageDynamicTableBeforeRemove } from './interfaces/po-page-dynamic-table-before-remove.interface';
import { PoPageDynamicTableBeforeDetail } from './interfaces/po-page-dynamic-table-before-detail.interface';

interface ExecuteActionParameter {
  action: string | Function;
  resource?: any;
  id?: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicTableActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeNew(action?: PoPageDynamicTableActions['beforeNew']): Observable<PoPageDynamicTableBeforeNew> {
    return this.executeAction({ action });
  }

  beforeRemove(
    action: PoPageDynamicTableActions['beforeRemove'],
    id: string,
    resource: any
  ): Observable<PoPageDynamicTableBeforeRemove> {
    return this.executeAction({ action, id, resource });
  }

  beforeDetail(
    action: PoPageDynamicTableActions['beforeDetail'],
    id: string,
    resource: any
  ): Observable<PoPageDynamicTableBeforeDetail> {
    return this.executeAction({ action, id, resource });
  }

  private executeAction<T>({ action, resource = {}, id }: ExecuteActionParameter): Observable<T> {
    if (!action) {
      return of(<T>{});
    }

    if (typeof action === 'string') {
      const url = id ? `${action}/${id}` : action;

      return this.http.post<T>(url, resource, { headers: this.headers });
    }

    return of(action(id, resource));
  }
}

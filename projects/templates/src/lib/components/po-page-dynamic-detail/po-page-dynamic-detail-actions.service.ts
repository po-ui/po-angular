import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PoPageDynamicDetailActions } from './interfaces/po-page-dynamic-detail-actions.interface';
import { PoPageDynamicDetailBeforeBack } from './interfaces/po-page-dynamic-detail-before-back.interface';
import { PoPageDynamicDetailBeforeRemove } from './interfaces/po-page-dynamic-detail-before-remove.interface';
import { PoPageDynamicDetailBeforeEdit } from './interfaces/po-page-dynamic-detail-before-edit.interface';

interface ExecuteActionParameter {
  action: string | Function;
  resource?: any;
  id?: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicDetailActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeBack(action?: PoPageDynamicDetailActions['beforeBack']): Observable<PoPageDynamicDetailBeforeBack> {
    return this.executeAction({ action });
  }

  beforeEdit(
    action: PoPageDynamicDetailActions['beforeEdit'],
    id: any,
    body: any
  ): Observable<PoPageDynamicDetailBeforeEdit> {
    const resource = body ?? {};

    return this.executeAction({ action, resource, id });
  }

  beforeRemove(
    action: PoPageDynamicDetailActions['beforeRemove'],
    id: any,
    body: any
  ): Observable<PoPageDynamicDetailBeforeRemove> {
    const resource = body ?? {};

    return this.executeAction({ action, resource, id });
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

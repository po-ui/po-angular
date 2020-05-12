import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';

import { PoPageDynamicEditActions } from './interfaces/po-page-dynamic-edit-actions.interface';
import { PoPageDynamicEditBeforeCancel } from './interfaces/po-page-dynamic-edit-before-cancel.interface';
import { PoPageDynamicEditBeforeSave } from './interfaces/po-page-dynamic-edit-before-save.interface';

interface ExecuteActionParameter {
  action: string | Function;
  resource?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicEditActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeCancel(action: PoPageDynamicEditActions['beforeCancel']): Observable<PoPageDynamicEditBeforeCancel> {
    return this.executeAction({ action });
  }

  beforeSave(action: PoPageDynamicEditActions['beforeSave'], body: any): Observable<PoPageDynamicEditBeforeSave> {
    const resource = body ?? {};

    return this.executeAction({ action, resource });
  }

  private executeAction<T>({ action, resource = {} }: ExecuteActionParameter): Observable<T> {
    if (!action) {
      return of(<T>{});
    }

    if (typeof action === 'string') {
      return this.http.post<T>(action, resource, { headers: this.headers });
    }

    return of(action(resource));
  }
}

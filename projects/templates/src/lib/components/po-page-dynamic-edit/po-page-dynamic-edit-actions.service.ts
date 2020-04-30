import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';

import { PoPageDynamicEditBeforeSave } from './interfaces/po-page-dynamic-edit-before-save.interface';
import { PoPageDynamicEditActions } from './interfaces/po-page-dynamic-edit-actions.interface';

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicEditActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeSave(path: PoPageDynamicEditActions['beforeSave'], resource: any): Observable<PoPageDynamicEditBeforeSave> {
    const resourceToPost = resource ?? {};

    if (!path) {
      return of({});
    }

    if (typeof path === 'string') {
      return this.http.post(path, resourceToPost, { headers: this.headers });
    }

    return of(path(resourceToPost));
  }
}

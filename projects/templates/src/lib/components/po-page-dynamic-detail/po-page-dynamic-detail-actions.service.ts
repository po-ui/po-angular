import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  PoPageDynamicDetailActions,
  PoPageDynamicDetailBeforeBack
} from './interfaces/po-page-dynamic-detail-actions.interface';

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicDetailActionsService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  beforeBack(action?: PoPageDynamicDetailActions['beforeBack']): Observable<PoPageDynamicDetailBeforeBack> {
    if (action) {
      if (typeof action === 'string') {
        return this.http.post(action, {}, { headers: this.headers });
      }
      return of(action());
    }
    return of({});
  }
}

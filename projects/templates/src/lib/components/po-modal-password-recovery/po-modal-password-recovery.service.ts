import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PoModalPasswordRecovery } from './interfaces/po-modal-password-recovery.interface';

@Injectable({
  providedIn: 'root'
})
export class PoModalPasswordRecoveryService {
  constructor(private http: HttpClient) {}

  post(
    urlRecovery: string,
    item: PoModalPasswordRecovery,
    params?: HttpParams | { [param: string]: string | Array<string> }
  ): Observable<HttpResponse<object>> {
    return this.http.post<any>(urlRecovery, item, { observe: 'response', params: params });
  }
}

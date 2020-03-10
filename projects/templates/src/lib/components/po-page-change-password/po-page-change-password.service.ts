import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable()
export class PoPageChangePasswordService {
  constructor(private http: HttpClient) {}

  post(url: string, item: any): Observable<HttpResponse<Object>> {
    return this.http.post<any>(url, item, { observe: 'response' });
  }
}

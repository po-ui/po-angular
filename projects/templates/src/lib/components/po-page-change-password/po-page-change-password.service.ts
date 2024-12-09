import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PoPageChangePasswordService {
  constructor(private http: HttpClient) {}

  post(url: string, item: any): Observable<HttpResponse<object>> {
    return this.http.post<any>(url, item, { observe: 'response' });
  }
}

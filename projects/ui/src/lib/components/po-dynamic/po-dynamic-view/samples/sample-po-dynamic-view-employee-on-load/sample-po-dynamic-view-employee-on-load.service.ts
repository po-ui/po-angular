import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class SamplePoDynamicViewEmployeeOnLoadService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  url: string;
  filterParams;

  constructor(private httpClient: HttpClient) {}

  getObjectByValue(value: string | Array<any>, filterParams?: any): Observable<Array<any> | { [key: string]: any }> {
    return this.httpClient
      .get(this.url, {
        headers: this.headers,
        params: this.filterParams
      })
      .pipe(map((response: any) => ('items' in response ? response.items : response)));
  }

  setConfig(url: string, filterParams) {
    this.url = url;
    this.filterParams = filterParams;
  }
}

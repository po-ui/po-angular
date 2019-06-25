import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PoLookupFilter } from '@portinari/portinari-ui';

@Injectable()
export class SamplePoLookupService implements PoLookupFilter {

  private url = 'https://portinari.io/sample/api/new/heroes';

  constructor(private httpClient: HttpClient) { }

  getFilteredData(filter: string, page: number, pageSize: number): Observable<any> {
    return this.httpClient.get(this.url, { params: { page: page.toString(), pageSize: pageSize.toString(), filter } });
  }

  getObjectByValue(value: string): Observable<any> {
    return this.httpClient.get(`${this.url}/${value}`);
  }

}

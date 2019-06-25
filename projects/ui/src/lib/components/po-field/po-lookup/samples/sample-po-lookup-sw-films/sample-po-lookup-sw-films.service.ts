import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PoLookupFilter, PoLookupResponseApi } from '@portinari/portinari-ui';

@Injectable()
export class SamplePoLookupSwFilmsService implements PoLookupFilter {

  private baseUrl = 'https://swapi.co/api';
  private filmsUrl = 'https://swapi.co/api/films/';

  constructor(private http: HttpClient) { }

  getFilms() {
    return this.http.get(this.filmsUrl);
  }

  getFilteredData(filter: string, page: number, pageSize, filterParams: any): Observable<PoLookupResponseApi> {
    const searchParam = { params: { page: page.toString(), search: filter } };

    return this.http.get(`${this.baseUrl}/${filterParams}`, searchParam)
      .pipe(map((response: { results: Array<any>, next: string }) => {
        return {
          items: response.results,
          hasNext: !!response.next
        };
      }));
  }

  getObjectByValue(value: string, filterParams: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${filterParams}/?search=${value}`)
      .pipe(map((response: { results: Array<any> }) => response.results[0]));
  }

}

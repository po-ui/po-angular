import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoMultiselectOption, PoMultiselectFilter } from '@po-ui/ng-components';

@Injectable()
export class SamplePoMultiselectHeroesService implements PoMultiselectFilter {
  constructor(private http: HttpClient) {}

  getFilteredData({ value }): Observable<Array<PoMultiselectOption>> {
    const params = { filter: value };

    return this.http
      .get(`https://po-sample-api.herokuapp.com/v1/heroes?page=1&pageSize=10`, { params })
      .pipe(map((response: { items: Array<PoMultiselectOption> }) => response.items));
  }

  getObjectsByValues(value: Array<string | number>): Observable<Array<PoMultiselectOption>> {
    return this.http
      .get(`https://po-sample-api.herokuapp.com/v1/heroes/?value=${value.toString()}`)
      .pipe(map((response: { items: Array<PoMultiselectOption> }) => response.items));
  }
}

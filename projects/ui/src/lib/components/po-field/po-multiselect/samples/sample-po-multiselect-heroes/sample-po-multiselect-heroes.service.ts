import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoMultiselectOption, PoMultiselectFilter } from '@po-ui/ng-components';

@Injectable()
export class SamplePoMultiselectHeroesService implements PoMultiselectFilter {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  constructor(private http: HttpClient) {}

  getFilteredData(param: { property: 'string'; value: 'string' }): Observable<Array<PoMultiselectOption>> {
    const params = { filter: param.value };

    return this.http
      .get(`https://po-sample-api.herokuapp.com/v1/heroes?page=1&pageSize=10`, {
        responseType: 'json',
        params,
        headers: this.headers
      })
      .pipe(map(response => this.parseToArrayMultiselectOptions(response['items'])));
  }

  getObjectsByValues(value: Array<string | number>): Observable<Array<PoMultiselectOption>> {
    return this.http
      .get(`https://po-sample-api.herokuapp.com/v1/heroes/?value=${value.toString()}`, { headers: this.headers })
      .pipe(map(response => this.parseToArrayMultiselectOptions(response['items'])));
  }

  private parseToArrayMultiselectOptions(items: Array<any>): Array<PoMultiselectOption> {
    if (items && items.length > 0) {
      return items.map(item => this.parseToMultiselectOption(item));
    }

    return [];
  }

  private parseToMultiselectOption(item: any): PoMultiselectOption {
    const label = item.label;
    const value = item.value;

    return { label, value };
  }
}

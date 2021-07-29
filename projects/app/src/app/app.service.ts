import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoMultiselectOption } from '../../../ui/src/lib';
import { PoMultiselectFilter } from './../../../ui/src/lib/components/po-field/po-multiselect/po-multiselect-filter.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço padrão utilizado para filtrar os dados do componente po-multiselect.
 */
@Injectable()
export class PoAppService implements PoMultiselectFilter {
  fieldLabel: string = 'label';
  fieldValue: string = 'value';

  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  constructor(private http: HttpClient) {}

  getFilteredData(param?: any): Observable<Array<PoMultiselectOption>> {
    const value = param.value ?? param.search;

    const params = { filter: value };

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
      .get(`http://localhost:3000/v1/heroes/${value.toString()}`, { headers: this.headers })
      .pipe(map(response => this.parseToArrayMultiselectOptions(response['items'])));
  }

  private parseToArrayMultiselectOptions(items: Array<any>): Array<PoMultiselectOption> {
    if (items && items.length > 0) {
      return items.map(item => this.parseToMultiselectOption(item));
    }

    return [];
  }

  private parseToMultiselectOption(item: any): PoMultiselectOption {
    const label = item[this.fieldLabel];
    const value = item[this.fieldValue];

    return { label, value };
  }
}

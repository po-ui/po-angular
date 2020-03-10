import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoComboFilter } from './interfaces/po-combo-filter.interface';
import { PoComboOption } from './interfaces/po-combo-option.interface';
import { PoResponse } from './interfaces/po-response.interface';
import { validateObjectType } from '../../../utils/util';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço padrão utilizado para filtrar os dados do componente po-combo.
 */
@Injectable()
export class PoComboFilterService implements PoComboFilter {
  private _url: string;

  fieldLabel: string = 'label';
  fieldValue: string = 'value';

  get url(): string {
    return this._url;
  }

  constructor(private http: HttpClient) {}

  getFilteredData(param: any, filterParams?: any): Observable<Array<PoComboOption>> {
    const value = param.value;
    const filterParamsValidated = validateObjectType(filterParams);

    const params = { ...filterParamsValidated, filter: value };

    return this.http
      .get(`${this.url}`, { responseType: 'json', params: params })
      .pipe(map((response: PoResponse) => this.parseToArrayComboOption(response.items)));
  }

  getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
    const filterParamsValidated = validateObjectType(filterParams);

    return this.http
      .get(`${this.url}/${value}`, { params: filterParamsValidated })
      .pipe(map(item => this.parseToComboOption(item)));
  }

  configProperties(url: string, fieldLabel: string, fieldValue: string) {
    this._url = url;
    this.fieldLabel = fieldLabel;
    this.fieldValue = fieldValue;
  }

  private parseToArrayComboOption(items: Array<any>): Array<PoComboOption> {
    if (items && items.length > 0) {
      return items.map(item => {
        return this.parseToComboOption(item);
      });
    }

    return [];
  }

  private parseToComboOption(item: any): PoComboOption {
    if (item && item[this.fieldValue]) {
      const label = item[this.fieldLabel];
      const value = item[this.fieldValue];

      return { label, value };
    }
  }
}

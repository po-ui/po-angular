import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private messages = [];

  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  get url(): string {
    return this._url;
  }

  constructor(private http: HttpClient) {}

  getFilteredData(param: any, filterParams?: any): Observable<Array<PoComboOption>> {
    const value = param.value;
    const filterParamsValidated = validateObjectType(filterParams);

    const params = { ...filterParamsValidated, filter: value };

    return this.http
      .get(`${this.url}`, { responseType: 'json', params, headers: this.headers })
      .pipe(map((response: PoResponse) => this.parseToArrayComboOption(response.items)));
  }

  getObjectByValue(value: string | number, filterParams?: any): Observable<PoComboOption> {
    const filterParamsValidated = validateObjectType(filterParams);

    return this.http
      .get(`${this.url}/${value}`, { params: filterParamsValidated, headers: this.headers })
      .pipe(map(item => this.parseToComboOption(item)));
  }

  configProperties(url: string, fieldLabel: string, fieldValue: string) {
    this._url = url;
    this.fieldLabel = fieldLabel;
    this.fieldValue = fieldValue;
  }

  private parseToArrayComboOption(items: Array<any>): Array<PoComboOption> {
    if (items && items.length > 0) {
      const parsedOptions = items.map(item => this.parseToComboOption(item));

      this.displayMessages();

      return parsedOptions;
    }

    return [];
  }

  private parseToComboOption(item: any): PoComboOption {
    if (!item?.[this.fieldValue]) {
      this.addMessage(item, this.fieldValue);

      return { value: '' };
    }

    const label = item[this.fieldLabel];
    const value = item[this.fieldValue];

    return { label, value };
  }

  private addMessage(item, property: string) {
    this.messages.push(`Cannot read property "${property}" of ${JSON.stringify(item)},
      see [p-field-value] property at https://po-ui.io/documentation/po-combo`);
  }

  private displayMessages() {
    if (this.messages.length) {
      this.messages.forEach(message => console.error(message));

      this.messages = [];
    }
  }
}

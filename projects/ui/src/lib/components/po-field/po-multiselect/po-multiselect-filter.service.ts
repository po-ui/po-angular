import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PoMultiselectFilter } from './po-multiselect-filter.interface';
import { PoMultiselectOption } from './po-multiselect-option.interface';

@Injectable()
export class PoMultiselectFilterService implements PoMultiselectFilter {
  fieldLabel: string = 'label';
  fieldValue: string = 'value';

  private _url: string;
  private messages = [];

  get url(): string {
    return this._url;
  }

  constructor(private http: HttpClient) {}

  getFilteredData({ value }: any): Observable<Array<PoMultiselectOption | any>> {
    const params = value ? { filter: value } : {};
    return this.http
      .get(this.url, {
        params
      })
      .pipe(map(response => this.parseToArrayMultiselectOptions(response['items'])));
  }

  getObjectsByValues(value: Array<string | number>): Observable<Array<PoMultiselectOption | any>> {
    return this.http
      .get(`${this.url}?${this.fieldValue}=${value.toString()}`)
      .pipe(map(response => this.parseToArrayMultiselectOptions(response['items'])));
  }

  configProperties(url: string, fieldLabel: string, fieldValue: string) {
    this._url = url;
    this.fieldLabel = fieldLabel;
    this.fieldValue = fieldValue;
  }

  private parseToArrayMultiselectOptions(items: Array<any>): Array<PoMultiselectOption | any> {
    if (items && items.length > 0) {
      return items.map(item => this.parseToMultiselectOption(item));
    }

    return [];
  }

  private parseToMultiselectOption(item: any): PoMultiselectOption | any {
    const label = item[this.fieldLabel];
    const value = item[this.fieldValue];

    return { [this.fieldLabel]: label, [this.fieldValue]: value };
  }
}

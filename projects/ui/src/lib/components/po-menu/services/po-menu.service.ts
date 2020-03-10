import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PoMenuItemFiltered } from '../po-menu-item/po-menu-item-filtered.interface';
import { PoMenuFilter } from '../po-menu-filter/po-menu-filter.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço que implementa a interface `PoMenuFilter`, utilizado para fazer requisições ao serviço informado pelo usuário,
 * caso for uma URL, no componente `po-menu`.
 */
@Injectable()
export class PoMenuService implements PoMenuFilter {
  private _url: string;

  get url(): string {
    return this._url;
  }

  constructor(private http: HttpClient) {}

  configProperties(url: string) {
    this._url = url;
  }

  getFilteredData(search: string, params?: any): Observable<Array<PoMenuItemFiltered>> {
    const filterParams = {
      search,
      ...params
    };

    return this.http
      .get(this.url, { params: filterParams })
      .pipe(map((response: { items: Array<PoMenuItemFiltered> }) => response && response.items));
  }
}

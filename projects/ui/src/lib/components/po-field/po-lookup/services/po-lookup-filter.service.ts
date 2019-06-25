import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { isTypeof } from '../../../../utils/util';

import { PoLookupFilter } from '../interfaces/po-lookup-filter.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço padrão utilizado para filtrar os dados do componente po-lookup.
 */
@Injectable()
export class PoLookupFilterService implements PoLookupFilter {

  private url: string;

  constructor(private httpClient: HttpClient) {}

  getFilteredData(filter: any, page: number, pageSize?: number, filterParams?: any): Observable<any> {
    const validatedFilterParams = this.validateParams(filterParams);

    return this.httpClient.get(
      this.url,
      { params: { page: page.toString(), pageSize: pageSize.toString(), ...validatedFilterParams, filter } }
    );
  }

  getObjectByValue(value: string, filterParams?: any): Observable<any> {
    const validatedFilterParams = this.validateParams(filterParams);

    return this.httpClient.get(`${this.url}/${value}`, { params: validatedFilterParams });
  }

  setUrl(url: string) {
    this.url = url;
  }

  private validateParams(params: any) {
    return isTypeof(params, 'object') && !Array.isArray(params) ? params : undefined;
  }

}

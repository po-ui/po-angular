import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { isTypeof } from '../../../../utils/util';
import { PoDynamicViewField } from '../po-dynamic-view-field.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço padrão utilizado para filtrar os dados dos campos que utilizam a propriedade `searchService`.
 */
@Injectable()
export class PoDynamicViewService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });
  url: string;

  constructor(private httpClient: HttpClient) {}

  getObjectByValue(value: any, filterParams?: any): Observable<Array<any> | { [key: string]: any }> {
    const validatedFilterParams = this.validateParams(filterParams);

    const encodedValue = encodeURIComponent(value);
    const newURL = `${this.url}/${encodedValue}`;

    return this.httpClient
      .get(newURL, { headers: this.headers, params: validatedFilterParams })
      .pipe(map((response: any) => ('items' in response ? response.items : response)));
  }

  onLoad(url: string, value): Promise<{ value?: any; fields?: Array<PoDynamicViewField> }> {
    return this.httpClient.post(url, value).toPromise();
  }

  setConfig(url: string) {
    this.url = url;
  }

  private validateParams(params: any) {
    return isTypeof(params, 'object') && !Array.isArray(params) ? params : undefined;
  }
}

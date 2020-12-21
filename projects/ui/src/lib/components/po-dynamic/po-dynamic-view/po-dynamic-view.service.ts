import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PoDynamicViewField } from '../po-dynamic-view/po-dynamic-view-field.interface';

@Injectable()
export class PoDynamicViewService {
  constructor(private http: HttpClient) {}

  onLoad(url: string, value): Promise<{ value?: any; fields?: Array<PoDynamicViewField> }> {
    return this.http.post(url, value).toPromise();
  }
}

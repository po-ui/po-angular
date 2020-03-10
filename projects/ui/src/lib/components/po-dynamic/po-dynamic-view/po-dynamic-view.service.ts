import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PoDynamicFormField } from '../po-dynamic-form/po-dynamic-form-field.interface';

@Injectable()
export class PoDynamicViewService {
  constructor(private http: HttpClient) {}

  onLoad(url: string, value): Promise<{ value?: any; fields?: Array<PoDynamicFormField> }> {
    return this.http.post(url, value).toPromise();
  }
}

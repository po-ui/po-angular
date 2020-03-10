import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';

import { PoDynamicFormLoad } from '../po-dynamic-form-load/po-dynamic-form-load.interface';
import { PoDynamicFormValidation } from '../po-dynamic-form-validation/po-dynamic-form-validation.interface';

export class PoDynamicFormOperation {
  constructor(private http: HttpClient) {}

  protected execute(action: Function | string, param: any) {
    return typeof action === 'string' ? this.post(action, param) : of(action(param));
  }

  protected post(url: string, body: PoDynamicFormValidation | any) {
    return this.http.post(url, body);
  }

  protected setFormDefaultIfEmpty(validateFields: any): PoDynamicFormValidation | PoDynamicFormLoad {
    return (
      validateFields || {
        value: {},
        fields: [],
        focus: undefined
      }
    );
  }
}

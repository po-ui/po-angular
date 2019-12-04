import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { mapObjectByProperties } from '../../../../utils/util';

const fieldProperties = [
  'columns',
  'required',
  'options',
  'optionsMulti',
  'optionsService',
  'searchService',
  'mask',
  'pattern',
  'minLength',
  'maxLength',
  'disabled',
  'help',
  'booleanTrue',
  'booleanFalse',
  'maxValue',
  'minValue',
  'rows',
  'secret'
];

@Injectable()
export class PoDynamicFormValidationService {

  constructor(private http: HttpClient) { }

  async validateField(field, value: any) {
    const changedValue = { value: value, field: field.property };

    const validatedField = typeof field.validate === 'string' ?
      await this.validateFieldOnServer(field.validate, changedValue) : field.validate(changedValue);

    return mapObjectByProperties(validatedField.field, fieldProperties, true);
  }

  async validateFields(validate, changedValue) {
    return typeof validate === 'string' ?
      await this.validateFieldOnServer(validate, changedValue) : validate(changedValue);
  }

  private validateFieldOnServer(url: string, changedValue: { value: any; field: string; }) {
    return this.http.post(url, changedValue).toPromise();
  }

}

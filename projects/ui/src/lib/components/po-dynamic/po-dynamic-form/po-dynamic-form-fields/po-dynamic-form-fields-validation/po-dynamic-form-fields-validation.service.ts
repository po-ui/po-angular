import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { mapObjectByProperties } from '../../../../../utils/util';
import { PoDynamicFormField } from '../../po-dynamic-form-field.interface';
import { PoDynamicFormValidation } from './po-dynamic-form-validation.interface';

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

  updateFieldsForm(validatedFields: PoDynamicFormValidation, fields: Array<PoDynamicFormField>) {
    const fieldsCopy = [ ...fields ];
    const validatedFieldsCopy = [ ...validatedFields.fields ];

    validatedFieldsCopy.forEach((validatedField: PoDynamicFormField) => {
      const index = fieldsCopy.findIndex(field => field.property === validatedField.property);
      const hasThisProperty = index >= 0;

      if (hasThisProperty) {
        fieldsCopy[index] = { ...fields[index], ...validatedField };
      } else {
        fieldsCopy.push(validatedField);
      }
    });

    return fieldsCopy;
  }

  async validateForm(validate, changedValue): Promise<PoDynamicFormValidation> {
    return typeof validate === 'string' ?
      await this.validateFieldOnServer(validate, changedValue) : validate(changedValue);
  }

  private validateFieldOnServer(url: string, changedValue: { value: any; field: string; }) {
    return this.http.post(url, changedValue).toPromise();
  }

}

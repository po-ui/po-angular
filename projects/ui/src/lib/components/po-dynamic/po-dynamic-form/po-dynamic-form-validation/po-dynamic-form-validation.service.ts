import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { mapObjectByProperties } from '../../../../utils/util';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
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

  async sendFieldChange(field: PoDynamicFormField, value: any) {
    const changedValue = { property: field.property, value };

    const validatedField = typeof field.validate === 'string' ?
      await this.validateFieldOnServer(field.validate, changedValue) : field.validate(changedValue);

    const newField = mapObjectByProperties(validatedField.field, fieldProperties, true);

    return { ...validatedField, field: newField };
  }

  async sendFormChange(validate: Function | string, field: PoDynamicFormField, value: Array<any>): Promise<PoDynamicFormValidation> {
    const changedValue = { property: field.property, value };

    return typeof validate === 'string' ?
      await this.validateFieldOnServer(validate, changedValue) : validate(changedValue);
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

  private validateFieldOnServer(url: string, changedValue: { value: any; property: string; }) {
    return this.http.post(url, changedValue).toPromise();
  }

}

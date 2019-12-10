import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormValidation } from './po-dynamic-form-validation.interface';

@Injectable()
export class PoDynamicFormValidationService {

  constructor(private http: HttpClient) { }

  sendChanges(validate: Function | string, field: PoDynamicFormField, value: any) {
    const changedValue = { property: field.property, value };

    return typeof validate === 'string' ?
      this.validateFieldOnServer(validate, changedValue) : of(validate(changedValue));
  }

  sendFieldChange(field: PoDynamicFormField, value: any) {
    return this.sendChanges(field.validate, field, value);
  }

  sendFormChange(validate: Function | string, field: PoDynamicFormField, value: Array<any>) {
    return this.sendChanges(validate, field, value);
  }

  updateFieldsForm(validatedFields: Array<PoDynamicFormField> = [], fields: Array<PoDynamicFormField> = []) {
    return [ ...validatedFields ].reduce((updatedFields, validatedField) => {
      const index = updatedFields.findIndex(field => field.property === validatedField.property);
      const hasProperty = index >= 0;

      if (hasProperty) {
        updatedFields[index] = { ...fields[index], ...validatedField };
      } else {
        updatedFields.push(validatedField);
      }

      return updatedFields;
    }, [ ...fields ]);
  }

  private validateFieldOnServer(url: string, changedValue: { value: any; property: string; }) {
    return this.http.post(url, changedValue);
  }

}

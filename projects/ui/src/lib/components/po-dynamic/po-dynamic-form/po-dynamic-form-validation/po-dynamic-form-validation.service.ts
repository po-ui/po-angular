import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormFieldChanged } from './po-dynamic-form-field-changed.interface';
import { PoDynamicFormOperation } from '../po-dynamic-form-operation/po-dynamic-form-operation';
import { PoDynamicFormValidation } from './po-dynamic-form-validation.interface';

@Injectable()
export class PoDynamicFormValidationService extends PoDynamicFormOperation {
  constructor(http: HttpClient) {
    super(http);
  }

  sendFieldChange(field: PoDynamicFormField, value: any) {
    const changedValue: PoDynamicFormFieldChanged = { property: field.property, value };

    return this.execute(field.validate, changedValue).pipe(
      map(validateFields => this.setFieldDefaultIfEmpty(validateFields))
    );
  }

  sendFormChange(
    validate: Function | string,
    field: PoDynamicFormField,
    value: any
  ): Observable<PoDynamicFormValidation> {
    const changedValue: PoDynamicFormFieldChanged = { property: field.property, value };

    return this.execute(validate, changedValue).pipe(map(validateFields => this.setFormDefaultIfEmpty(validateFields)));
  }

  updateFieldsForm(validatedFields: Array<PoDynamicFormField> = [], fields: Array<PoDynamicFormField> = []) {
    return [...validatedFields].reduce(
      (updatedFields, validatedField) => {
        const index = updatedFields.findIndex(field => field.property === validatedField.property);
        const hasProperty = index >= 0;

        if (hasProperty) {
          updatedFields[index] = { ...fields[index], ...validatedField };
        }

        return updatedFields;
      },
      [...fields]
    );
  }

  private setFieldDefaultIfEmpty(validateFields: any): any {
    return (
      validateFields || {
        field: {}
      }
    );
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapObjectByProperties } from '../../../../utils/util';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormValidation } from './po-dynamic-form-validation.interface';

const fieldProperties = [
  'key',
  'label',
  'gridColumns',
  'gridSmColumns',
  'gridMdColumns',
  'gridLgColumns',
  'gridXlColumns',
  'visible',
  'divider',
  'type',
  'property',
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

    sendChanges(validate: Function | string, field: PoDynamicFormField, value: any) {
    const changedValue = { property: field.property, value };

    return typeof validate === 'string' ?
      this.validateFieldOnServer(validate, changedValue) : of(validate(changedValue));
  }

  sendFieldChange(field: PoDynamicFormField, value: any) {
    return this.sendChanges(field.validate, field, value).pipe(map(this.removeInvalidProperties()));
  }

  sendFormChange(validate: Function | string, field: PoDynamicFormField, value: Array<any>) {
    return this.sendChanges(validate, field, value).pipe(
      map(validatedFields => {
        const newFields = validatedFields.fields
           .map(validatedField => mapObjectByProperties(validatedField, fieldProperties, true));
        validatedFields.fields = newFields;

        return validatedFields;
      })
    );
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

  private removeInvalidProperties(): (value: any, index: number) => any {
    return validatedField => {
      const newField = mapObjectByProperties(validatedField.field, fieldProperties, true);
      return { ...validatedField, field: newField };
    };
  }

  private validateFieldOnServer(url: string, changedValue: { value: any; property: string; }) {
    return this.http.post(url, changedValue);
  }

}

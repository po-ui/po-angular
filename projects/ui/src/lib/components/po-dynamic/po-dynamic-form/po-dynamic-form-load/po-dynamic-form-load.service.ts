import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormOperation } from '../po-dynamic-form-operation/po-dynamic-form-operation';

@Injectable()
export class PoDynamicFormLoadService extends PoDynamicFormOperation {
  constructor(http: HttpClient) {
    super(http);
  }

  createAndUpdateFieldsForm(loadedFields: Array<PoDynamicFormField> = [], fields: Array<PoDynamicFormField> = []) {
    return [...loadedFields].reduce(
      (updatedFields, field) => {
        const index = updatedFields.findIndex(updatedField => updatedField.property === field.property);
        const hasProperty = index >= 0;

        if (hasProperty) {
          updatedFields[index] = { ...fields[index], ...field };
        } else {
          updatedFields.push(field);
        }

        return updatedFields;
      },
      [...fields]
    );
  }

  executeLoad(load: Function | string, value: any) {
    return this.execute(load, value).pipe(map(loadedFormdData => this.setFormDefaultIfEmpty(loadedFormdData)));
  }
}

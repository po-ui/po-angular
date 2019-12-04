import { Component, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';

import { mapObjectByProperties } from '../../../../utils/util';

import { PoDynamicFieldValidation } from './po-dynamic-form-field-validation.interface';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';

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

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente de criação dos campos dinâmicos.
 */
@Component({
  selector: 'po-dynamic-form-fields',
  templateUrl: 'po-dynamic-form-fields.component.html',
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ]
})
export class PoDynamicFormFieldsComponent extends PoDynamicFormFieldsBaseComponent implements OnChanges {

  @ViewChildren('component') component: QueryList<{ focus: () => void }>;

  constructor(titleCasePipe: TitleCasePipe, private http: HttpClient) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  onChangeFieldValue(index) {
    this.validateField(index);
    this.validateFields(index);
  }

  async validateFields(index: number) {
    const changeValue = {
      field: this.fields[index].property,
      value: this.value,
    };

    if (typeof this.validate === 'string') {
      this.http.post(this.validate, changeValue).subscribe((response: any) => {
        this.applyValidateFields(response);
      });
    } else {
      const validatedFields = this.validate(changeValue);
      this.applyValidateFields(validatedFields);
    }

  }

  private applyValidateFields(validatedFields: any) {
    this.value = { ...this.value, ...validatedFields.value };

    validatedFields.fields.forEach(validatedField => {
      const index = this.fields.findIndex(field => field.property === validatedField.property);

      if (index >= 0) {
        this.fields[index] = { ...this.fields[index], ...validatedField };
        this.fields = [...this.fields];
      }

    });
  }

  async validateField(index: number) {
    const field = this.fields[index];
    const changedValue = { value: this.value[field.property], field: field.property };

    const previousDisabled = field.disabled;
    this.visibleFields[index].disabled = true;

    try {
      const fieldValidation: PoDynamicFieldValidation = typeof field.validate === 'string' ?
        await this.validateFieldOnServer(field.validate, changedValue) : field.validate(changedValue);

      this.applyValidationField(index, fieldValidation);

    } catch {
      this.visibleFields[index].disabled = previousDisabled;
    }
  }

  private applyValidationField(index: number, validatedField: PoDynamicFieldValidation) {
    const validatedFieldClean = mapObjectByProperties(validatedField.field, fieldProperties, true);

    this.fields[index] = { ...this.fields[index], ...validatedFieldClean };
    this.fields = [...this.fields];
    this.value[this.fields[index].property] = validatedField.value;

    if (validatedField.focus) {
      this.component.toArray()[index].focus();
    }

  }

  private validateFieldOnServer(url: string, changedValue: { value: any; field: string; }) {
    return this.http.post(url, changedValue).toPromise();
  }

  trackBy(index) {
    return index;
  }

}

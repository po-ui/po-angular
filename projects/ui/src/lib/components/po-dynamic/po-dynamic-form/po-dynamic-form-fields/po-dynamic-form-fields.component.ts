import { Component, SimpleChanges, OnChanges, ViewChildren, Query, QueryList } from '@angular/core';

import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { TitleCasePipe } from '@angular/common';
import { ControlContainer, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { isTypeof, mapObjectByProperties } from '../../../../utils/util';
import { PoDynamicFieldValidation } from './po-dynamic-form-field-validation.interface';

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

  async onChangeFieldValue(field: PoDynamicFormField, index: number) {
    const changedValue = { value: this.value[field.property], field: field.property };

    const previousDisabled = field.disabled;
    field.disabled = true;

    try {
      const fieldValidation: PoDynamicFieldValidation = typeof field.onChange === 'string' ?
        await this.validateFieldOnServer(field.onChange, changedValue) : field.onChange(changedValue);

      field.disabled = fieldValidation.field.hasOwnProperty('disabled') ?
      fieldValidation.field.disabled : previousDisabled;

      this.applyValidationField(index, field, fieldValidation);
    } catch {
      field.disabled = previousDisabled;
    }
  }

  private validateFieldOnServer(url: string, changedValue: { value: any; field: string; }) {
    return this.http.post(url, changedValue).toPromise();
  }

  private applyValidationField(index: number, field: PoDynamicFormField, fieldValidation: PoDynamicFieldValidation) {
    const fieldValidationClean = mapObjectByProperties(fieldValidation.field, fieldProperties, true);

    this.fields[index] = { ...field, ...fieldValidationClean };
    this.value[field.property] = fieldValidation.value;
    this.visibleFields = this.getVisibleFields();

    if (fieldValidation.focus) {
      this.component.toArray()[index].focus();
    }

  }

  trackBy(index) {
    return index;
  }

}

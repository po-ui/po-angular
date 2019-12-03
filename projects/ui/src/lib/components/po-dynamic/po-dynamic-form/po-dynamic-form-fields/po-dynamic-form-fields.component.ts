import { Component, SimpleChanges, OnChanges, ViewChildren, Query, QueryList } from '@angular/core';

import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { TitleCasePipe } from '@angular/common';
import { ControlContainer, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { isTypeof, mapObjectByProperties } from '../../../../utils/util';
import { PoDynamicFieldValidation } from './po-dynamic-form-field-validation.interface';
import { loading } from './test';

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

  onChangeFieldValue(field: PoDynamicFormField, index: number) {
    const param = { value: this.value[field.property], field: field.property };

    // buscar servidor
    if (isTypeof(field.onChange, 'string')) {
      this.validateFieldOnServer(field, param, index);
    } else {
      // buscar da funcao do usuário
      // field.onChange.emit(param);
    }

  }

  private validateFieldOnServer(field: PoDynamicFormField, param: { value: any; field: string; }, index: number) {
    const beforeFieldDisabledValue = field.disabled;
    field.disabled = true;

    this.http.post(field.onChange, param).subscribe((fieldValidation: PoDynamicFieldValidation) => {

      field.disabled = fieldValidation.field.hasOwnProperty('disabled') ?
        fieldValidation.field.disabled : beforeFieldDisabledValue;

      this.applyValidationField(index, field, fieldValidation);

    }, () => {
      field.disabled = beforeFieldDisabledValue;
    });

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

import { Component, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { PoDynamicFieldValidation } from './po-dynamic-form-fields-validation/po-dynamic-form-field-validation.interface';
import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { PoDynamicFormValidationService } from './po-dynamic-form-fields-validation/po-dynamic-form-fields-validation.service';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';

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
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
  providers: [ PoDynamicFormValidationService ]
})
export class PoDynamicFormFieldsComponent extends PoDynamicFormFieldsBaseComponent implements OnChanges {

  isDisableAllForm: boolean;

  @ViewChildren('component') component: QueryList<{ focus: () => void }>;

  constructor(titleCasePipe: TitleCasePipe, private validationService: PoDynamicFormValidationService) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  isDisabled(field: PoDynamicFormField): boolean {
    return field.disabled || this.isDisableAllForm;
  }

  onChangeFieldValue(index: number) {
    this.validateField(index)
      .then(() => this.validateForm(index));
  }

  async validateForm(index: number) {
    const changeValue = {
      field: this.fields[index].property,
      value: this.value,
    };

    this.isDisableAllForm = true;

    try {
      const validatedFields = await this.validationService.validateForm(this.validate, changeValue);
      this.applyValidateForm(validatedFields);
      this.isDisableAllForm = false;
    } catch {
      this.isDisableAllForm = false;
    }
  }

  private applyValidateForm(validatedFields: any) {
    this.value = { ...this.value, ...validatedFields.value };
    this.fields = this.validationService.updateFieldsForm(validatedFields, this.fields);
  }

  async validateField(index: number) {
    const field = this.fields[index];
    const value = this.value[this.fields[index].property];

    const previousDisabled = field.disabled;
    this.visibleFields[index].disabled = true;

    try {
      const validatedField = await this.validationService.validateField(field, value);
      this.applyValidationField(index, validatedField);

    } catch {
      this.visibleFields[index].disabled = previousDisabled;
    }
  }

  private applyValidationField(index: number, validatedField: PoDynamicFieldValidation) {
    this.fields[index] = { ...this.fields[index], ...validatedField };
    this.fields = [...this.fields];
    this.value[this.fields[index].property] = validatedField.value;

    if (validatedField.focus) {
      this.component.toArray()[index].focus();
    }

  }

  trackBy(index) {
    return index;
  }

}

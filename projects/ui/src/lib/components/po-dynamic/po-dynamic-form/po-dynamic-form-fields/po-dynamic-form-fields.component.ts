import { Component, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { PoDynamicFieldValidation } from './po-dynamic-form-field-validation.interface';
import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { PoDynamicFormValidationService } from './po-dynamic-form-fields-validation.service';

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

  @ViewChildren('component') component: QueryList<{ focus: () => void }>;

  constructor(titleCasePipe: TitleCasePipe, private validationService: PoDynamicFormValidationService) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  onChangeFieldValue(index: number) {
    this.validateField(index);
    this.validateFields(index);
  }

  async validateFields(index: number) {
    const changeValue = {
      field: this.fields[index].property,
      value: this.value,
    };

    const validatedFields = await this.validationService.validateFields(this.validate, changeValue);

    // TO DO: disabled form
    this.applyValidateFields(validatedFields);
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

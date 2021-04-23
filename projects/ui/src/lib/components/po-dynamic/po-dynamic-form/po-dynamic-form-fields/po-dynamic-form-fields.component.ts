import { Component, ChangeDetectorRef, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
import { PoDynamicFormFieldValidation } from '../po-dynamic-form-validation/po-dynamic-form-field-validation.interface';
import { PoDynamicFormValidationService } from '../po-dynamic-form-validation/po-dynamic-form-validation.service';

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
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  providers: [PoDynamicFormValidationService]
})
export class PoDynamicFormFieldsComponent extends PoDynamicFormFieldsBaseComponent implements OnChanges {
  @ViewChildren('component') components: QueryList<{ name: string; focus: () => void }>;

  private previousValue = {};

  constructor(
    titleCasePipe: TitleCasePipe,
    private validationService: PoDynamicFormValidationService,
    private changes: ChangeDetectorRef,
    private form: NgForm
  ) {
    super(titleCasePipe);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fields) {
      this.visibleFields = this.getVisibleFields();
    }
  }

  focus(property: string) {
    const foundComponent = this.components.find(component => component.name === property);
    if (foundComponent) {
      foundComponent.focus();
    }
  }

  isDisabled(field: PoDynamicFormField): boolean {
    return field.disabled || this.disabledForm;
  }

  async onChangeField(visibleField: PoDynamicFormField, objectValue?: any) {
    const { property } = visibleField;
    const isChangedValueField = this.previousValue[property] !== this.value[property];

    if (visibleField.optionsService) {
      this.objectValue.emit(objectValue);
    }

    // verifica se o formulario esta touched para não disparar o validate ao carregar a tela.
    if (this.form.touched && isChangedValueField) {
      const { changedField, changedFieldIndex } = this.getField(property);

      if (changedField.validate) {
        await this.validateField(changedField, changedFieldIndex, visibleField);
      }

      this.triggerValidationOnForm(changedFieldIndex);
    }

    this.updatePreviousValue();
  }

  updatePreviousValue() {
    this.previousValue = JSON.parse(JSON.stringify(this.value));
  }

  trackBy(index) {
    return index;
  }

  private applyFieldValidation(index: number, validatedField: PoDynamicFormFieldValidation) {
    const field = this.fields[index];

    this.fields[index] = { ...field, ...validatedField.field };
    this.updateFields();

    if (validatedField.hasOwnProperty('value')) {
      this.value[field.property] = validatedField.value;
    }

    this.changes.detectChanges();

    if (validatedField.focus) {
      this.focus(field.property);
    }
  }

  private getField(property: string) {
    const changedFieldIndex = this.fields.findIndex(field => field.property === property);
    const changedField = this.fields[changedFieldIndex];

    return { changedField, changedFieldIndex };
  }

  private triggerValidationOnForm(changedFieldIndex: number) {
    const isValidatableField = this.validateFields?.length
      ? this.validateFieldsChecker(this.validateFields, this.fields[changedFieldIndex].property)
      : true;
    const hasValidationForm = this.validate && isValidatableField && this.formValidate.observers.length;

    if (hasValidationForm) {
      const updatedField = this.fields[changedFieldIndex];
      this.formValidate.emit(updatedField);
    }
  }

  private updateFields() {
    this.fieldsChange.emit(this.fields);
    this.visibleFields = this.getVisibleFields();
  }

  private validateFieldsChecker(validateFields: Array<string>, propertyField: PoDynamicFormField['property']): boolean {
    return validateFields.some(validateFieldItem => validateFieldItem === propertyField);
  }

  private async validateField(field: PoDynamicFormField, fieldIndex: number, visibleField: PoDynamicFormField) {
    const value = this.value[field.property];

    const previousDisabled = visibleField.disabled;
    visibleField.disabled = true;
    this.changes.detectChanges();

    try {
      const validatedField = await this.validationService.sendFieldChange(field, value).toPromise();
      this.applyFieldValidation(fieldIndex, validatedField);
    } catch {
      visibleField.disabled = previousDisabled;
    }
  }
}

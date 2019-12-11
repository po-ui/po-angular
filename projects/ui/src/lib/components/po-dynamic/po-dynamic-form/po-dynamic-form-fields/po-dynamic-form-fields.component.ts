import { Component, OnChanges, QueryList, SimpleChanges, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

import { PoDynamicFormFieldValidation } from '../po-dynamic-form-validation/po-dynamic-form-field-validation.interface';
import { PoDynamicFormField } from '../po-dynamic-form-field.interface';
import { PoDynamicFormFieldsBaseComponent } from './po-dynamic-form-fields-base.component';
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
  viewProviders: [ { provide: ControlContainer, useExisting: NgForm } ],
  providers: [ PoDynamicFormValidationService ]
})
export class PoDynamicFormFieldsComponent extends PoDynamicFormFieldsBaseComponent implements OnChanges {

  @ViewChildren('component') components: QueryList<{ name: string, focus: () => void }>;

  constructor(titleCasePipe: TitleCasePipe, private validationService: PoDynamicFormValidationService, private changes: ChangeDetectorRef) {
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

  async onChangeField(property: string) {
    const changedFieldIndex = this.fields.findIndex(field => field.property === property);
    const changedField = this.fields[changedFieldIndex];

    if (changedField.validate) {
      await this.validateField(changedField, changedFieldIndex);
    }

    const hasValidationForm = this.validate && this.formValidate.observers.length;

    if (hasValidationForm) {
      this.formValidate.emit({ field: changedField, fieldIndex:  changedFieldIndex});
    }
  }

  trackBy(index) {
    return index;
  }

  private applyFieldValidation(index: number, validatedField: PoDynamicFormFieldValidation) {
    const field = this.fields[index];

    this.fields[index] = { ...field, ...validatedField.field };
    this.fields = [...this.fields];

    this.value[field.property] = validatedField.value;

    this.changes.detectChanges();

    if (validatedField.focus) {
      this.focus(field.property);
    }

  }

  private async validateField(field: PoDynamicFormField, fieldIndex: number) {
    const value = this.value[field.property];

    const previousDisabled = field.disabled;
    this.visibleFields[fieldIndex].disabled = true;
    this.changes.detectChanges();

    try {
      const validatedField = await this.validationService.sendFieldChange(field, value).toPromise();
      this.applyFieldValidation(fieldIndex, validatedField);

    } catch {
      this.visibleFields[fieldIndex].disabled = previousDisabled;
    }
  }

}

import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';
import { PoDynamicFormValidationService } from './po-dynamic-form-validation/po-dynamic-form-validation.service';
import { PoDynamicFormValidation } from './po-dynamic-form-validation/po-dynamic-form-validation.interface';

/**
 * @docsExtends PoDynamicFormBaseComponent
 *
 * @example
 *
 * <example name="po-dynamic-form-basic" title="Portinari Dynamic Form Basic">
 *  <file name="sample-po-dynamic-form-basic/sample-po-dynamic-form-basic.component.html"> </file>
 *  <file name="sample-po-dynamic-form-basic/sample-po-dynamic-form-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dynamic-form-register" title="Portinari Dynamic Form - Register">
 *  <file name="sample-po-dynamic-form-register/sample-po-dynamic-form-register.component.html"> </file>
 *  <file name="sample-po-dynamic-form-register/sample-po-dynamic-form-register.component.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-dynamic-form',
  templateUrl: './po-dynamic-form.component.html',
  providers: [ PoDynamicFormValidationService ]
})
export class PoDynamicFormComponent extends PoDynamicFormBaseComponent {

  isDisableForm: boolean;

  private _form: NgForm;

  @ViewChild('dynamicForm', { static: false }) set form(value: NgForm) {
    // necessario para nao ocorrer o ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this._form = value;

      this.emitForm();
    });
  }

  get form() {
    return this._form || <any> {};
  }

  @ViewChild('fieldsComponent', { static: false }) fieldsComponent: {focus: (property: string) => void };

  constructor(private changes: ChangeDetectorRef, private validationService: PoDynamicFormValidationService) {
    super();
  }
  /**
   * Função que atribui foco ao campo desejado.
   *
   * Para utilizá-la é necessário capturar a instância do `dynamic form`, como por exemplo:
   *
   * ``` html
   * <po-dynamic-form #dynamicForm [p-fields]="fields"></po-dynamic-form>
   * ```
   *
   * ``` javascript
   * import { PoDynamicFormComponent, PoDynamicFormField } from '@portinari/portinari-ui';
   *
   * ...
   *
   * @ViewChild('dynamicForm', { static: true }) dynamicForm: PoDynamicFormComponent;
   *
   * fields: Array<PoDynamicFormField> = [
   *   { property: 'fieldOne' },
   *   { property: 'fieldTwo' }
   * ];
   *
   * fieldFocus() {
   *   this.dynamicForm.focus('fieldTwo');
   * }
   * ```
   *
   * @param {string} property Nome da propriedade atribuída ao `PoDynamicFormField.property`.
   */
  focus(property: string) {
    this.fieldsComponent.focus(property);
  }

  async validateForm({ field, index: fieldIndex }) {
    this.fields[fieldIndex] = field;
    const previousFocusElement = document.activeElement;
    this.isDisableForm = true;

    try {
      const validatedFields = await this.validationService.sendFormChange(this.validate, field, this.value);
      this.applyFormValidation(validatedFields);

      this.isDisableForm = false;
      this.changes.detectChanges();

      this.setFocusOnValidation(validatedFields, previousFocusElement);
    } catch {
      this.isDisableForm = false;
    }
  }

  private applyFormValidation(validatedFields: any) {
    this.value = { ...this.value, ...validatedFields.value };
    this.fields = this.validationService.updateFieldsForm(validatedFields, this.fields);
  }

  private emitForm() {
    if (!this.groupForm && this.formOutput.observers.length) {
      this.formOutput.emit(this.form);
    }
  }

  private setFocusOnValidation(validatedFields: PoDynamicFormValidation, previousFocusElement: Element) {
    if (validatedFields.focus) {
      this.focus(validatedFields.focus);
    } else {
      previousFocusElement['focus']();
    }
  }

}

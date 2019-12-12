import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';
import { PoDynamicFormField } from './po-dynamic-form-field.interface';
import { PoDynamicFormValidation } from './po-dynamic-form-validation/po-dynamic-form-validation.interface';
import { PoDynamicFormValidationService } from './po-dynamic-form-validation/po-dynamic-form-validation.service';

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

  disabledForm: boolean;

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

  async validateForm(field: PoDynamicFormField) {
    const previousFocusElement = document.activeElement;

    this.disableForm(true);
    const errorOnValidation = () => this.disableForm(false);

    this.validationService.sendFormChange(this.validate, field, this.value)
      .subscribe(this.applyFormValidation(previousFocusElement), errorOnValidation);
  }

  private applyFormValidation(previousFocusElement: Element): (value: any) => void {
    return validatedFields => {
      this.updateModelWithValidation(validatedFields);
      this.disableForm(false);
      this.setFocusOnValidation(validatedFields, previousFocusElement);
    };
  }

  private updateModelWithValidation(validatedFields: PoDynamicFormValidation = {}) {
    Object.assign(this.value, validatedFields.value);
    this.fields = this.validationService.updateFieldsForm(validatedFields.fields, this.fields);
  }

  private emitForm() {
    if (!this.groupForm && this.formOutput.observers.length) {
      this.formOutput.emit(this.form);
    }
  }

  private disableForm(value: boolean) {
    this.disabledForm = value;
    this.changes.detectChanges();
  }

  private setFocusOnValidation(validatedFields: PoDynamicFormValidation = {}, previousFocusElement: Element) {
    if (validatedFields.focus) {
      // precisa do timeout para que o valor seja atribuido no campo antes de setar o focus,
      // para nao disparar a mudança posteriormente. Situação ocorre quando retornar campo com valor e focus atribuido a ele.
      setTimeout(() => this.focus(validatedFields.focus));
    } else {
      previousFocusElement['focus']();
    }
  }

}

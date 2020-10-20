import { Component, ChangeDetectorRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable, Subject, Subscription } from 'rxjs';

import { PoDynamicFormBaseComponent } from './po-dynamic-form-base.component';
import { PoDynamicFormField } from './po-dynamic-form-field.interface';
import { PoDynamicFormLoad } from './po-dynamic-form-load/po-dynamic-form-load.interface';
import { PoDynamicFormLoadService } from './po-dynamic-form-load/po-dynamic-form-load.service';
import { PoDynamicFormValidation } from './po-dynamic-form-validation/po-dynamic-form-validation.interface';
import { PoDynamicFormValidationService } from './po-dynamic-form-validation/po-dynamic-form-validation.service';

/**
 * @docsExtends PoDynamicFormBaseComponent
 *
 * @example
 *
 * <example name="po-dynamic-form-basic" title="PO Dynamic Form Basic">
 *  <file name="sample-po-dynamic-form-basic/sample-po-dynamic-form-basic.component.html"> </file>
 *  <file name="sample-po-dynamic-form-basic/sample-po-dynamic-form-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dynamic-form-register" title="PO Dynamic Form - Register">
 *  <file name="sample-po-dynamic-form-register/sample-po-dynamic-form-register.component.html"> </file>
 *  <file name="sample-po-dynamic-form-register/sample-po-dynamic-form-register.component.ts"> </file>
 *  <file name="sample-po-dynamic-form-register/sample-po-dynamic-form-register.service.ts"> </file>
 * </example>
 */

@Component({
  selector: 'po-dynamic-form',
  templateUrl: './po-dynamic-form.component.html'
})
export class PoDynamicFormComponent extends PoDynamicFormBaseComponent implements OnInit, OnDestroy {
  private _form: NgForm;

  disabledForm: boolean;

  private onLoadSubscription: Subscription;
  private sendFormSubscription: Subscription;
  private comboOptionSubject = new Subject<any>();

  @ViewChild('dynamicForm') set form(value: NgForm) {
    // necessario para nao ocorrer o ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this._form = value;

      this.emitForm();
    });
  }

  get form() {
    return this._form || <any>{};
  }

  @ViewChild('fieldsComponent') fieldsComponent: { focus: (property: string) => void; updatePreviousValue: () => void };

  constructor(
    private changes: ChangeDetectorRef,
    private loadService: PoDynamicFormLoadService,
    private validationService: PoDynamicFormValidationService
  ) {
    super();
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  ngOnInit() {
    if (this.load) {
      this.loadDataOnInitialize();
    }
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
   * import { PoDynamicFormComponent, PoDynamicFormField } from '@po-ui/ng-components';
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

  getObjectValue(): Observable<any> {
    return this.comboOptionSubject.asObservable();
  }

  sendObjectValue(objectValue: any) {
    this.comboOptionSubject.next(objectValue);
  }

  validateForm(field: PoDynamicFormField) {
    const previousFocusElement = document.activeElement;

    this.disableForm(true);
    const errorOnValidation = () => this.disableForm(false);

    this.sendFormSubscription = this.validationService
      .sendFormChange(this.validate, field, this.value)
      .subscribe(this.applyFormValidation(previousFocusElement), errorOnValidation);
  }

  private applyFormUpdatesOnLoad(previousFocusElement: Element): (dynamicFormData: PoDynamicFormLoad) => void {
    return dynamicFormData => {
      this.updateModelOnLoad(dynamicFormData);
      this.disableForm(false);
      this.setFocusOnFieldByProperty(dynamicFormData.focus, previousFocusElement);
    };
  }

  private applyFormValidation(previousFocusElement: Element): (dynamicFormData: PoDynamicFormValidation) => void {
    return dynamicFormData => {
      this.updateModelWithValidation(dynamicFormData);
      this.disableForm(false);
      this.setFocusOnFieldByProperty(dynamicFormData.focus, previousFocusElement);
    };
  }

  private disableForm(value: boolean) {
    this.disabledForm = value;
    this.changes.detectChanges();
  }

  private emitForm() {
    if (!this.groupForm && this.formOutput.observers.length) {
      this.formOutput.emit(this.form);
    }
  }

  private loadDataOnInitialize() {
    const previousFocusElement = document.activeElement;

    this.disabledForm = true;
    const errorOnLoad = () => (this.disabledForm = false);

    this.onLoadSubscription = this.loadService
      .executeLoad(this.load, this.value)
      .subscribe(this.applyFormUpdatesOnLoad(previousFocusElement), errorOnLoad);
  }

  private removeListeners() {
    if (this.onLoadSubscription) {
      this.onLoadSubscription.unsubscribe();
    }

    if (this.sendFormSubscription) {
      this.sendFormSubscription.unsubscribe();
    }
  }

  private setFocusOnFieldByProperty(property: string, previousFocusElement: Element) {
    if (property) {
      // precisa do timeout para que o valor seja atribuido no campo antes de setar o focus,
      // para nao disparar a mudança posteriormente. Situação ocorre quando retornar campo com valor e focus atribuido a ele.
      setTimeout(() => this.focus(property));
    } else {
      previousFocusElement['focus']();
    }
  }

  private updateModelOnLoad(loadedFormData: PoDynamicFormLoad) {
    Object.assign(this.value, loadedFormData.value);
    this.fields = this.loadService.createAndUpdateFieldsForm(loadedFormData.fields, this.fields);
  }

  private updateModelWithValidation(formData: PoDynamicFormValidation) {
    Object.assign(this.value, formData.value);
    this.fieldsComponent.updatePreviousValue();
    this.fields = this.validationService.updateFieldsForm(formData.fields, this.fields);
  }
}

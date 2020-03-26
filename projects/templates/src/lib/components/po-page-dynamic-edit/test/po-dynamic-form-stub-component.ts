import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PoDynamicFormComponent } from '@po-ui/ng-components';

@Component({
  selector: 'po-dynamic-form',
  template: '',
  providers: [
    {
      provide: PoDynamicFormComponent,
      useClass: PoDynamicFormStubComponent
    }
  ]
})
export class PoDynamicFormStubComponent {
  private _form: NgForm;

  get form(): NgForm {
    return this._form;
  }

  set form(form: NgForm) {
    this._form = form;
  }
}

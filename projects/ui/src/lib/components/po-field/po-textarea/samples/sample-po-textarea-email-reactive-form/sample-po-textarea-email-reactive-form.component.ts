import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PoModalAction, PoModalComponent } from '@portinari/portinari-ui';
import { PoPageAction } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-textarea-email-reactive-form',
  templateUrl: './sample-po-textarea-email-reactive-form.component.html'
})
export class SamplePoTextareaEmailReactiveFormComponent implements OnInit {
  formEmail: FormGroup;
  pageActions: Array<PoPageAction>;
  primaryAction: PoModalAction = {
    action: () => {
      this.poModal.close();
      this.reset();
    },
    label: 'Ok'
  };

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.formEmail = this.formBuilder.group({
      cc: null,
      from: [null, Validators.required],
      to: [null, Validators.required],
      emailText: [null, Validators.required],
      subject: [null, Validators.required]
    });
  }

  getPageAction() {
    const isDisabled = this.formEmail ? !this.formEmail.valid : true;
    return [
      { label: 'Send', action: this.send, disabled: isDisabled },
      { label: 'Clean', action: this.reset }
    ];
  }

  reset() {
    this.formEmail.reset();
  }

  send() {
    this.poModal.open();
  }
}

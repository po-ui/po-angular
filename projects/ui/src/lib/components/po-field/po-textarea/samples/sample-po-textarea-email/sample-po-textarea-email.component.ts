import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PoModalAction, PoModalComponent } from '@portinari/portinari-ui';
import { PoPageAction } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-textarea-email',
  templateUrl: './sample-po-textarea-email.component.html'
})
export class SamplePoTextareaEmailComponent {
  cc: string = '';
  emailText: string = '';
  from: string = '';
  subject: string = '';
  to: string = '';

  pageActions: Array<PoPageAction>;
  primaryAction: PoModalAction = {
    action: () => {
      this.poModal.close();
      this.reset();
    },
    label: 'Ok'
  };

  @ViewChild('formEmail', { static: true }) formEmail: FormControl;
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  getPageAction() {
    const isDisabled = this.formEmail ? !this.formEmail['valid'] : true;
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

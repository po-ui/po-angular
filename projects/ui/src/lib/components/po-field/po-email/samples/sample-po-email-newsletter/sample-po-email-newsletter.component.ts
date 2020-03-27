import { Component } from '@angular/core';

import { PoDialogService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-email-newsletter',
  templateUrl: './sample-po-email-newsletter.component.html'
})
export class SamplePoEmailNewsletterComponent {
  email: string = '';

  constructor(private poAlert: PoDialogService) {}

  openDialog() {
    this.poAlert.alert({
      title: 'Sent with success!',
      message: `Ready Mr(s). ${this.getNameEmail()}, now you will get all the news from PO!`
    });
  }

  private getNameEmail() {
    const index = this.email.indexOf('@');

    return this.email.substr(0, index).toLocaleUpperCase();
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-avatar-business-card',
  styles: [
    `
      .sample-center-image {
        display: block;
        margin: 0 auto;
      }
    `
  ],
  templateUrl: './sample-po-avatar-business-card.component.html'
})
export class SamplePoAvatarBusinessCardComponent {
  avatar = 'http://lorempixel.com/300/300/cats/';

  contact = {
    name: 'Mr. Dev PO',
    email: 'dev.po@po-ui.com',
    phone: '47912012015'
  };

  callContact(phone) {
    window.open(`tel:${phone}`, '_self');
  }

  sendContact(email) {
    window.open(`mailto:${email}`, '_self');
  }

  formatPhoneNumber(phone) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  }
}

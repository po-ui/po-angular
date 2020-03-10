import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-avatar-business-card',
  templateUrl: './sample-po-avatar-business-card.component.html'
})
export class SamplePoAvatarBusinessCardComponent {
  contact = {
    name: 'Mr. Dev Portinari',
    email: 'dev.portinari@portinari.com',
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

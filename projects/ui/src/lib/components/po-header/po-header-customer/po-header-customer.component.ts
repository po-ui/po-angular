import { Component, Input } from '@angular/core';
import { PoHeaderUser } from '../interfaces/po-header-user.interface';

@Component({
  selector: 'po-header-customer',
  templateUrl: './po-header-customer.component.html',
  standalone: false
})
export class PoHeaderCustomerComponent {
  @Input('p-header-user') headerUser: PoHeaderUser;

  onClickUserSection() {
    this.headerUser.action?.();
  }
}

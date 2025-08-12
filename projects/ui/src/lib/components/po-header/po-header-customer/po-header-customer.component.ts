import { Component, Input, ViewChild } from '@angular/core';
import { PoHeaderUser } from '../interfaces/po-header-user.interface';
import { PoPopupComponent } from '../../po-popup';
import { PoPopoverComponent } from '../../po-popover';

@Component({
  selector: 'po-header-customer',
  templateUrl: './po-header-customer.component.html',
  standalone: false
})
export class PoHeaderCustomerComponent {
  @ViewChild('poPopupAction') poPopupAction: PoPopupComponent;
  @ViewChild('poPopoverAction') poPopoverAction: PoPopoverComponent;

  @Input('p-header-user') headerUser: PoHeaderUser;

  onClickPopup() {
    if (this.headerUser.items && !this.headerUser.popover) {
      this.poPopupAction.toggle();
    }
  }

  onClickUserSection() {
    this.headerUser.action?.();
  }

  onClickClosePopover() {
    this.poPopoverAction.close();
  }

  onKeyDownCustomer(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
      this.headerUser.action?.();
      this.poPopupAction.toggle();
    }
  }
}

import { Component, Input, ViewChild } from '@angular/core';
import { PoPopoverComponent } from '../../po-popover';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderUser } from '../interfaces/po-header-user.interface';

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
      if (!this.headerUser.popover) {
        this.poPopupAction.toggle();
      } else if (this.poPopoverAction.isHidden) {
        this.poPopoverAction.open();
      } else {
        this.poPopoverAction.close();
      }
    }
  }
}

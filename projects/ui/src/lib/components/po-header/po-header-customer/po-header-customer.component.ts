import { Component, Input, ViewChild } from '@angular/core';
import { PoPopoverComponent } from '../../po-popover';
import { PoPopupComponent } from '../../po-popup';
import { PoHeaderUser } from '../interfaces/po-header-user.interface';
import { PoLanguageService, poLocaleDefault } from '../../../services';

export const poHeaderCustomerLiteralsDefault = {
  en: {
    labelUser: 'Open user Navigation'
  },
  es: {
    labelUser: 'Abrir navegación de usuario'
  },
  pt: {
    labelUser: 'Abrir navegação do usuário'
  },
  ru: {
    labelUser: 'Открыть навигацию пользователя'
  }
};
@Component({
  selector: 'po-header-customer',
  templateUrl: './po-header-customer.component.html',
  standalone: false
})
export class PoHeaderCustomerComponent {
  literals;
  @ViewChild('poPopupAction') poPopupAction: PoPopupComponent;
  @ViewChild('poPopoverAction') poPopoverAction: PoPopoverComponent;

  @Input('p-header-user') headerUser: PoHeaderUser;

  constructor(languageService: PoLanguageService) {
    const language = languageService.getShortLanguage();
    this.literals = {
      ...poHeaderCustomerLiteralsDefault[poLocaleDefault],
      ...poHeaderCustomerLiteralsDefault[language]
    };
  }

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

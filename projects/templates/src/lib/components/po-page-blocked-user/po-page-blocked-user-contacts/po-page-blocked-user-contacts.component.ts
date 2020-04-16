import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

const poPageBlockedUserContactItemMargin = 16;

@Component({
  selector: 'po-page-blocked-user-contacts',
  templateUrl: './po-page-blocked-user-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoPageBlockedUserContactsComponent {
  private _email: string;
  private _phone: string;

  overflowItem: boolean = true;

  @Input('p-email') set email(value: string) {
    this._email = value;

    this.checkContactItemWidth();
  }

  get email() {
    return this._email;
  }

  @Input('p-phone') set phone(value: string) {
    this._phone = value;

    this.checkContactItemWidth();
  }

  get phone() {
    return this._phone;
  }

  @ViewChild('contactGroup', { static: true }) contactGroup: ElementRef;

  @ViewChild('mailItem', { static: true }) mailItem: ElementRef;

  @ViewChild('phoneItem', { static: true }) phoneItem: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef) {}

  private checkContactItemWidth() {
    this.overflowItem = true;

    if (this.phone && this.email) {
      this.changeDetector.detectChanges();

      const phoneWidth = this.phoneItem.nativeElement.offsetWidth;
      const mailWidth = this.mailItem.nativeElement.offsetWidth;
      const contactGroupHalfWidth =
        this.contactGroup.nativeElement.offsetWidth / 2 - poPageBlockedUserContactItemMargin;

      this.overflowItem =
        phoneWidth > contactGroupHalfWidth || mailWidth > contactGroupHalfWidth - poPageBlockedUserContactItemMargin;
    }
  }
}

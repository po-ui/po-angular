import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

const poPageBlockedUserContactItemMargin = 16;

@Component({
  selector: 'po-page-blocked-user-contacts',
  templateUrl: './po-page-blocked-user-contacts.component.html'
})
export class PoPageBlockedUserContactsComponent implements AfterViewInit, OnChanges {
  literals: Object;
  overflowItem: boolean = false;

  private mailText: string;
  private phoneText: string;

  @Input('p-email') email: string;

  @Input('p-phone') phone: string;

  @ViewChild('contactGroup', { static: true }) contactGroup: ElementRef;

  @ViewChild('mailItem', { static: true }) mailItem: ElementRef;

  @ViewChild('phoneItem', { static: true }) phoneItem: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.checkContactItemWidth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.email || changes.phone) {
      this.checkContactItemWidth();
    }
  }

  private checkContactItemWidth() {
    if (!this.email || !this.phone) {
      this.overflowItem = true;
      return;
    } else {
      setTimeout(() => {
        const phoneWidth = this.phoneItem.nativeElement.offsetWidth;
        const mailWidth = this.mailItem.nativeElement.offsetWidth;
        const contactGroupHalfWidth = this.contactGroup.nativeElement.offsetWidth / 2;

        this.overflowItem =
          phoneWidth > contactGroupHalfWidth || mailWidth > contactGroupHalfWidth - poPageBlockedUserContactItemMargin;
      });
    }
    this.changeDetector.detectChanges();
  }
}

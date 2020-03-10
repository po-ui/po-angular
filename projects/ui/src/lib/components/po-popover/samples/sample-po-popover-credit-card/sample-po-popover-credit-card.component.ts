import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'sample-po-popover-credit-card',
  templateUrl: './sample-po-popover-credit-card.component.html'
})
export class SamplePoPopoverCreditCardComponent {
  public inputCardName: string;
  public inputCardCode: string;
  public inputCardValid: string;

  @ViewChild('cardname', { read: ElementRef, static: true }) cardnameref: ElementRef;
  @ViewChild('cardcode', { read: ElementRef, static: true }) cardcoderef: ElementRef;
  @ViewChild('carddate', { read: ElementRef, static: true }) carddateref: ElementRef;
}

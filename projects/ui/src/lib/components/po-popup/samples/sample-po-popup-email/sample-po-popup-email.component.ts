import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PoModalAction, PoModalComponent, PoPopupAction } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-popup-email',
  templateUrl: './sample-po-popup-email.component.html',
  styles: [
    `
      .sample-logo-po {
        height: 15%;
        padding-top: 2.5%;
      }

      .sample-popup-header-template {
        background-color: #0c9abe;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        color: #ffffff;
        padding-bottom: 5%;
        padding-left: 25%;
        padding-top: 5%;
      }
    `
  ]
})
export class SamplePoPopupEmailComponent implements OnInit {
  @ViewChild('formEmail', { static: true }) formEmail: FormControl;

  @ViewChild('target', { read: ElementRef, static: true }) targetRef: ElementRef;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  cc: string;
  emailText: string;
  from: string;
  popupActions: Array<PoPopupAction>;
  primaryAction: PoModalAction;
  subject: string;
  to: string;

  ngOnInit() {
    this.popupActions = [
      { icon: 'po-icon-plus', label: 'Upper Text', type: 'default', action: this.upper.bind(this) },
      { icon: 'po-icon-minus', label: 'Lower Text', type: 'default', action: this.lower.bind(this) },
      { icon: 'po-icon-close', label: 'Clear', type: 'danger', action: this.clear.bind(this), separator: true }
    ];

    this.primaryAction = {
      label: 'Confirmar',
      action: () => {
        this.poModal.close();
        this.reset();
      }
    };
  }

  send() {
    this.poModal.open();
  }

  reset() {
    this.formEmail.reset();
  }

  private clear() {
    this.emailText = undefined;
  }

  private lower() {
    this.emailText = this.emailText && this.emailText.toLowerCase();
  }

  private upper() {
    this.emailText = this.emailText && this.emailText.toUpperCase();
  }
}

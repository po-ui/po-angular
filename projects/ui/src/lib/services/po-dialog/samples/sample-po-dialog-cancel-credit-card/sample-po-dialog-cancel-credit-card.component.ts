import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';

import { PoDialogService, PoNotificationService, PoPageAction, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-dialog-cancel-credit-card',
  templateUrl: './sample-po-dialog-cancel-credit-card.component.html'
})
export class SamplePoDialogCancelCreditCardComponent implements OnDestroy, OnInit {
  action: Array<PoPageAction>;
  address: string;
  cardNumber: string;
  cardType: string;
  city: string;
  country: string;
  name: string;
  phoneNumber: string;
  securityCode: string;
  stateProvince: string;
  zipPostalCode: string;

  private statusSubscription: Subscription;

  public readonly cardTypeOptions: Array<PoRadioGroupOption> = [
    { label: 'Master Card', value: 'Master' },
    { label: 'Visa', value: 'visa' },
    { label: 'Diners', value: 'diners' },
    { label: 'Hipercard', value: 'hipercard' }
  ];

  @ViewChild('form', { static: true }) form: FormControl;

  constructor(private poDialog: PoDialogService, private poNotification: PoNotificationService) {}

  ngOnDestroy() {
    this.statusSubscription.unsubscribe();
  }

  ngOnInit() {
    this.action = [
      {
        label: 'Cancel',
        icon: 'po-icon po-icon-delete',
        action: this.openConfirmDialog.bind(this),
        disabled: true
      }
    ];
    this.statusSubscription = this.form.statusChanges.subscribe(status => this.actionDisabledCheck(status));
  }

  actionDisabledCheck(status: string) {
    this.action[0].disabled = status === 'INVALID';
  }

  confirmCancelation() {
    this.poNotification.success(`Credit card ${this.cardNumber} canceled`);
    this.form.reset();
  }

  openConfirmDialog() {
    this.poDialog.confirm({
      title: 'Confirm',
      message: `Hi ${this.name},  do you confirm the cancellation of the card number ${this.cardNumber} ?`,
      confirm: () => this.confirmCancelation()
    });
  }
}

import { Component, OnInit } from '@angular/core';

import { PoPageBlockedUserReason, PoPageBlockedUserReasonParams } from '@po-ui/ng-templates';
import { PoRadioGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-page-blocked-user-labs',
  templateUrl: './sample-po-page-blocked-user-labs.component.html'
})
export class SamplePoPageBlockedUserLabsComponent implements OnInit {
  contactMail: string;
  contactPhone: string;
  customParams: PoPageBlockedUserReasonParams;
  params: string;
  logo: string;
  reason: PoPageBlockedUserReason = PoPageBlockedUserReason.None;
  secondaryLogo: string;
  url: string;

  public readonly reasonOptions: Array<PoRadioGroupOption> = [
    { label: 'Default', value: PoPageBlockedUserReason.None },
    { label: 'Expired Password', value: PoPageBlockedUserReason.ExpiredPassword },
    { label: 'Exceeded Attempts', value: PoPageBlockedUserReason.ExceededAttempts }
  ];

  ngOnInit() {
    this.restore();
  }

  changeLiterals() {
    try {
      this.customParams = JSON.parse(this.params);
    } catch {
      this.customParams = undefined;
    }
  }

  restore() {
    this.contactMail = undefined;
    this.contactPhone = undefined;
    this.customParams = { attempts: 5, days: 90, hours: 24 };
    this.params = '';
    this.logo = '';
    this.reason = PoPageBlockedUserReason.None;
    this.secondaryLogo = '';
    this.url = undefined;
  }
}

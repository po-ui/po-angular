import { Component } from '@angular/core';

import { PoPageBlockedUserReasonParams } from '@po-ui/ng-templates';

@Component({
  selector: 'sample-po-page-blocked-user-exceeded-attempts',
  templateUrl: './sample-po-page-blocked-user-exceeded-attempts.component.html'
})
export class SamplePoPageBlockedUserExceededAttemptsComponent {
  blocked = false;
  params: PoPageBlockedUserReasonParams = { attempts: 1, hours: 48 };

  checkLogin() {
    this.blocked = true;
  }
}

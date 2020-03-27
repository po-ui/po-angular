import { Component } from '@angular/core';

import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-loading-overlay-connection-test',
  templateUrl: 'sample-po-loading-overlay-connection-test.component.html'
})
export class SamplePoLoadingOverlayConnectionTestComponent {
  environment = {
    urlServer: '',
    urlDB: '',
    userDB: '',
    passwordDB: ''
  };

  isHideLoading = true;

  constructor(private poNotification: PoNotificationService) {}

  connectionTest() {
    const message = 'Connection ok';

    this.isHideLoading = false;

    setTimeout(() => {
      this.isHideLoading = true;
      this.poNotification.success(message);
    }, 450);
  }
}

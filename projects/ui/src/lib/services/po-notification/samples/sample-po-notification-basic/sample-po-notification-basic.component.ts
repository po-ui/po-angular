import { Component } from '@angular/core';

import { PoNotificationService } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-notification-basic',
  templateUrl: './sample-po-notification-basic.component.html'
})
export class SamplePoNotificationBasicComponent {
  constructor(public poNotification: PoNotificationService) {}
}

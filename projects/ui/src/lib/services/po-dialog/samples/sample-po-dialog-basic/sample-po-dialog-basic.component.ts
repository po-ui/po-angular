import { Component } from '@angular/core';

import { PoDialogService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-dialog-basic',
  templateUrl: './sample-po-dialog-basic.component.html'
})
export class SamplePoDialogBasicComponent {
  constructor(public poDialog: PoDialogService) {}
}

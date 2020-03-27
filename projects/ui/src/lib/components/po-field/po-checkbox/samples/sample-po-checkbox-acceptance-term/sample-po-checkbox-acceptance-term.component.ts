import { Component, ViewChild } from '@angular/core';

import { PoModalAction, PoModalComponent } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-checkbox-acceptance-term',
  templateUrl: './sample-po-checkbox-acceptance-term.component.html'
})
export class SamplePoCheckboxAcceptanceTermComponent {
  acceptance: boolean = false;

  primaryAction: PoModalAction = {
    action: () => {
      this.modalTerm.close();
    },
    disabled: true,
    label: 'Confirm'
  };

  @ViewChild(PoModalComponent, { static: true }) modalTerm: PoModalComponent;
}

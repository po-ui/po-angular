import { Component } from '@angular/core';

import { PoButtonGroupItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-group-basic',
  templateUrl: './sample-po-button-group-basic.component.html'
})
export class SamplePoButtonGroupBasicComponent {
  buttons: Array<PoButtonGroupItem> = [
    { label: 'Button 1', action: this.action.bind(this) },
    { label: 'Button 2', action: this.action.bind(this) }
  ];

  action(button) {
    alert(`${button.label}`);
  }
}

import { Component } from '@angular/core';

import { PoButtonGroupItem } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-button-group-basic',
  templateUrl: './sample-po-button-group-basic.component.html'
})
export class SamplePoButtonGroupBasicComponent {
  buttons: Array<PoButtonGroupItem> = [
    { label: 'Button 1', action: this.action },
    { label: 'Button 2', action: this.action }
  ];

  action(button) {
    alert(`${button.label}`);
  }
}

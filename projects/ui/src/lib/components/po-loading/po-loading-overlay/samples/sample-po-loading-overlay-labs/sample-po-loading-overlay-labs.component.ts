import { Component } from '@angular/core';

import { PoCheckboxGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-loading-overlay-labs',
  templateUrl: './sample-po-loading-overlay-labs.component.html',
  styles: [
    `
      .sample-container {
        position: relative;
        height: 300px;
      }
    `
  ]
})
export class SamplePoLoadingOverlayLabsComponent {
  properties: Array<string> = [];
  text: string;

  readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'screenLock', label: 'Screen Lock' }];

  onChangeCheckbox(checkbox: Array<string>) {
    if (checkbox.includes('screenLock')) {
      setTimeout(() => {
        this.properties = [];
      }, 2000);
    }
  }
}

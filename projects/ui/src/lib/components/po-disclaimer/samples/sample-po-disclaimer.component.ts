import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-disclaimer',
  templateUrl: './sample-po-disclaimer.component.html'
})
export class SamplePoDisclaimerComponent {
  exclude;

  disclaimerClosed({ value, label, property }) {
    this.exclude = { value, label, property };
  }
}

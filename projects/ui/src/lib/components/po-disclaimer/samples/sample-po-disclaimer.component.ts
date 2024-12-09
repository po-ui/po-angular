import { Component } from '@angular/core';

@Component({
  selector: 'sample-po-disclaimer',
  templateUrl: './sample-po-disclaimer.component.html',
  standalone: false
})
export class SamplePoDisclaimerComponent {
  exclude;

  disclaimerClosed({ value, label, property }) {
    this.exclude = { value, label, property };
  }
}

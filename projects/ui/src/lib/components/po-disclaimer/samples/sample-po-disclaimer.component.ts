import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'sample-po-disclaimer',
  templateUrl: './sample-po-disclaimer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class SamplePoDisclaimerComponent {
  exclude;

  disclaimerClosed({ value, label, property }) {
    this.exclude = { value, label, property };
  }
}

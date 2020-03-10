import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'po-progress-bar',
  templateUrl: './po-progress-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoProgressBarComponent {
  @Input('p-indeterminate') indeterminate: boolean;

  @Input('p-value') value: number;

  get valueScale() {
    return `${this.value / 100}`;
  }
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const CIRCLE_STROKE_MEDIUM = 4;
const CIRCLE_STROKE_LARGE = 8;

@Component({
  selector: 'po-progress-circle',
  templateUrl: './po-progress-circle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoProgressCircleComponent {
  @Input('p-indeterminate') indeterminate: boolean;
  @Input('p-show-percentage') showPercentage: boolean = false;
  @Input('p-size') size: string = 'large';
  @Input('p-status') status: string = 'default';
  @Input('p-value') value: number = 0;

  get radius(): number {
    return 45;
  }

  get strokeWidth(): number {
    return this.size === 'medium' ? CIRCLE_STROKE_MEDIUM : CIRCLE_STROKE_LARGE;
  }

  get viewBoxSize(): number {
    return (this.radius + this.strokeWidth) * 2;
  }

  get center(): number {
    return this.radius + this.strokeWidth;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    const clampedValue = Math.max(0, Math.min(100, this.value || 0));
    return this.circumference - (clampedValue / 100) * this.circumference;
  }
}

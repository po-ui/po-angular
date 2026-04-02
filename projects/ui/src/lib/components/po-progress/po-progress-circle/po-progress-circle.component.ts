import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

const CIRCLE_RADIUS_MEDIUM = 40;
const CIRCLE_RADIUS_LARGE = 52;
const CIRCLE_STROKE_MEDIUM = 6;
const CIRCLE_STROKE_LARGE = 8;
const CIRCLE_FONT_SIZE_MEDIUM = '0.875rem';
const CIRCLE_FONT_SIZE_LARGE = '1rem';

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
    return this.size === 'medium' ? CIRCLE_RADIUS_MEDIUM : CIRCLE_RADIUS_LARGE;
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

  get fontSize(): string {
    return this.size === 'medium' ? CIRCLE_FONT_SIZE_MEDIUM : CIRCLE_FONT_SIZE_LARGE;
  }

  get statusClass(): string {
    switch (this.status) {
      case 'success':
        return 'po-progress-circle-success';
      case 'error':
        return 'po-progress-circle-error';
      default:
        return 'po-progress-circle-default';
    }
  }
}

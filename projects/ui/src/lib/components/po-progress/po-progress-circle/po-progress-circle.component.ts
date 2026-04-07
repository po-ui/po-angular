import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { convertToBoolean } from '../../../utils/util';

const CIRCLE_STROKE_MEDIUM = 4;
const CIRCLE_STROKE_LARGE = 8;

@Component({
  selector: 'po-progress-circle',
  templateUrl: './po-progress-circle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoProgressCircleComponent {
  indeterminate = input<boolean, boolean>(false, { alias: 'p-indeterminate', transform: convertToBoolean });
  showPercentage = input<boolean, boolean>(false, { alias: 'p-show-percentage', transform: convertToBoolean });
  size = input<string, string>('large', {
    alias: 'p-size',
    transform: (value: string) => (value === 'medium' ? 'medium' : 'large')
  });
  status = input<string, string>('default', {
    alias: 'p-status',
    transform: (value: string) => (['default', 'success', 'error'].includes(value) ? value : 'default')
  });
  value = input<number>(0, { alias: 'p-value' });
  radius = input<number>(45, { alias: 'p-radius' });

  strokeWidth = computed(() => {
    return this.size() === 'medium' ? CIRCLE_STROKE_MEDIUM : CIRCLE_STROKE_LARGE;
  });

  viewBoxSize = computed(() => {
    return (this.radius() + this.strokeWidth()) * 2;
  });

  center = computed(() => {
    return this.radius() + this.strokeWidth();
  });

  circumference = computed(() => {
    return 2 * Math.PI * this.radius();
  });

  dashOffset = computed(() => {
    const clampedValue = Math.max(0, Math.min(100, this.value() || 0));
    return this.circumference() - (clampedValue / 100) * this.circumference();
  });
}

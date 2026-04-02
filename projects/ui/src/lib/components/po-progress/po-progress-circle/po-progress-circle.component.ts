import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { convertToBoolean } from '../../../utils/util';

const CIRCLE_STROKE_MEDIUM = 4;
const CIRCLE_STROKE_LARGE = 8;
const CIRCLE_MIN_RADIUS_WITH_CENTER_CONTENT = 24;
const CIRCLE_DEFAULT_RADIUS = 45;

@Component({
  selector: 'po-progress-circle',
  templateUrl: './po-progress-circle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
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

  ariaLabelInput = input<string>('', {
    alias: 'p-aria-label'
  });

  ariaLabel = computed(() => {
    const status = this.status() !== 'default' ? this.status() : '';
    const custom = this.ariaLabelInput();

    if (custom) {
      return `${status} ${custom}`;
    }

    return status;
  });

  value = input<number>(0, { alias: 'p-value' });

  // 0 = não informado pelo usuário (usa lógica automática)
  radius = input<number>(0, { alias: 'p-radius' });

  // Dimensão do container pai (fornecida pelo ResizeObserver do po-progress.component)
  parentSize = input<number>(0, { alias: 'p-parent-size' });

  strokeWidth = computed(() => (this.size() === 'medium' ? CIRCLE_STROKE_MEDIUM : CIRCLE_STROKE_LARGE));

  /**
   * Raio base calculado de acordo com as regras de prioridade:
   *
   * 1. Se `radius > 0` (usuário informou radius explicitamente):
   *    - Se o pai tem dimensão: limita ao máximo que cabe no pai (evita estouro)
   *    - Se o pai não tem dimensão: usa o radius informado diretamente
   *
   * 2. Se `radius === 0` (usuário NÃO informou radius):
   *    - Se o pai tem dimensão: ocupa o máximo disponível no pai
   *    - Se o pai não tem dimensão: usa o default de 45
   */
  baseRadius = computed(() => {
    const parentDimension = this.parentSize();
    const userRadius = this.radius();

    if (userRadius > 0) {
      if (parentDimension > 0) {
        const maxFitRadius = parentDimension / 2 - this.strokeWidth();
        return Math.min(userRadius, Math.max(maxFitRadius, 0));
      }
      return userRadius;
    }

    if (parentDimension > 0) {
      return parentDimension / 2 - this.strokeWidth();
    }

    return CIRCLE_DEFAULT_RADIUS;
  });

  hasCenterContent = computed(() => !this.indeterminate() && (this.showPercentage() || this.status() === 'error'));

  effectiveRadius = computed(() =>
    this.hasCenterContent() ? Math.max(this.baseRadius(), CIRCLE_MIN_RADIUS_WITH_CENTER_CONTENT) : this.baseRadius()
  );

  viewBoxSize = computed(() => (this.effectiveRadius() + this.strokeWidth()) * 2);

  center = computed(() => this.effectiveRadius() + this.strokeWidth());

  circumference = computed(() => 2 * Math.PI * this.effectiveRadius());

  dashOffset = computed(() => {
    const clampedValue = Math.max(0, Math.min(100, this.value() || 0));
    return this.circumference() - (clampedValue / 100) * this.circumference();
  });

  naturalSize = computed(() => {
    const vb = this.viewBoxSize();
    const ps = this.parentSize();
    return ps > 0 && vb > ps ? `${ps}px` : `${vb}px`;
  });
}

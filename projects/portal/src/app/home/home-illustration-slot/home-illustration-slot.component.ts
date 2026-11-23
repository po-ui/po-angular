import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

/**
 * Empty placeholder with the Figma dimensions, where an illustration will be projected later (decision D8).
 */
@Component({
  selector: 'app-home-illustration-slot',
  templateUrl: './home-illustration-slot.component.html',
  styleUrls: ['./home-illustration-slot.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomeIllustrationSlotComponent {
  /** Technical name of the slot, exposed as `data-illustration` (e.g. `hero-preview`). */
  @Input() label: string;

  /** Width in CSS units. Accepts a number (px) or a string. */
  @Input() width: number | string;

  /** Height in CSS units. Accepts a number (px) or a string. */
  @Input() height: number | string;

  /** Border radius in CSS units. Accepts a number (px) or a string. */
  @Input() radius: number | string;

  /** When `true`, the slot is hidden from assistive technologies. */
  @Input() decorative = true;

  @HostBinding('style.width') get hostWidth(): string {
    return this.toCss(this.width);
  }

  @HostBinding('style.height') get hostHeight(): string {
    return this.toCss(this.height);
  }

  @HostBinding('style.border-radius') get hostRadius(): string {
    return this.toCss(this.radius);
  }

  @HostBinding('attr.data-illustration') get illustration(): string {
    return this.label;
  }

  @HostBinding('attr.aria-hidden') get ariaHidden(): string {
    return this.decorative ? 'true' : null;
  }

  private toCss(value: number | string): string {
    return typeof value === 'number' ? `${value}px` : value || null;
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { HOME_HERO_SHOWCASE_SAMPLE_NAMES } from './generated/home-hero-showcase-samples.component';

/**
 * Decorative and endless list of PO UI components, tilted in 3D, shown in the hero.
 *
 * The components are a static template (generated/, generated from the real samples by
 * `npm run portal:showcase:generate`), rendered in the first render: no chunk to load, no PO UI component to create and
 * nothing to wait for. The view is then detached from change detection.
 */
@Component({
  selector: 'app-home-hero-showcase',
  templateUrl: './home-hero-showcase.component.html',
  styleUrls: ['./home-hero-showcase.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  host: { 'aria-hidden': 'true', inert: '' },
  standalone: false
})
export class HomeHeroShowcaseComponent implements AfterViewInit, OnDestroy {
  /** Three copies of the same content: the animation moves one copy and restarts without a visible jump (see the CSS). */
  readonly copies = [0, 1, 2];

  /** Names of the samples (keys of PREVIEW_SAMPLES), one per card. */
  readonly samples = HOME_HERO_SHOWCASE_SAMPLE_NAMES;

  private observer: IntersectionObserver;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit() {
    // The first render is done: from now on nothing in this tree is checked again.
    this.cdr.detach();

    // shortcut: pauses by toggling a class straight on the host (no change detection), when the hero leaves the screen.
    if (typeof IntersectionObserver !== 'undefined') {
      const host = this.elementRef.nativeElement;
      this.observer = new IntersectionObserver(([entry]) => host.classList.toggle('is-paused', !entry.isIntersecting));
      this.observer.observe(host);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}

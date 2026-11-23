import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  EnvironmentInjector,
  NgZone,
  OnDestroy,
  ViewChild,
  createComponent
} from '@angular/core';

import { loadPreviewSampleComponent } from '../../documentation/documentation-preview/preview-sample-loader';

/** Attributes that point to an id: removed from the clones, which must not duplicate ids of the page. */
const ID_REFERENCE_ATTRIBUTES = [
  'id',
  'for',
  'list',
  'form',
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-activedescendant'
];

/** Pause in the scrolling required before the two heaviest steps (loading the chunk and revealing the cards). */
const HEAVY_STEP_QUIET_MS = 500;

/**
 * Decorative and endless list of real PO UI components, tilted in 3D, shown in the hero.
 *
 * Load strategy (to keep the page scrollable while it loads):
 * 1. the cards start with a skeleton and the view is detached after the first render;
 * 2. when the browser is idle and the user is not scrolling, the 12 samples are created ONE per slice,
 *    outside the Angular zone, in a hidden staging area (nothing is laid out or painted in the 3D plane);
 * 3. when all of them exist, and again with no scrolling, they are revealed in a single step: the created
 *    elements go to the first copy and the other copies get clones (no Angular work for the clones).
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

  /** Small samples of the components list (names of PREVIEW_SAMPLES), one per card. */
  readonly samples = [
    'po-tag',
    'po-button',
    'po-switch',
    'po-input',
    'po-select',
    'po-widget',
    'po-radio-group',
    'po-checkbox',
    'po-link',
    'po-badge',
    'po-button-group',
    'po-divider'
  ];

  /** Hidden area where the samples are created before being revealed. */
  @ViewChild('staging', { static: true }) staging!: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;

  private refs: Array<ComponentRef<unknown>> = [];

  private lastScroll = 0;

  private destroyed = false;

  private readonly scrollEvents = ['scroll', 'wheel', 'touchmove'];

  private readonly onScroll: () => void;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private environmentInjector: EnvironmentInjector
  ) {
    this.onScroll = () => (this.lastScroll = performance.now());
  }

  ngAfterViewInit() {
    // The first render is done: from now on nothing in this tree is checked again.
    this.cdr.detach();

    // shortcut: pauses by toggling a class straight on the host (no change detection), when the hero leaves the screen.
    if (typeof IntersectionObserver !== 'undefined') {
      const host = this.elementRef.nativeElement;
      this.observer = new IntersectionObserver(([entry]) => host.classList.toggle('is-paused', !entry.isIntersecting));
      this.observer.observe(host);
    }

    this.ngZone.runOutsideAngular(() => this.loadSamples());
  }

  ngOnDestroy() {
    this.destroyed = true;
    this.stopWatchingScroll();
    this.observer?.disconnect();
    this.refs.forEach(ref => ref.destroy());
    this.refs = [];
  }

  /**
   * Moves the staged samples into the cards: the elements themselves go to the first copy and the other copies get
   * clones, all in one synchronous step (one layout and one paint instead of one per sample).
   */
  reveal(staged: Array<HTMLElement>): void {
    const grids = Array.from(this.elementRef.nativeElement.querySelectorAll('.home-showcase-grid'));
    const fragments = grids.map(grid => Array.from(grid.children) as Array<HTMLElement>);

    staged.forEach((element, index) => {
      // clones first: the original is moved to the first copy afterwards
      fragments.slice(1).forEach(cards => cards[index]?.appendChild(this.cloneForDisplay(element)));
      fragments[0]?.[index]?.appendChild(element);
    });
  }

  /** Resolves when nothing has scrolled (any scroller of the page) for `quietMs`. */
  whenScrollQuiet(quietMs = 300): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        const wait = quietMs - (performance.now() - this.lastScroll);
        wait <= 0 ? resolve() : setTimeout(check, wait);
      };
      check();
    });
  }

  private async loadSamples(): Promise<void> {
    this.watchScroll();

    await this.whenIdle();
    // the first slice evaluates the chunk with the samples (the heaviest one): wait for a longer pause in the scrolling
    await this.whenScrollQuiet(HEAVY_STEP_QUIET_MS);

    const staged: Array<HTMLElement> = [];

    // Slice 1: create the components (instantiation). Slice 2: render them. Each slice is one task, so none is longer than needed.
    const created: Array<ComponentRef<unknown>> = [];
    for (const name of this.samples) {
      // between slices, give the way to the user: if the page is being scrolled, wait for it to stop
      await this.whenScrollQuiet();
      if (this.destroyed) {
        return;
      }

      const component = await loadPreviewSampleComponent(name);
      if (component) {
        created.push(createComponent(component, { environmentInjector: this.environmentInjector }));
        this.refs.push(created[created.length - 1]);
      }
      await this.yieldToMain();
    }

    for (const ref of created) {
      await this.whenScrollQuiet();
      if (this.destroyed) {
        return;
      }

      ref.changeDetectorRef.detectChanges();
      ref.changeDetectorRef.detach();

      const element = ref.location.nativeElement as HTMLElement;
      this.staging.nativeElement.appendChild(element);
      staged.push(element);
      await this.yieldToMain();
    }

    await this.whenScrollQuiet(HEAVY_STEP_QUIET_MS);
    if (!this.destroyed) {
      this.reveal(staged);
    }
    this.stopWatchingScroll();
  }

  private cloneForDisplay(element: HTMLElement): HTMLElement {
    const clone = element.cloneNode(true) as HTMLElement;
    const selector = ID_REFERENCE_ATTRIBUTES.map(attribute => `[${attribute}]`).join(',');

    [clone, ...Array.from(clone.querySelectorAll<HTMLElement>(selector))].forEach(node =>
      ID_REFERENCE_ATTRIBUTES.forEach(attribute => node.removeAttribute(attribute))
    );

    return clone;
  }

  private watchScroll(): void {
    // scroll does not bubble, so the listener uses capture to see any scroller (the page scrolls in .po-page-content)
    this.scrollEvents.forEach(type => document.addEventListener(type, this.onScroll, { capture: true, passive: true }));
  }

  private stopWatchingScroll(): void {
    this.scrollEvents.forEach(type => document.removeEventListener(type, this.onScroll, { capture: true }));
  }

  private whenIdle(): Promise<void> {
    return new Promise(resolve =>
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(() => resolve(), { timeout: 800 })
        : setTimeout(resolve, 200)
    );
  }

  private yieldToMain(): Promise<void> {
    const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
    // shortcut: setTimeout(0) when scheduler.yield does not exist (Safari/Firefox); it can be delayed by timer clamping.
    return scheduler?.yield ? scheduler.yield() : new Promise(resolve => setTimeout(resolve));
  }
}

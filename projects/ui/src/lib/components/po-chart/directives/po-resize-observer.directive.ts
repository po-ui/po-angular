/// <reference types="resize-observer-browser" />

import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[p-resize-observer]'
})
export class PoResizeObserverDirective implements OnDestroy, OnInit {
  private subscription = new Subscription();
  private observer;
  private chartWidthResize$ = new Subject();

  @Output('p-resize-observer') resize = new EventEmitter();

  constructor(private elementRef: ElementRef) {}

  ngOnDestroy() {
    if (this.isResizeObserverSupported) {
      this.observer.unobserve(this.elementRef.nativeElement);
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    if (this.isResizeObserverSupported) {
      this.observer = new window.ResizeObserver(() => {
        this.chartWidthResize$.next();
      });

      this.observer.observe(this.elementRef.nativeElement);

      this.subscription.add(
        this.chartWidthResize$.pipe(debounceTime(20)).subscribe(_ => {
          this.resize.emit();
        })
      );
    }
  }

  private get isResizeObserverSupported(): boolean {
    return typeof window.ResizeObserver === 'function';
  }
}

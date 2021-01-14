import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PoChartModule } from '../po-chart.module';
import { PoResizeObserverDirective } from './po-resize-observer.directive';

@Component({
  template: `
    <div class="po-chart-wrapper" (p-resize-observer)="testResize()">
      <svg
        preserveAspectRatio="xMidYMin meet"
        class="po-chart-svg-element"
        viewBox="1 -1 300 300"
        width="964"
        height="300"
      >
        <path
          p-chart-tooltip="TooltipLabel"
          class="po-path-item"
          fill="#0C6C94"
          d="M 150 0 A 150 150 0 1,1 68.90387738166027 23.81197007532289 L 150 150 Z"
        ></path>
      </svg>
    </div>
  `
})
export class TestComponent {
  testResize() {}
}

describe('PoResizeObserverDirective', () => {
  let directiveElement;
  let directive: PoResizeObserverDirective;

  let fixture: ComponentFixture<TestComponent>;

  let event;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoChartModule],
        declarations: [PoResizeObserverDirective, TestComponent]
      });
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    directiveElement = fixture.debugElement.query(By.directive(PoResizeObserverDirective));

    directive = directiveElement.injector.get(PoResizeObserverDirective);

    fixture.detectChanges();

    event = document.createEvent('MouseEvents');
    event.initEvent('scroll', false, true);
  });

  it('should be created TestComponent', () => {
    expect(TestComponent).toBeTruthy();
  });

  it('ngOnInit: should emit when the resizeObserver fire', fakeAsync(() => {
    const spy = spyOn(directive.resize, 'emit');

    directive['chartWidthResize$'].next();

    tick(100);
    expect(spy).toHaveBeenCalled();
  }));

  it('ngOnInit: should not emit when the resizeObserver is not supported', fakeAsync(() => {
    const spy = spyOn(directive.resize, 'emit');
    const resizeRef = window.ResizeObserver;

    window.ResizeObserver = undefined;

    directive.ngOnInit();
    directive.ngOnDestroy();

    tick(100);
    expect(spy).not.toHaveBeenCalled();

    window.ResizeObserver = resizeRef;
  }));
});

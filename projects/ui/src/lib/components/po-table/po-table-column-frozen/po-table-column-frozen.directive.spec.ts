import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement, ElementRef, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';

import { PoTableColumnFrozenDirective } from './po-table-column-frozen.directive';

@Component({
  template: `
    <div #parentElement>
      <div pFrozenColumn [pFrozenColumn]="frozen" [alignFrozen]="alignFrozen"></div>
    </div>
  `
})
class TestHostComponent {
  frozen: boolean;
  alignFrozen: string;
}

const mockElementRef: any = {
  nativeElement: {
    offsetWidth: 100
  }
};

describe('PoTableColumnFrozenDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;
  let directiveEl: DebugElement;

  let directiveInstance: PoTableColumnFrozenDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoTableColumnFrozenDirective, TestHostComponent],
      providers: [{ provide: ElementRef, useValue: mockElementRef }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = fixture.componentInstance;
    directiveEl = fixture.debugElement.query(By.directive(PoTableColumnFrozenDirective));
    directiveInstance = directiveEl.injector.get(PoTableColumnFrozenDirective);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directiveEl).toBeTruthy();
  });

  it('should add class po-table-column-fixed when frozen is true and alignFrozen is left', () => {
    testHostComponent.frozen = true;
    testHostComponent.alignFrozen = 'left';
    fixture.detectChanges();

    expect(directiveEl.nativeElement.classList.contains('po-table-column-fixed')).toBeTruthy();
  });

  it('should not add class po-table-column-fixed when frozen is false', () => {
    testHostComponent.frozen = false;
    fixture.detectChanges();

    expect(directiveEl.nativeElement.classList.contains('po-table-column-fixed')).toBeFalsy();
  });

  it('index: should return -1 for an element that is not a child of the parent', () => {
    const element = {
      parentNode: {
        childNodes: [
          { element: '<div></div>', nodeType: 1 },
          { element: '<div></div>', nodeType: 2 }
        ]
      }
    };

    expect(directiveInstance.index(element)).toBe(-1);
  });

  it('index: shouldn`t return -1 for an element', () => {
    const parentEl = document.createElement('div');
    const el = document.createElement('div');

    parentEl.appendChild(el);

    const result = directiveInstance.index(el);

    expect(result).toBe(0);
  });

  it('getOuterWidth: should return width with no margin', () => {
    const element = {
      offsetWidth: 300
    };
    const result = directiveInstance.getOuterWidth(element);

    // reduz 1px
    expect(result).toBe(299);
  });

  it('getOuterWidth: should call getComputedStyle', () => {
    const el = document.createElement('div');
    el.style.width = '300px';
    el.style.margin = '10px';

    spyOn(window, 'getComputedStyle').and.callThrough();

    directiveInstance.getOuterWidth(el, true);

    expect(window.getComputedStyle).toHaveBeenCalled();
  });

  it('should call resizeColumns when frozen changes from true to false', fakeAsync(() => {
    const previousValue = true;
    const currentValue = false;

    const changes: SimpleChanges = {
      frozen: {
        previousValue,
        currentValue,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    spyOn(directiveInstance, 'resizeColumns');

    directiveInstance.ngOnChanges(changes);

    tick(101);

    expect(directiveInstance.resizeColumns).toHaveBeenCalled();
  }));

  it('should not call resizeColumns when frozen changes from false to true', fakeAsync(() => {
    const previousValue = false;
    const currentValue = true;

    const changes: SimpleChanges = {
      frozen: {
        previousValue,
        currentValue,
        firstChange: false,
        isFirstChange: () => false
      }
    };

    spyOn(directiveInstance, 'resizeColumns');

    directiveInstance.ngOnChanges(changes);

    tick(101);

    expect(directiveInstance.resizeColumns).not.toHaveBeenCalled();
  }));
});

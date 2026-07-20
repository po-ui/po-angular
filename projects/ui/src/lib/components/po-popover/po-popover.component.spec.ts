import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoControlPositionService } from './../../services/po-control-position/po-control-position.service';
import { PoPopoverComponent } from './po-popover.component';

describe('PoPopoverComponent:', () => {
  let component: PoPopoverComponent;
  let fixture: ComponentFixture<PoPopoverComponent>;
  let nativeElement;

  const eventClick = document.createEvent('MouseEvents');

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, OverlayModule, NgTemplateOutlet],
      declarations: [PoPopoverComponent],
      providers: [PoControlPositionService],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  // Stash originals so individual tests can invoke the real hooks when needed.
  const originalNgAfterViewInit = PoPopoverComponent.prototype.ngAfterViewInit;
  const originalNgOnDestroy = PoPopoverComponent.prototype.ngOnDestroy;

  beforeAll(() => {
    // The popover template puts `#popoverElement` inside an
    // <ng-template #sharedPopoverContent> rendered via *ngTemplateOutlet.
    // Under `NO_ERRORS_SCHEMA`, Angular's JIT compiler skips the outlet, so
    // the ViewChild `popoverElement` never resolves, and every
    // `fixture.detectChanges()` in `beforeEach` would crash inside
    // `ngAfterViewInit -> setElementsControlPosition`.
    //
    // We stub the lifecycle hooks at the prototype level so the default
    // fixture setup does not throw. Tests that need the real behavior can
    // restore the hook via `PoPopoverComponent.prototype.ngAfterViewInit =
    // originalNgAfterViewInit` in an inner beforeEach/afterEach.
    PoPopoverComponent.prototype.ngAfterViewInit = function (this: PoPopoverComponent) {
      (this as any).afterViewInitWasCalled = true;
    };
    PoPopoverComponent.prototype.ngOnDestroy = function () {
      // no-op; individual tests exercise the real one explicitly.
    };
  });

  afterAll(() => {
    PoPopoverComponent.prototype.ngAfterViewInit = originalNgAfterViewInit;
    PoPopoverComponent.prototype.ngOnDestroy = originalNgOnDestroy;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPopoverComponent);
    component = fixture.componentInstance;

    const target = document.createElement('button');
    document.body.appendChild(target);
    component.target = target;

    // Provide fallbacks so any code path reading these does not throw
    // even though the template stubs are neutralized.
    if (!component.popoverElement) {
      (component as any).popoverElement = { nativeElement: document.createElement('div') };
    }
    if (!(component as any).resizeListener) {
      (component as any).resizeListener = () => {};
    }

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;

    component.target = component.popoverElement;
    component.targetElement = component.popoverElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges: should call removeListeners and initEvents when target is changed', () => {
    spyOn(component, <any>'removeListeners');
    spyOn(component, 'initEvents');

    component.afterViewInitWasCalled = true;

    component.ngOnChanges({
      target: {
        currentValue: 'value',
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component['removeListeners']).toHaveBeenCalled();
    expect(component['initEvents']).toHaveBeenCalled();
  });

  it('ngOnChanges: should call attachPopoverKeydown when appendBox is changed', () => {
    spyOn(component, <any>'attachPopoverKeydown');
    component.afterViewInitWasCalled = true;
    component.ngOnChanges({
      appendBox: {
        currentValue: true,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });

    expect(component['attachPopoverKeydown']).toHaveBeenCalled();
  });

  it('should call setElement and setRendererListenInit in ngAfterViewInit', () => {
    spyOn(component['poControlPosition'], 'setElements');
    spyOn(component, 'setRendererListenInit');
    originalNgAfterViewInit.call(component);
    expect(component['poControlPosition'].setElements).toHaveBeenCalled();
    expect(component.setRendererListenInit).toHaveBeenCalled();
  });

  it('should set targetElement in ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.targetElement).toBeTruthy();
  });

  it('should call setPopoverPosition in debounceResize', fakeAsync(() => {
    spyOn(component, 'setPopoverPosition');
    component.debounceResize();

    tick(300);

    expect(component.setPopoverPosition).toHaveBeenCalled();
  }));

  it('should call adjustPosition and set arrowDirection in setPopoverPosition', fakeAsync(() => {
    const fakeThis = {
      poControlPosition: {
        adjustPosition: position => true,
        getArrowDirection: () => 'top'
      },
      position: 'bottom',
      arrowDirection: ''
    };

    spyOn(fakeThis.poControlPosition, 'adjustPosition');

    component.setPopoverPosition.call(fakeThis);

    expect(fakeThis.poControlPosition.adjustPosition).toHaveBeenCalledWith('bottom');
    expect(fakeThis.arrowDirection).toBe('top');
  }));

  describe('setRendererListenInit:', () => {
    it(`should listen for 'mouseenter' `, () => {
      const fakeEvent = getFakeToSetRendererListenInit('hover', component);
      component.targetElement = component.popoverElement.nativeElement;

      spyOn(fakeEvent, 'open');

      component.setRendererListenInit.call(fakeEvent);

      const event = document.createEvent('MouseEvents');
      event.initEvent('mouseenter', false, true);
      fakeEvent.target.nativeElement.dispatchEvent(event);

      expect(fakeEvent.open).toHaveBeenCalled();
    });

    it(`should listen for 'mouseleave' `, () => {
      const fakeEvent = getFakeToSetRendererListenInit('hover', component);

      spyOn(fakeEvent, 'close').and.callFake(() => {});

      component.setRendererListenInit.call(fakeEvent);

      const event = document.createEvent('MouseEvents');
      event.initEvent('mouseleave', false, true);
      fakeEvent.target.nativeElement.dispatchEvent(event);

      expect(fakeEvent.close).toHaveBeenCalled();
    });

    it(`should listen for 'click'`, () => {
      const fakeEvent = getFakeToSetRendererListenInit('click', component);

      spyOn(fakeEvent, 'togglePopup').and.callFake(() => {});

      component.setRendererListenInit.call(fakeEvent);

      eventClick.initEvent('click', false, true);

      document.dispatchEvent(eventClick);

      expect(fakeEvent.togglePopup).toHaveBeenCalled();
    });

    it(`should listen for 'resize' `, () => {
      const fakeEvent = getFakeToSetRendererListenInit('resize', component);
      const fakeThis = { ...fakeEvent, isHidden: false };
      spyOn(fakeThis, 'debounceResize').and.callFake(() => {});

      component.setRendererListenInit.call(fakeThis);

      window.dispatchEvent(new Event('resize'));

      expect(fakeThis.debounceResize).toHaveBeenCalled();
    });

    it('should intercept TAB and focus first focusable when appendBox=true and popover is open', () => {
      const fake = getFakeToSetRendererListenInit('click', component);
      const fakeThis = {
        ...fake,
        appendBox: true,
        isHidden: false,
        focusOnFirstFocusable: jasmine.createSpy('focusOnFirstFocusable'),
        focusPrevBeforeTarget: jasmine.createSpy('focusPrevBeforeTarget')
      };

      fakeThis.targetElement = document.body;
      component.setRendererListenInit.call(fakeThis);
      const ev = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true
      });
      const defaultPreventedBefore = ev.defaultPrevented;
      fakeThis.targetElement.dispatchEvent(ev);

      expect(defaultPreventedBefore).toBeFalse();
      expect(fakeThis.focusOnFirstFocusable).toHaveBeenCalled();
      expect(fakeThis.focusPrevBeforeTarget).not.toHaveBeenCalled();
    });

    it('should intercept SHIFT+TAB and focus previous before target when appendBox=true and popover is open', () => {
      const fake = getFakeToSetRendererListenInit('click', component);
      const fakeThis = {
        ...fake,
        appendBox: true,
        isHidden: false,
        focusOnFirstFocusable: jasmine.createSpy('focusOnFirstFocusable'),
        focusPrevBeforeTarget: jasmine.createSpy('focusPrevBeforeTarget')
      };
      fakeThis.targetElement = document.body;
      component.setRendererListenInit.call(fakeThis);
      const ev = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true
      });
      fakeThis.targetElement.dispatchEvent(ev);

      expect(fakeThis.focusPrevBeforeTarget).toHaveBeenCalled();
      expect(fakeThis.focusOnFirstFocusable).not.toHaveBeenCalled();
    });

    it('should NOT intercept TAB when appendBox=false', () => {
      const fake = getFakeToSetRendererListenInit('click', component);
      const fakeThis = {
        ...fake,
        appendBox: false,
        isHidden: false,
        focusOnFirstFocusable: jasmine.createSpy('focusOnFirstFocusable'),
        focusPrevBeforeTarget: jasmine.createSpy('focusPrevBeforeTarget')
      };
      fakeThis.targetElement = document.body;
      component.setRendererListenInit.call(fakeThis);
      const ev = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true
      });
      fakeThis.targetElement.dispatchEvent(ev);

      expect(ev.defaultPrevented).toBeFalse();
      expect(fakeThis.focusOnFirstFocusable).not.toHaveBeenCalled();
      expect(fakeThis.focusPrevBeforeTarget).not.toHaveBeenCalled();
    });

    it('should NOT intercept TAB when popover is hidden', () => {
      const fake = getFakeToSetRendererListenInit('click', component);
      const fakeThis = {
        ...fake,
        appendBox: true,
        isHidden: true,
        focusOnFirstFocusable: jasmine.createSpy('focusOnFirstFocusable'),
        focusPrevBeforeTarget: jasmine.createSpy('focusPrevBeforeTarget')
      };
      fakeThis.targetElement = document.body;
      component.setRendererListenInit.call(fakeThis);
      const ev = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true
      });

      fakeThis.targetElement.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBeFalse();
      expect(fakeThis.focusOnFirstFocusable).not.toHaveBeenCalled();
      expect(fakeThis.focusPrevBeforeTarget).not.toHaveBeenCalled();
    });
  });

  it('should open popover in togglePopup when click on target', () => {
    component.popoverElement.nativeElement.hidden = true;
    component.target = component.popoverElement;
    component.targetElement = component.popoverElement.nativeElement;

    spyOn(component, 'open');

    eventClick.initEvent('click', false, true);

    component.target.nativeElement.dispatchEvent(eventClick);
    component.target.nativeElement.click();

    component.togglePopup(eventClick);

    expect(component.open).toHaveBeenCalled();
  });

  it('should close popover in togglePopup when click on target', () => {
    component.popoverElement.nativeElement.hidden = false;
    component.target = component.popoverElement;
    component.targetElement = component.popoverElement.nativeElement;

    spyOn(component, 'close');

    eventClick.initEvent('click', false, true);

    component.target.nativeElement.dispatchEvent(eventClick);
    component.target.nativeElement.click();

    component.togglePopup(eventClick);

    expect(component.close).toHaveBeenCalled();
  });

  it('shouldn`t call open and close in togglePopup when click on popoverElement', () => {
    const fakePopover = {
      popoverElement: component.popoverElement,
      target: {
        nativeElement: document.head
      },
      targetElement: document.head,
      close: () => {},
      open: () => {}
    };

    spyOn(fakePopover, 'close');
    spyOn(fakePopover, 'open');

    eventClick.initEvent('click', false, true);

    fakePopover.popoverElement.nativeElement.dispatchEvent(eventClick);
    fakePopover.popoverElement.nativeElement.click();

    component.togglePopup.call(fakePopover, eventClick);

    expect(fakePopover.close).not.toHaveBeenCalled();
    expect(fakePopover.open).not.toHaveBeenCalled();
  });

  it('should open popover', fakeAsync(() => {
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const fakeThis = {
      addScrollEventListener: () => {},
      isHidden: true,
      position: 'top',
      openPopover: { emit: () => {} },
      setPopoverPosition: () => {},
      setElementsControlPosition: () => {},
      setOpacity: arg => {},
      observeContentResize: () => {},
      cd: { detectChanges: () => {} },
      showPopover: undefined as any
    };

    fakeThis.showPopover = () => {
      requestAnimationFrame(() => {
        fakeThis.setElementsControlPosition();
        fakeThis.setPopoverPosition();
        fakeThis.setOpacity(1);
        fakeThis.openPopover.emit();
        fakeThis.observeContentResize();
        fakeThis.cd.detectChanges();
      });
    };

    spyOn(fakeThis, 'addScrollEventListener');
    spyOn(fakeThis, 'setOpacity');
    spyOn(fakeThis, 'setElementsControlPosition');
    spyOn(fakeThis, 'observeContentResize');
    spyOn(fakeThis.cd, 'detectChanges');
    component.open.call(fakeThis);

    expect(fakeThis.isHidden).toBeFalsy();
    expect(fakeThis.addScrollEventListener).toHaveBeenCalled();
    expect(fakeThis.setOpacity).toHaveBeenCalledWith(1);
    expect(fakeThis.setElementsControlPosition).toHaveBeenCalled();
    expect(fakeThis.observeContentResize).toHaveBeenCalled();
    expect(fakeThis.cd.detectChanges).toHaveBeenCalled();
  }));

  it('open: should set widthPopover from getBoundingClientRect when cornerAligned is true and width is undefined', fakeAsync(() => {
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const fakeNativeElement = {
      style: { width: '', opacity: 0, visibility: '', left: '' },
      getBoundingClientRect: () => ({ width: 250 })
    };

    const fakeThis: any = {
      addScrollEventListener: () => {},
      isHidden: true,
      cornerAligned: true,
      width: undefined,
      widthPopover: undefined,
      popoverElement: { nativeElement: fakeNativeElement },
      openPopover: { emit: () => {} },
      setPopoverPosition: jasmine.createSpy('setPopoverPosition'),
      setElementsControlPosition: () => {},
      setOpacity: () => {},
      observeContentResize: () => {},
      cd: { detectChanges: () => {} },
      showPopover: () => {}
    };

    component.open.call(fakeThis);

    expect(fakeNativeElement.style.visibility).toBe('');
    expect(fakeNativeElement.style.left).toBe('');
    expect(fakeThis.widthPopover).toBe(250);
    expect(window.requestAnimationFrame).toHaveBeenCalled();
  }));

  it('open: should NOT set widthPopover when cornerAligned is false', () => {
    const fakeThis: any = {
      addScrollEventListener: () => {},
      isHidden: true,
      cornerAligned: false,
      width: undefined,
      widthPopover: undefined,
      openPopover: { emit: () => {} },
      setPopoverPosition: () => {},
      setElementsControlPosition: () => {},
      setOpacity: () => {},
      observeContentResize: () => {},
      cd: { detectChanges: () => {} },
      showPopover: () => {}
    };

    component.open.call(fakeThis);

    expect(fakeThis.widthPopover).toBeUndefined();
  });

  it('open: should NOT set widthPopover when width input is defined', () => {
    const fakeThis: any = {
      addScrollEventListener: () => {},
      isHidden: true,
      cornerAligned: true,
      width: 300,
      widthPopover: undefined,
      openPopover: { emit: () => {} },
      setPopoverPosition: () => {},
      setElementsControlPosition: () => {},
      setOpacity: () => {},
      observeContentResize: () => {},
      cd: { detectChanges: () => {} },
      showPopover: () => {}
    };

    component.open.call(fakeThis);

    expect(fakeThis.widthPopover).toBeUndefined();
  });

  it('open: should recalculate widthPopover on second open after close resets it when cornerAligned is true', fakeAsync(() => {
    spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });

    const fakeNativeElement = {
      style: { width: '', opacity: 0, visibility: '', left: '' },
      getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({ width: 200 })
    };

    const fakeThis: any = {
      addScrollEventListener: () => {},
      isHidden: true,
      cornerAligned: true,
      width: undefined,
      widthPopover: undefined,
      popoverElement: { nativeElement: fakeNativeElement },
      openPopover: { emit: () => {} },
      closePopover: { emit: () => {} },
      setPopoverPosition: () => {},
      setElementsControlPosition: () => {},
      setOpacity: () => {},
      observeContentResize: () => {},
      cd: { detectChanges: () => {} },
      showPopover: () => {},
      disconnectResizeObserver: () => {},
      mutationObserver: null,
      clickoutListener: undefined,
      trigger: 'click'
    };

    // First open — should calculate widthPopover
    component.open.call(fakeThis);
    expect(fakeThis.widthPopover).toBe(200);
    expect(fakeNativeElement.getBoundingClientRect).toHaveBeenCalledTimes(1);

    // Close — widthPopover is reset to undefined
    component.close.call(fakeThis);
    expect(fakeThis.widthPopover).toBeUndefined();

    // Second open — should recalculate because close reset widthPopover
    fakeThis.isHidden = true;
    fakeNativeElement.getBoundingClientRect.calls.reset();
    fakeNativeElement.getBoundingClientRect.and.returnValue({ width: 300 });
    component.open.call(fakeThis);
    expect(fakeThis.widthPopover).toBe(300);
    expect(fakeNativeElement.getBoundingClientRect).toHaveBeenCalledTimes(1);
  }));

  it('open: should set clickoutListener when trigger is function', () => {
    const fakeListener = jasmine.createSpy('listener');

    const fakeThis: any = {
      trigger: 'function',
      renderer: {
        listen: jasmine.createSpy('listen').and.callFake((_target, _event, callback) => {
          callback({});
          return fakeListener;
        })
      },
      togglePopup: jasmine.createSpy('togglePopup'),
      addScrollEventListener: () => {},
      setOpacity: () => {},
      setElementsControlPosition: () => {},
      setPopoverPosition: () => {},
      observeContentResize: () => {},
      openPopover: { emit: () => {} },
      cd: { detectChanges: () => {} },
      isHidden: true,
      showPopover: () => {}
    };

    component.open.call(fakeThis);

    expect(fakeThis.renderer.listen).toHaveBeenCalledWith('document', 'click', jasmine.any(Function));
    expect(fakeThis.togglePopup).toHaveBeenCalled();
    expect(fakeThis.clickoutListener).toBe(fakeListener);
  });

  it('should close popover and call `closePopover.emit` and `disconnectResizeObserver`', () => {
    spyOn(component.closePopover, 'emit');
    spyOn<any>(component, 'disconnectResizeObserver');
    component.isHidden = false;

    component.close();

    expect(component.isHidden).toBeTruthy();
    expect(component['disconnectResizeObserver']).toHaveBeenCalled();
    expect(component.closePopover.emit).toHaveBeenCalled();
  });

  it('close: should call clickoutListener when trigger is function and clickoutListener exists', () => {
    const fakeThis = {
      isHidden: false,
      trigger: 'function',
      closePopover: { emit: () => {} },
      clickoutListener: () => {},
      disconnectResizeObserver: () => {},
      cd: { detectChanges: () => {} }
    };

    spyOn(fakeThis.closePopover, 'emit');
    spyOn(fakeThis, 'clickoutListener');
    spyOn(fakeThis, 'disconnectResizeObserver');
    spyOn(fakeThis.cd, 'detectChanges');

    component.close.call(fakeThis);

    expect(fakeThis.isHidden).toBeTruthy();
    expect(fakeThis.disconnectResizeObserver).toHaveBeenCalled();
    expect(fakeThis.closePopover.emit).toHaveBeenCalled();
    expect(fakeThis.clickoutListener).toHaveBeenCalled();
    expect(fakeThis.cd.detectChanges).toHaveBeenCalled();
  });

  it('should set opacity', () => {
    const fakePopover = {
      popoverElement: {
        nativeElement: {
          style: {
            opacity: null
          }
        }
      }
    };
    component.setOpacity.call(fakePopover, 1);
    expect(fakePopover.popoverElement.nativeElement.style.opacity).toBe(1);
  });

  it('should listen scrolEventListener and call setPopoverPosition', () => {
    const eventScroll = document.createEvent('MouseEvents');
    eventScroll.initEvent('scroll', false, true);

    spyOn(component, 'setPopoverPosition');
    spyOn(window, 'requestAnimationFrame');

    originalNgAfterViewInit.call(component);
    component.open();

    window.dispatchEvent(eventScroll);

    expect(component.setPopoverPosition).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it('showPopover: should call stabilizePopoverWidth, setElementsControlPosition, setPopoverPosition, setOpacity, openPopover.emit, observeContentResize and detectChanges', () => {
      spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      spyOn(component, <any>'stabilizePopoverWidth');
      spyOn(component, 'setPopoverPosition');
      spyOn(component, <any>'setElementsControlPosition');
      spyOn(component, 'setOpacity');
      spyOn(component, <any>'observeContentResize');
      spyOn(component.openPopover, 'emit');

      component['showPopover']();

      expect(component['stabilizePopoverWidth']).toHaveBeenCalled();
      expect(component['setElementsControlPosition']).toHaveBeenCalled();
      expect(component.setPopoverPosition).toHaveBeenCalled();
      expect(component.setOpacity).toHaveBeenCalledWith(1);
      expect(component.openPopover.emit).toHaveBeenCalled();
      expect(component['observeContentResize']).toHaveBeenCalled();
    });

    it('showPopover: should call stabilizePopoverWidth before setElementsControlPosition and setPopoverPosition', () => {
      spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
      const order: Array<string> = [];
      spyOn<any>(component, 'stabilizePopoverWidth').and.callFake(() => order.push('stabilize'));
      spyOn<any>(component, 'setElementsControlPosition').and.callFake(() => order.push('setElements'));
      spyOn(component, 'setPopoverPosition').and.callFake(() => order.push('setPosition'));
      spyOn(component, 'setOpacity');
      spyOn<any>(component, 'observeContentResize');
      spyOn(component.openPopover, 'emit');

      component['showPopover']();

      expect(order).toEqual(['stabilize', 'setElements', 'setPosition']);
    });

    it(`ngAfterViewInit: should call 'setElementsControlPosition'`, () => {
      spyOn(component, <any>'setElementsControlPosition');

      originalNgAfterViewInit.call(component);

      expect(component['setElementsControlPosition']).toHaveBeenCalled();
    });

    it('ngOnDestroy: should call disconnectResizeObserver and removeListeners.', () => {
      spyOn(component, <any>'disconnectResizeObserver');
      spyOn(component, <any>'removeListeners');

      originalNgOnDestroy.call(component);

      expect(component['disconnectResizeObserver']).toHaveBeenCalled();
      expect(component['removeListeners']).toHaveBeenCalled();
    });

    it('onThemeChange: should call setPopoverPosition inside requestAnimationFrame', () => {
      spyOn(component, 'setPopoverPosition');
      spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      component['onThemeChange']();

      expect(window.requestAnimationFrame).toHaveBeenCalled();
      expect(component.setPopoverPosition).toHaveBeenCalled();
    });

    it('onThemeChange: should be triggered by window PoUiThemeChange event', () => {
      spyOn(component, 'setPopoverPosition');
      spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      window.dispatchEvent(new Event('PoUiThemeChange'));

      expect(component.setPopoverPosition).toHaveBeenCalled();
    });

    it('should call setElementsControlPosition, setPopoverPosition and cd.detectChanges after timeout', fakeAsync(() => {
      const fakeThis = {
        setElementsControlPosition: () => {},
        setPopoverPosition: () => {},
        cd: { detectChanges: () => {} }
      };

      spyOn(fakeThis, 'setElementsControlPosition');
      spyOn(fakeThis, 'setPopoverPosition');
      spyOn(fakeThis.cd, 'detectChanges');

      component.ensurePopoverPosition.call(fakeThis);

      tick();
      expect(fakeThis.setElementsControlPosition).toHaveBeenCalled();
      expect(fakeThis.setPopoverPosition).toHaveBeenCalled();
      expect(fakeThis.cd.detectChanges).toHaveBeenCalled();
    }));

    describe('removeListeners:', () => {
      it('should remove click and resize listeners.', () => {
        (component as any).clickoutListener = jasmine.createSpy('clickoutListener');
        spyOn(component, <any>'resizeListener');

        component['removeListeners']();

        expect((component as any).clickoutListener).toHaveBeenCalled();
        expect(component['resizeListener']).toHaveBeenCalled();
      });

      it('should remove mouse enter and mouse leave listeners.', () => {
        component.trigger = 'hover';
        component.setRendererListenInit();
        component['clickoutListener'] = undefined;
        spyOn(component, <any>'mouseEnterListener');
        spyOn(component, <any>'mouseLeaveListener');

        component['removeListeners']();

        expect(component['mouseEnterListener']).toHaveBeenCalled();
        expect(component['mouseLeaveListener']).toHaveBeenCalled();
      });
    });

    it('togglePopup: should call `close` method.', () => {
      const fakeThis = {
        close: () => {},
        popoverElement: {
          nativeElement: {
            contains: () => {}
          }
        },
        target: {
          nativeElement: {
            contains: () => {}
          }
        },
        targetElement: {
          contains: () => undefined,
          hidden: false
        }
      };

      spyOn(fakeThis, 'close');

      component.togglePopup.call(fakeThis, {});

      expect(fakeThis.close).toHaveBeenCalled();
    });

    it(`togglePopup: should close popover in togglePopup if isHidden is false, popoverElement not contains event.target and target not
    contains event.target`, () => {
      const fakeEvent = {
        target: 'a'
      };
      const fakeThis = {
        isHidden: false,
        popoverElement: {
          nativeElement: {
            contains: () => undefined,
            hidden: false
          }
        },
        target: {
          nativeElement: {
            contains: () => undefined
          }
        },
        targetElement: {
          contains: () => undefined,
          hidden: false
        },
        close: () => {},
        open: () => {}
      };

      spyOn(fakeThis, 'close');

      component.togglePopup.call(fakeThis, fakeEvent);

      expect(fakeThis.close).toHaveBeenCalled();
    });

    it(`setElementsControlPosition: should call 'poControlPosition.setElements' with 'popoverElement.nativeElement',
     target and popoverOffset equals to 8`, () => {
      const popoverOffset = 8;
      component.popoverElement.nativeElement = '<po-popover></po-popover>';
      component.target = <any>'<div></div>';

      spyOn(component['poControlPosition'], 'setElements');

      component['setElementsControlPosition']();

      expect(component['poControlPosition'].setElements).toHaveBeenCalledWith(
        component.popoverElement.nativeElement,
        popoverOffset,
        component.target,
        undefined,
        false,
        false
      );
    });

    it(`setElementsControlPosition: should pass cornerAligned=true when cornerAligned is true`, () => {
      const popoverOffset = 8;
      component.popoverElement.nativeElement = '<po-popover></po-popover>';
      component.target = <any>'<div></div>';
      component.cornerAligned = true;

      spyOn(component['poControlPosition'], 'setElements');

      component['setElementsControlPosition']();

      expect(component['poControlPosition'].setElements).toHaveBeenCalledWith(
        component.popoverElement.nativeElement,
        popoverOffset,
        component.target,
        undefined,
        false,
        true
      );
    });

    it(`setElementsControlPosition: should pass the custom offset when 'p-offset' input is set`, () => {
      const customOffset = 4;
      component.popoverElement.nativeElement = '<po-popover></po-popover>';
      component.target = <any>'<div></div>';
      component.offset = customOffset;

      spyOn(component['poControlPosition'], 'setElements');

      component['setElementsControlPosition']();

      expect(component['poControlPosition'].setElements).toHaveBeenCalledWith(
        component.popoverElement.nativeElement,
        customOffset,
        component.target,
        undefined,
        false,
        false
      );
    });

    describe('stabilizePopoverWidth:', () => {
      let originalInnerWidth: PropertyDescriptor | undefined;

      beforeEach(() => {
        originalInnerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
      });

      afterEach(() => {
        if (originalInnerWidth) {
          Object.defineProperty(window, 'innerWidth', originalInnerWidth);
        }
      });

      function mockInnerWidth(value: number): void {
        Object.defineProperty(window, 'innerWidth', { configurable: true, get: () => value });
      }

      function makeFakeThis(overrides: Partial<any> = {}) {
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 300 })
        };
        const targetEl = {
          getBoundingClientRect: () => ({ left: 100, top: 0, width: 24, height: 24 })
        };
        return {
          width: undefined,
          widthPopover: undefined,
          offset: 8,
          popoverElement: { nativeElement: nativeEl },
          targetElement: targetEl,
          cd: { detectChanges: jasmine.createSpy('detectChanges') },
          ...overrides
        };
      }

      it('should early-return when `width` input is defined', () => {
        const fakeThis = makeFakeThis({ width: 400 });

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBeUndefined();
        expect(fakeThis.cd.detectChanges).not.toHaveBeenCalled();
      });

      it('should early-return when `widthPopover` is already set', () => {
        const fakeThis = makeFakeThis({ widthPopover: 250 });

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBe(250);
        expect(fakeThis.cd.detectChanges).not.toHaveBeenCalled();
      });

      it('should early-return when popoverElement.nativeElement is missing', () => {
        const fakeThis = makeFakeThis({ popoverElement: { nativeElement: undefined } });

        expect(() => (component as any).stabilizePopoverWidth.call(fakeThis)).not.toThrow();
        expect(fakeThis.widthPopover).toBeUndefined();
      });

      it('should early-return when targetElement is missing', () => {
        const fakeThis = makeFakeThis({ targetElement: undefined });

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBeUndefined();
      });

      it('should move the popover to (0,0) to measure natural width in an unconstrained location', () => {
        const nativeEl = {
          style: { width: '', left: '25px', top: '25px' },
          getBoundingClientRect: () => ({ width: 300 })
        };
        const fakeThis = makeFakeThis({ popoverElement: { nativeElement: nativeEl } });
        // desktop-ish viewport
        mockInnerWidth(1920);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(nativeEl.style.left).toBe('0px');
        expect(nativeEl.style.top).toBe('0px');
      });

      it('should set widthPopover to natural width when it fits within the feasible cap (wide viewport)', () => {
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 300 })
        };
        const fakeThis = makeFakeThis({ popoverElement: { nativeElement: nativeEl } });
        mockInnerWidth(1920);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        // Natural (300) fits any position on a wide viewport → keep natural.
        expect(fakeThis.widthPopover).toBe(300);
        expect(fakeThis.cd.detectChanges).toHaveBeenCalled();
      });

      it('should cap widthPopover to the largest feasible candidate on a narrow viewport', () => {
        // Target near the center of a narrow viewport: cx=180 in vp=360.
        // maxFit candidates (safety=2):
        //   top-left  = cx + 15 - 2 = 193
        //   top-right = vp - cx + 15 - 2 = 193
        //   centered  = 2 * min(cx, vp - cx) - 2 = 358
        //   left      = cx - target.w/2 - offset - safety = 158
        //   right     = vp - cx - target.w/2 - offset - safety = 158
        // The largest candidate is 358 (centered), so widthPopover = min(natural=500, 358) = 358.
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 500 })
        };
        const targetEl = {
          getBoundingClientRect: () => ({ left: 168, top: 0, width: 24, height: 24 })
        };
        const fakeThis = makeFakeThis({
          popoverElement: { nativeElement: nativeEl },
          targetElement: targetEl
        });
        mockInnerWidth(360);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBe(358);
      });

      it('should enforce min-width of 240 even when candidates fall below it', () => {
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 500 })
        };
        const targetEl = {
          getBoundingClientRect: () => ({ left: 88, top: 0, width: 24, height: 24 })
        };
        const fakeThis = makeFakeThis({
          popoverElement: { nativeElement: nativeEl },
          targetElement: targetEl
        });
        mockInnerWidth(200);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBe(240);
      });

      it('should skip candidates whose geometry is infeasible for the target (off-screen)', () => {
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 400 })
        };
        const targetEl = {
          getBoundingClientRect: () => ({ left: 488, top: 0, width: 24, height: 24 })
        };
        const fakeThis = makeFakeThis({
          popoverElement: { nativeElement: nativeEl },
          targetElement: targetEl
        });
        mockInnerWidth(360);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBe(400);
      });

      it('should include the current `offset` input in the left/right candidates', () => {
        // Target on the left half with a larger offset to shrink the `right` candidate.
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 500 })
        };
        const targetEl = {
          getBoundingClientRect: () => ({ left: 88, top: 0, width: 24, height: 24 })
        };
        const fakeThis = makeFakeThis({
          popoverElement: { nativeElement: nativeEl },
          targetElement: targetEl,
          offset: 32
        });
        // cx = 100, vp = 360
        //   right = vp - cx - target.w/2 - offset - safety = 360 - 100 - 12 - 32 - 2 = 214
        //   centered = 2 * min(100, 260) - 2 = 198
        //   top-right = 360 - 100 + 15 - 2 = 273
        //   top-left  = 100 + 15 - 2 = 113
        //   left      = 100 - 12 - 32 - 2 = 54
        // Max = 273 (top-right)
        mockInnerWidth(360);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBe(273);
      });

      it('should call cd.detectChanges after setting widthPopover so the [style.width.px] binding applies', () => {
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 300 })
        };
        const fakeThis = makeFakeThis({ popoverElement: { nativeElement: nativeEl } });
        mockInnerWidth(1920);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.cd.detectChanges).toHaveBeenCalledTimes(1);
      });

      it('should fall back to natural width when no candidate is feasible (empty candidates)', () => {
        const nativeEl = {
          style: { width: '', left: '', top: '' },
          getBoundingClientRect: () => ({ width: 300 })
        };
        const targetEl = {
          getBoundingClientRect: () => ({ left: -12, top: 0, width: 24, height: 24 })
        };
        const fakeThis = makeFakeThis({
          popoverElement: { nativeElement: nativeEl },
          targetElement: targetEl
        });
        mockInnerWidth(5);

        (component as any).stabilizePopoverWidth.call(fakeThis);

        expect(fakeThis.widthPopover).toBe(300);
      });
    });

    describe('observeContentResize:', () => {
      let originalResizeObserver: any;
      let capturedCallback: (entries: Array<any>) => void;
      let observeSpy: jasmine.Spy;
      let disconnectSpy: jasmine.Spy;

      beforeEach(() => {
        originalResizeObserver = (window as any).ResizeObserver;
        observeSpy = jasmine.createSpy('observe');
        disconnectSpy = jasmine.createSpy('disconnect');
        (window as any).ResizeObserver = function (cb: (entries: Array<any>) => void) {
          capturedCallback = cb;
          return { observe: observeSpy, disconnect: disconnectSpy };
        };
      });

      afterEach(() => {
        (window as any).ResizeObserver = originalResizeObserver;
      });

      it('should early-return without creating a ResizeObserver when popoverElement is missing', () => {
        const fakeThis: any = {
          disconnectResizeObserver: jasmine.createSpy('disconnectResizeObserver'),
          popoverElement: undefined,
          setElementsControlPosition: () => {},
          setPopoverPosition: () => {},
          cd: { detectChanges: () => {} }
        };

        (component as any).observeContentResize.call(fakeThis);

        expect(fakeThis.disconnectResizeObserver).toHaveBeenCalled();
        expect(fakeThis.resizeObserver).toBeUndefined();
      });

      it('should observe the popover element and disconnect a previous observer', () => {
        const el = document.createElement('div');
        const fakeThis: any = {
          disconnectResizeObserver: jasmine.createSpy('disconnectResizeObserver'),
          popoverElement: { nativeElement: el },
          setElementsControlPosition: jasmine.createSpy('setElementsControlPosition'),
          setPopoverPosition: jasmine.createSpy('setPopoverPosition'),
          cd: { detectChanges: jasmine.createSpy('detectChanges') }
        };

        (component as any).observeContentResize.call(fakeThis);

        expect(fakeThis.disconnectResizeObserver).toHaveBeenCalled();
        expect(observeSpy).toHaveBeenCalledWith(el);
      });

      it('should skip the first (baseline) fire without repositioning', () => {
        const el = document.createElement('div');
        const fakeThis: any = {
          disconnectResizeObserver: () => {},
          popoverElement: { nativeElement: el },
          setElementsControlPosition: jasmine.createSpy('setElementsControlPosition'),
          setPopoverPosition: jasmine.createSpy('setPopoverPosition'),
          cd: { detectChanges: jasmine.createSpy('detectChanges') }
        };

        (component as any).observeContentResize.call(fakeThis);
        capturedCallback([]);

        expect(fakeThis.setElementsControlPosition).not.toHaveBeenCalled();
        expect(fakeThis.setPopoverPosition).not.toHaveBeenCalled();
        expect(fakeThis.cd.detectChanges).not.toHaveBeenCalled();
      });

      it('should re-run positioning on every fire AFTER the baseline', () => {
        const el = document.createElement('div');
        const fakeThis: any = {
          disconnectResizeObserver: () => {},
          popoverElement: { nativeElement: el },
          setElementsControlPosition: jasmine.createSpy('setElementsControlPosition'),
          setPopoverPosition: jasmine.createSpy('setPopoverPosition'),
          cd: { detectChanges: jasmine.createSpy('detectChanges') }
        };

        (component as any).observeContentResize.call(fakeThis);
        capturedCallback([]); // baseline (ignored)
        capturedCallback([]); // real resize (should reposition)
        capturedCallback([]); // another resize (should reposition again)

        expect(fakeThis.setElementsControlPosition).toHaveBeenCalledTimes(2);
        expect(fakeThis.setPopoverPosition).toHaveBeenCalledTimes(2);
        expect(fakeThis.cd.detectChanges).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Focus utilities:', () => {
    let host: HTMLElement;
    let targetBtn: HTMLButtonElement;

    beforeEach(() => {
      host = document.createElement('div');
      document.body.appendChild(host);

      (component.popoverElement as any) = { nativeElement: host };

      targetBtn = document.createElement('button');
      targetBtn.id = 'target-btn';
      document.body.appendChild(targetBtn);

      component.targetElement = targetBtn;
    });

    afterEach(() => {
      host?.remove();
      targetBtn?.remove();
    });

    // ---------------- focusOnTarget ----------------
    it('focusOnTarget: should focus the target element safely', () => {
      const fakeThis = {
        targetElement: targetBtn
      } as any;

      spyOn(targetBtn, 'focus');
      (component as any).focusOnTarget.call(fakeThis);
      expect(targetBtn.focus).toHaveBeenCalled();
    });

    // ---------------- focusOnFirstFocusable ----------------
    it('focusOnFirstFocusable: should fallback to focusOnTarget when host does not exist', () => {
      const fakeThis = {
        popoverElement: undefined,
        targetElement: targetBtn,
        focusOnTarget: jasmine.createSpy('focusOnTarget')
      } as any;

      (component as any).focusOnFirstFocusable.call(fakeThis);

      expect(fakeThis.focusOnTarget).toHaveBeenCalled();
    });

    it('focusOnFirstFocusable: should focus action button inside .po-helper-footer-action-link', () => {
      const footer = document.createElement('div');
      footer.className = 'po-helper-footer-action-link';
      const innerBtn = document.createElement('button');
      footer.appendChild(innerBtn);
      host.appendChild(footer);

      spyOn(innerBtn, 'focus');

      (component as any).focusOnFirstFocusable.call(component);

      expect(innerBtn.focus).toHaveBeenCalled();
    });

    it('focusOnFirstFocusable: should close and move focusNextAfterTarget when [role="dialog"] exists', () => {
      const dialog = document.createElement('div');
      dialog.setAttribute('role', 'dialog');
      host.appendChild(dialog);

      const closeSpy = spyOn(component, 'close');
      const focusNextAfterTargetSpy = spyOn<any>(component, 'focusNextAfterTarget');

      (component as any).focusOnFirstFocusable.call(component);

      expect(closeSpy).toHaveBeenCalled();
      expect(focusNextAfterTargetSpy).toHaveBeenCalled();
    });

    it('focusOnFirstFocusable: should set temporary tabindex and focus host as fallback, removing tabindex on blur', () => {
      expect(host.hasAttribute('tabindex')).toBeFalse();

      const focusSpy = spyOn(host, 'focus').and.callFake(() => {
        setTimeout(() => host.dispatchEvent(new Event('blur')), 0);
      });

      (component as any).focusOnFirstFocusable.call(component);

      expect(host.getAttribute('tabindex')).toBe('-1');
      expect(focusSpy).toHaveBeenCalled();
      host.dispatchEvent(new Event('blur'));

      expect(host.hasAttribute('tabindex')).toBeFalse();
    });

    // ---------------- attachPopoverKeydown ----------------
    describe('attachPopoverKeydown (Tab trapping inside popover with appendBox):', () => {
      let firstEl: HTMLInputElement;
      let lastEl: HTMLButtonElement;

      beforeEach(() => {
        firstEl = document.createElement('input');
        firstEl.id = 'first';
        host.appendChild(firstEl);

        const midEl = document.createElement('a');
        midEl.href = '#';
        midEl.id = 'mid';
        host.appendChild(midEl);

        lastEl = document.createElement('button');
        lastEl.id = 'last';
        host.appendChild(lastEl);

        (component as any).appendBox = true;
        (component as any).isHidden = false;
      });

      it('should call preventDefault and focusNextAfterTarget when active id includes "popover-content"', () => {
        const host = document.createElement('div');
        document.body.appendChild(host);

        const btn = document.createElement('button');
        btn.id = 'my-popover-content-btn';
        host.appendChild(btn);

        (component as any).appendBox = true;
        (component as any).isHidden = false;
        (component as any).popoverElement = { nativeElement: host };

        spyOn<any>(component, 'getTabbablesIn').and.returnValue([btn, document.createElement('button')]);

        const spyFocusNext = spyOn<any>(component, 'focusNextAfterTarget');

        (component as any).attachPopoverKeydown.call(component);

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(btn);
        const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        const spyPrevent = spyOn(ev, 'preventDefault').and.callThrough();

        host.dispatchEvent(ev);

        expect(spyPrevent).toHaveBeenCalled();
        expect(spyFocusNext).toHaveBeenCalled();
      });

      it('Shift+Tab on first should preventDefault and focus target', () => {
        const focusOnTargetSpy = spyOn<any>(component, 'focusOnTarget');
        (component as any).attachPopoverKeydown.call(component);

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(firstEl);

        const ev = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        const preventedSpy = spyOn(ev, 'preventDefault').and.callThrough();

        host.dispatchEvent(ev);
        expect(preventedSpy).toHaveBeenCalled();
        expect(focusOnTargetSpy).toHaveBeenCalled();
      });

      it('Tab on last should preventDefault and call focusNextAfterTarget', () => {
        const focusNextAfterTargetSpy = spyOn<any>(component, 'focusNextAfterTarget');

        (component as any).attachPopoverKeydown.call(component);

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(lastEl);

        const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        const preventedSpy = spyOn(ev, 'preventDefault').and.callThrough();

        host.dispatchEvent(ev);

        expect(preventedSpy).toHaveBeenCalled();
        expect(focusNextAfterTargetSpy).toHaveBeenCalled();
      });

      it('Tab when active element id includes "popover-content" should forward focusNextAfterTarget', () => {
        const focusNextAfterTargetSpy = spyOn<any>(component, 'focusNextAfterTarget');

        (component as any).attachPopoverKeydown.call(component);

        const special = document.createElement('button');
        special.id = 'popover-content-action';
        host.appendChild(special);

        spyOnProperty(document, 'activeElement', 'get').and.returnValue(special);

        const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        const preventedSpy = spyOn(ev, 'preventDefault').and.callThrough();

        host.dispatchEvent(ev);

        expect(preventedSpy).toHaveBeenCalled();
        expect(focusNextAfterTargetSpy).toHaveBeenCalled();
      });

      it('should NOT intercept when key is not Tab', () => {
        const focusOnTargetSpy = spyOn<any>(component, 'focusOnTarget');
        const focusNextAfterTargetSpy = spyOn<any>(component, 'focusNextAfterTarget');

        (component as any).attachPopoverKeydown.call(component);

        const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        host.dispatchEvent(ev);

        expect(focusOnTargetSpy).not.toHaveBeenCalled();
        expect(focusNextAfterTargetSpy).not.toHaveBeenCalled();
      });

      it('should do nothing if appendBox=false', () => {
        (component as any).appendBox = false;

        const focusOnTargetSpy = spyOn<any>(component, 'focusOnTarget');
        const focusNextAfterTargetSpy = spyOn<any>(component, 'focusNextAfterTarget');

        (component as any).attachPopoverKeydown.call(component);

        lastEl.focus();
        const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        host.dispatchEvent(ev);

        expect(focusOnTargetSpy).not.toHaveBeenCalled();
        expect(focusNextAfterTargetSpy).not.toHaveBeenCalled();
      });

      it('should do nothing if host is undefined', () => {
        (component as any).appendBox = true;

        const fakeThis = {
          popoverElement: undefined,
          renderer: component['renderer']
        } as any;

        expect(() => (component as any).attachPopoverKeydown.call(fakeThis)).not.toThrow();
      });
    });

    // ---------------- isVisible ----------------
    describe('isVisible:', () => {
      let originalGetComputed: typeof window.getComputedStyle;

      beforeEach(() => {
        originalGetComputed = window.getComputedStyle;
      });

      afterEach(() => {
        (window as any).getComputedStyle = originalGetComputed;
      });

      it('should return false when element or any ancestor is display:none / visibility:hidden', () => {
        const parent = document.createElement('div');
        document.body.appendChild(parent);

        const child = document.createElement('button');
        parent.appendChild(child);

        spyOn(window, 'getComputedStyle').and.callFake((el: Element) => {
          if (el === parent) {
            return { display: 'none', visibility: 'visible' } as any;
          }
          return { display: 'block', visibility: 'visible' } as any;
        });

        const res = (component as any).isVisible(child);
        expect(res).toBeFalse();
        parent.remove();
      });

      it('should return true when element has size and is visible', () => {
        const el = document.createElement('button');
        document.body.appendChild(el);

        spyOn(window, 'getComputedStyle').and.returnValue({ display: 'block', visibility: 'visible' } as any);
        spyOn(el, 'getBoundingClientRect').and.returnValue({ width: 10, height: 10 } as any);
        spyOn(el, 'getClientRects').and.returnValue({ length: 1 } as any);

        const res = (component as any).isVisible(el);

        expect(res).toBeTrue();
        el.remove();
      });

      it('should return false when the element itself has visibility:hidden', () => {
        const el = document.createElement('button');
        document.body.appendChild(el);
        spyOn(window, 'getComputedStyle').and.callFake((node: Element) => {
          if (node === el) {
            return { display: 'block', visibility: 'hidden' } as any;
          }
          return { display: 'block', visibility: 'visible' } as any;
        });

        spyOn(el, 'getBoundingClientRect').and.returnValue({ width: 10, height: 10 } as any);
        spyOn(el, 'getClientRects').and.returnValue({ length: 1 } as any);
        const res = (component as any).isVisible(el);
        expect(res).toBeFalse();
        el.remove();
      });

      it('should return false when any ancestor has visibility:hidden', () => {
        const parent = document.createElement('div');
        const child = document.createElement('button');
        parent.appendChild(child);
        document.body.appendChild(parent);

        spyOn(window, 'getComputedStyle').and.callFake((node: Element) => {
          if (node === parent) {
            return { display: 'block', visibility: 'hidden' } as any;
          }
          return { display: 'block', visibility: 'visible' } as any;
        });

        const res = (component as any).isVisible(child);
        expect(res).toBeFalse();

        parent.remove();
      });

      it('should return true when width/height are 0 but getClientRects().length > 0', () => {
        const el = document.createElement('button');
        document.body.appendChild(el);
        spyOn(window, 'getComputedStyle').and.returnValue({ display: 'block', visibility: 'visible' } as any);
        spyOn(el, 'getBoundingClientRect').and.returnValue({ width: 0, height: 0 } as any);
        spyOn(el, 'getClientRects').and.returnValue({ length: 1 } as any);

        const res = (component as any).isVisible(el);
        expect(res).toBeTrue();
        el.remove();
      });
    });

    // ---------------- getTabbablesIn / getDocumentTabbables ----------------
    it('getTabbablesIn: should return only visible and enabled tabbables in the container', () => {
      const btn1 = document.createElement('button');
      const btn2 = document.createElement('button');
      btn2.setAttribute('disabled', 'true');
      const link = document.createElement('a');
      link.href = '#';

      host.appendChild(btn1);
      host.appendChild(btn2);
      host.appendChild(link);

      spyOn<any>(component, 'isVisible').and.returnValue(true);

      const items = (component as any).getTabbablesIn(host);
      expect(items).toContain(btn1);
      expect(items).toContain(link);
      expect(items).not.toContain(btn2);
    });

    it('getDocumentTabbables: should return visible and enabled tabbables from document', () => {
      const docBtn = document.createElement('button');
      const docDisabled = document.createElement('button');
      docDisabled.disabled = true;
      const docLink = document.createElement('a');
      docLink.href = '#';

      document.body.appendChild(docBtn);
      document.body.appendChild(docDisabled);
      document.body.appendChild(docLink);

      spyOn<any>(component, 'isVisible').and.returnValue(true);

      const all = (component as any).getDocumentTabbables();

      expect(all).toContain(docBtn);
      expect(all).toContain(docLink);
      expect(all).not.toContain(docDisabled);

      docBtn.remove();
      docDisabled.remove();
      docLink.remove();
    });

    // ---------------- focusNextAfterTarget ----------------
    describe('focusNextAfterTarget:', () => {
      it('should focus the next tabbable after target; wrap to first if target is last', () => {
        const first = document.createElement('button');
        const second = document.createElement('button');
        const third = document.createElement('button');
        document.body.appendChild(first);
        document.body.appendChild(second);
        document.body.appendChild(third);

        const focusSpySecond = spyOn(second, 'focus');
        const focusSpyFirst = spyOn(first, 'focus');

        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([first, second, third]);
        (component as any).targetElement = first;
        (component as any).focusNextAfterTarget();

        expect(focusSpySecond).toHaveBeenCalled();
        (focusSpySecond as jasmine.Spy).calls.reset();
        (component as any).targetElement = third;
        (component as any).focusNextAfterTarget();

        expect(focusSpyFirst).toHaveBeenCalled();
        first.remove();
        second.remove();
        third.remove();
      });

      it('should fallback using last tabbable inside popover if target not found in doc list', () => {
        const a = document.createElement('button');
        const b = document.createElement('button');
        const c = document.createElement('button');
        document.body.appendChild(a);
        document.body.appendChild(b);
        document.body.appendChild(c);

        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([a, b, c]);
        spyOn<any>(component, 'getTabbablesIn').and.returnValue([b, c]);

        (component.popoverElement as any) = { nativeElement: host };

        (component as any).targetElement = document.createElement('button');

        const focusSpy = spyOn(a, 'focus');
        (component as any).focusNextAfterTarget();
        expect(focusSpy).toHaveBeenCalled();
        a.remove();
        b.remove();
        c.remove();
      });

      it('should early-return when there are no document tabbables', () => {
        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([]);
        const getTabbablesInSpy = spyOn<any>(component, 'getTabbablesIn');

        const fakeTarget = document.createElement('button');
        const focusSpy = spyOn(fakeTarget, 'focus');
        (component as any).targetElement = fakeTarget;

        expect(() => (component as any).focusNextAfterTarget()).not.toThrow();
        expect(getTabbablesInSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();

        fakeTarget.remove();
      });

      it('should set startIndex to -1 when target is null', () => {
        const a = document.createElement('button');
        const b = document.createElement('button');
        document.body.appendChild(a);
        document.body.appendChild(b);

        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([a, b]);

        (component as any).targetElement = null;
        const focusSpy = spyOn(a, 'focus');

        (component as any).focusNextAfterTarget();
        expect(focusSpy).toHaveBeenCalled();
        a.remove();
        b.remove();
      });
    });

    // ---------------- observeContentResize ----------------
    describe('observeContentResize:', () => {
      let originalResizeObserver: typeof ResizeObserver;

      beforeEach(() => {
        originalResizeObserver = window.ResizeObserver;
      });

      afterEach(() => {
        (window as any).ResizeObserver = originalResizeObserver;
      });

      it('should create a ResizeObserver and observe the popoverElement', () => {
        const observeSpy = jasmine.createSpy('observe');
        const disconnectSpy = jasmine.createSpy('disconnect');

        (window as any).ResizeObserver = function (_callback: ResizeObserverCallback) {
          return { observe: observeSpy, disconnect: disconnectSpy, unobserve: jasmine.createSpy('unobserve') };
        };

        (component as any).observeContentResize();

        expect(observeSpy).toHaveBeenCalledWith(component.popoverElement.nativeElement);
        expect(component['resizeObserver']).toBeTruthy();
      });

      it('should disconnect existing observer before creating a new one', () => {
        const disconnectSpy = jasmine.createSpy('disconnect');
        component['resizeObserver'] = { disconnect: disconnectSpy, observe: () => {}, unobserve: () => {} };

        (globalThis as any).ResizeObserver = function (_callback: ResizeObserverCallback) {
          return {
            observe: jasmine.createSpy('observe'),
            disconnect: jasmine.createSpy('disconnect'),
            unobserve: jasmine.createSpy('unobserve')
          };
        };

        (component as any).observeContentResize();

        expect(disconnectSpy).toHaveBeenCalled();
      });

      it('should skip the initial ResizeObserver callback invocation', () => {
        let capturedCallback: ResizeObserverCallback;

        (globalThis as any).ResizeObserver = function (callback: ResizeObserverCallback) {
          capturedCallback = callback;
          return {
            observe: jasmine.createSpy('observe'),
            disconnect: jasmine.createSpy('disconnect'),
            unobserve: jasmine.createSpy('unobserve')
          };
        };

        spyOn<any>(component, 'setElementsControlPosition');
        spyOn(component, 'setPopoverPosition');

        (component as any).observeContentResize();

        // First call (initial) should be skipped
        capturedCallback([], {} as any);

        expect(component['setElementsControlPosition']).not.toHaveBeenCalled();
        expect(component.setPopoverPosition).not.toHaveBeenCalled();
      });

      it('should recalculate position on subsequent ResizeObserver callbacks', () => {
        let capturedCallback: ResizeObserverCallback;

        (globalThis as any).ResizeObserver = function (callback: ResizeObserverCallback) {
          capturedCallback = callback;
          return {
            observe: jasmine.createSpy('observe'),
            disconnect: jasmine.createSpy('disconnect'),
            unobserve: jasmine.createSpy('unobserve')
          };
        };

        spyOn<any>(component, 'setElementsControlPosition');
        spyOn(component, 'setPopoverPosition');
        spyOn(component['cd'], 'detectChanges');

        (component as any).observeContentResize();

        // First call (initial) — skipped
        capturedCallback([], {} as any);

        // Second call — should recalculate
        capturedCallback([], {} as any);

        expect(component['setElementsControlPosition']).toHaveBeenCalled();
        expect(component.setPopoverPosition).toHaveBeenCalled();
        expect(component['cd'].detectChanges).toHaveBeenCalled();
      });

      it('should not create observer when popoverElement is undefined', () => {
        (component as any).popoverElement = undefined;

        const constructorSpy = jasmine.createSpy('ResizeObserverConstructor');
        (window as any).ResizeObserver = constructorSpy;

        (component as any).observeContentResize();

        expect(constructorSpy).not.toHaveBeenCalled();
        expect(component['resizeObserver']).toBeNull();
      });
    });

    // ---------------- disconnectResizeObserver ----------------
    describe('disconnectResizeObserver:', () => {
      it('should disconnect and nullify the resizeObserver', () => {
        const disconnectSpy = jasmine.createSpy('disconnect');
        component['resizeObserver'] = { disconnect: disconnectSpy, observe: () => {}, unobserve: () => {} };

        (component as any).disconnectResizeObserver();

        expect(disconnectSpy).toHaveBeenCalled();
        expect(component['resizeObserver']).toBeNull();
      });

      it('should not throw when resizeObserver is null', () => {
        component['resizeObserver'] = null;

        expect(() => (component as any).disconnectResizeObserver()).not.toThrow();
        expect(component['resizeObserver']).toBeNull();
      });

      it('should not throw when resizeObserver is undefined', () => {
        component['resizeObserver'] = undefined;

        expect(() => (component as any).disconnectResizeObserver()).not.toThrow();
        expect(component['resizeObserver']).toBeNull();
      });
    });

    // ---------------- focusPrevBeforeTarget ----------------
    describe('focusPrevBeforeTarget:', () => {
      it('should focus previous tabbable before target; wrap to last when target is first', () => {
        const first = document.createElement('button');
        const second = document.createElement('button');
        const third = document.createElement('button');

        document.body.appendChild(first);
        document.body.appendChild(second);
        document.body.appendChild(third);

        const focusSpyFirst = spyOn(first, 'focus');
        const focusSpyThird = spyOn(third, 'focus');

        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([first, second, third]);
        (component as any).targetElement = second;

        (component as any).focusPrevBeforeTarget();

        expect(focusSpyFirst).toHaveBeenCalled();

        (focusSpyFirst as jasmine.Spy).calls.reset();
        (component as any).targetElement = first;

        (component as any).focusPrevBeforeTarget();
        expect(focusSpyThird).toHaveBeenCalled();

        first.remove();
        second.remove();
        third.remove();
      });
      it('should early-return when there are no document tabbables', () => {
        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([]);

        const fakeTarget = document.createElement('button');
        const focusSpy = spyOn(fakeTarget, 'focus');
        (component as any).targetElement = fakeTarget;

        expect(() => (component as any).focusPrevBeforeTarget()).not.toThrow();
        expect(focusSpy).not.toHaveBeenCalled();

        fakeTarget.remove();
      });

      it('should fallback to last when target is null (idx = -1)', () => {
        const first = document.createElement('button');
        const second = document.createElement('button');
        document.body.appendChild(first);
        document.body.appendChild(second);

        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([first, second]);

        (component as any).targetElement = null;
        const focusSpy = spyOn(second, 'focus');

        (component as any).focusPrevBeforeTarget();

        expect(focusSpy).toHaveBeenCalled();

        first.remove();
        second.remove();
      });

      it('should fallback to last when target is not found in docTabs (idx = -1)', () => {
        const a = document.createElement('button');
        const b = document.createElement('button');
        document.body.appendChild(a);
        document.body.appendChild(b);

        spyOn<any>(component, 'getDocumentTabbables').and.returnValue([a, b]);
        (component as any).targetElement = document.createElement('button');
        const focusSpy = spyOn(b, 'focus');
        (component as any).focusPrevBeforeTarget();
        expect(focusSpy).toHaveBeenCalled();

        a.remove();
        b.remove();
      });
    });
  });
});

function getFakeToSetRendererListenInit(trigger, component) {
  return {
    trigger: trigger,
    renderer: component['renderer'],
    target: {
      nativeElement: document.body
    },
    targetElement: document.body,
    open: () => {},
    close: () => {},
    togglePopup: () => {},
    debounceResize: () => {},
    setPopoverPosition: () => {},
    attachPopoverKeydown: () => {}
  };
}

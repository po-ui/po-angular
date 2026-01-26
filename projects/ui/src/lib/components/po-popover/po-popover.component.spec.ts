import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
      imports: [CommonModule],
      declarations: [PoPopoverComponent],
      providers: [PoControlPositionService],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPopoverComponent);
    component = fixture.componentInstance;

    const target = document.createElement('button');
    document.body.appendChild(target);
    component.target = target;

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
    component.ngAfterViewInit();
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
    const fakeThis = {
      addScrollEventListener: () => {},
      isHidden: true,
      position: 'top',
      openPopover: { emit: () => {} },
      setPopoverPosition: () => {},
      setElementsControlPosition: () => {},
      setOpacity: arg => {},
      cd: { detectChanges: () => {} }
    };

    spyOn(fakeThis, 'addScrollEventListener');
    spyOn(fakeThis, 'setOpacity');
    spyOn(fakeThis, 'setElementsControlPosition');
    spyOn(fakeThis.cd, 'detectChanges');
    component.open.call(fakeThis);

    tick(300);

    expect(fakeThis.isHidden).toBeFalsy();
    expect(fakeThis.addScrollEventListener).toHaveBeenCalled();
    expect(fakeThis.setOpacity).toHaveBeenCalledWith(1);
    expect(fakeThis.setElementsControlPosition).toHaveBeenCalled();
    expect(fakeThis.cd.detectChanges).toHaveBeenCalled();
  }));

  it('open: should set clickoutListener when trigger is function', () => {
    const fakeListener = jasmine.createSpy('listener');

    const fakeThis: any = {
      trigger: 'function',
      renderer: {
        listen: jasmine.createSpy('listen').and.callFake((_target, _event, callback) => {
          callback({} as MouseEvent);
          return fakeListener;
        })
      },
      togglePopup: jasmine.createSpy('togglePopup'),
      addScrollEventListener: () => {},
      setOpacity: () => {},
      setElementsControlPosition: () => {},
      setPopoverPosition: () => {},
      openPopover: { emit: () => {} },
      cd: { detectChanges: () => {} },
      isHidden: true
    };

    component.open.call(fakeThis);

    expect(fakeThis.renderer.listen).toHaveBeenCalledWith('document', 'click', jasmine.any(Function));
    expect(fakeThis.togglePopup).toHaveBeenCalled();
    expect(fakeThis.clickoutListener).toBe(fakeListener);
  });

  it('should close popover and call `closePopover.emit`', () => {
    spyOn(component.closePopover, 'emit');
    component.isHidden = false;

    component.close();

    expect(component.isHidden).toBeTruthy();
    expect(component.closePopover.emit).toHaveBeenCalled();
  });

  it('close: should call clickoutListener when trigger is function and clickoutListener exists', () => {
    const fakeThis = {
      isHidden: false,
      trigger: 'function',
      closePopover: { emit: () => {} },
      clickoutListener: () => {},
      cd: { detectChanges: () => {} }
    };

    spyOn(fakeThis.closePopover, 'emit');
    spyOn(fakeThis, 'clickoutListener');
    spyOn(fakeThis.cd, 'detectChanges');

    component.close.call(fakeThis);

    expect(fakeThis.isHidden).toBeTruthy();
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

    component.open();

    window.dispatchEvent(eventScroll);

    expect(component.setPopoverPosition).toHaveBeenCalled();
  });

  describe('Methods:', () => {
    it(`ngAfterViewInit: should call 'setElementsControlPosition'`, () => {
      spyOn(component, <any>'setElementsControlPosition');

      component.ngAfterViewInit();

      expect(component['setElementsControlPosition']).toHaveBeenCalled();
    });

    it('ngOnDestroy: should call removeListeners.', () => {
      spyOn(component, <any>'removeListeners');

      component.ngOnDestroy();

      expect(component['removeListeners']).toHaveBeenCalled();
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
        spyOn(component, <any>'clickoutListener');
        spyOn(component, <any>'resizeListener');

        component['removeListeners']();

        expect(component['clickoutListener']).toHaveBeenCalled();
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
        component.target
      );
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

        btn.focus();
        const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
        const spyPrevent = spyOn(ev, 'preventDefault').and.callThrough();

        host.dispatchEvent(ev);

        expect(spyPrevent).toHaveBeenCalled();
        expect(spyFocusNext).toHaveBeenCalled();
      });

      it('Shift+Tab on first should preventDefault and focus target', () => {
        const focusOnTargetSpy = spyOn<any>(component, 'focusOnTarget');
        (component as any).attachPopoverKeydown.call(component);

        firstEl.focus();
        expect(document.activeElement).toBe(firstEl);

        const ev = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true });
        const preventedSpy = spyOn(ev, 'preventDefault').and.callThrough();

        host.dispatchEvent(ev);
        expect(preventedSpy).toHaveBeenCalled();
        expect(focusOnTargetSpy).toHaveBeenCalled();
      });

      it('Tab on last should preventDefault and call focusNextAfterTarget', () => {
        const focusNextAfterTargetSpy = spyOn<any>(component, 'focusNextAfterTarget');

        (component as any).attachPopoverKeydown.call(component);

        lastEl.focus();
        expect(document.activeElement).toBe(lastEl);

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

        special.focus();
        expect(document.activeElement).toBe(special);

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

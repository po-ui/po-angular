import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
      declarations: [PoPopoverComponent],
      providers: [PoControlPositionService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPopoverComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;

    component.target = component.popoverElement;
    component.targetElement = component.popoverElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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
      setPopoverPosition: () => {},
      setElementsControlPosition: () => {},
      setOpacity: arg => {}
    };

    spyOn(fakeThis, 'addScrollEventListener');
    spyOn(fakeThis, 'setOpacity');
    spyOn(fakeThis, 'setElementsControlPosition');
    component.open.call(fakeThis);

    tick(300);

    expect(fakeThis.isHidden).toBeFalsy();
    expect(fakeThis.addScrollEventListener).toHaveBeenCalled();
    expect(fakeThis.setOpacity).toHaveBeenCalledWith(1);
    expect(fakeThis.setElementsControlPosition).toHaveBeenCalled();
  }));

  it('should close popover and call `closePopover.emit`', () => {
    spyOn(component.closePopover, 'emit');
    component.isHidden = false;

    component.close();

    expect(component.isHidden).toBeTruthy();
    expect(component.closePopover.emit).toHaveBeenCalled();
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

  describe('Templates:', () => {
    it('should display arrow.', () => {
      component.hideArrow = false;
      component.isHidden = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popover-arrow')).toBeTruthy();
    });

    it('shouldn´t display arrow.', () => {
      component.hideArrow = true;
      component.isHidden = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popover-arrow')).toBeFalsy();
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
    setPopoverPosition: () => {}
  };
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import * as UtilsFunction from '../../utils/util';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoDropdownComponent } from './po-dropdown.component';
import { PoPopupComponent } from '../po-popup';

describe('PoDropdownComponent: ', () => {
  let component: PoDropdownComponent;
  let fixture: ComponentFixture<PoDropdownComponent>;
  let nativeElement: any;

  const eventClick = document.createEvent('Event');
  eventClick.initEvent('click', false, true);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoDropdownComponent, PoPopupComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoDropdownComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`onKeyDown: should call 'toggleDropdown' if enter is typed.`, () => {
      const eventEnterKey = { keyCode: 13 };

      spyOn(component, 'toggleDropdown');
      component.onKeyDown(eventEnterKey);

      expect(component['toggleDropdown']).toHaveBeenCalled();
    });

    it(`onKeyDown: should call 'isKeyCodeEnter' if typed key is enter.`, () => {
      const eventEnterKey = { keyCode: 13 };

      spyOn(UtilsFunction, <any>'isKeyCodeEnter');
      component.onKeyDown(eventEnterKey);

      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`onKeyDown: shouldn't call 'toggleDropdown' if the typed key is not enter.`, () => {
      const eventDeleteKey = { keyCode: 46 };

      spyOn(UtilsFunction, <any>'isKeyCodeEnter');
      spyOn(component, 'toggleDropdown');
      component.onKeyDown(eventDeleteKey);

      expect(component.toggleDropdown).not.toHaveBeenCalled();
      expect(UtilsFunction['isKeyCodeEnter']).toHaveBeenCalled();
    });

    it(`toggleDropdown: should call 'showDropdown' and not call 'hideDropdown' if has dropdownRef, is close and enable.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = false;
      component.disabled = false;

      spyOn(component, <any>'showDropdown');
      spyOn(component, <any>'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).toHaveBeenCalled();
      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if dropdownRef is undefined.`, () => {
      component.dropdownRef = undefined;

      spyOn(component, <any>'showDropdown');
      spyOn(component, <any>'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).not.toHaveBeenCalled();
      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if has dropdownRef and is open.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = true;

      spyOn(component, <any>'showDropdown');
      spyOn(component, <any>'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).not.toHaveBeenCalled();
      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`toggleDropdown: shouldn't call 'showDropdown' and call 'hideDropdown' if has dropdownRef, is close and disabled.`, () => {
      component.dropdownRef = { nativeElement: 'value' };
      component['open'] = false;
      component.disabled = true;

      spyOn(component, <any>'showDropdown');
      spyOn(component, <any>'hideDropdown');

      component.toggleDropdown();

      expect(component['showDropdown']).not.toHaveBeenCalled();
      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`hideDropdown: should set icon with 'po-icon-arrow-down', call 'removeListeners', set 'open' to 'false'
    and call 'popupRef.close'.`, () => {
      const fakeThis = {
        icon: undefined,
        removeListeners: () => {},
        popupRef: {
          close: () => {}
        },
        open: undefined
      };

      spyOn(fakeThis, 'removeListeners');
      spyOn(fakeThis.popupRef, 'close');

      component[`hideDropdown`].call(fakeThis);

      expect(fakeThis.icon).toBe('po-icon-arrow-down');
      expect(fakeThis.removeListeners).toHaveBeenCalled();
      expect(fakeThis.popupRef.close).toHaveBeenCalled();
      expect(fakeThis.open).toBe(false);
    });

    it('initializeListeners: should initialize click, resize and scroll listeners.', () => {
      const wasClickedOnDropdown = spyOn(component, <any>'wasClickedOnDropdown');
      const hideDropdown = spyOn(component, <any>'hideDropdown');
      const addEventListener = spyOn(window, 'addEventListener');
      const listen = spyOn(component['renderer'], <any>'listen').and.callFake((target, eventName, callback) =>
        callback()
      );

      component['initializeListeners']();

      expect(wasClickedOnDropdown).toHaveBeenCalled();
      expect(hideDropdown).toHaveBeenCalled();
      expect(addEventListener).toHaveBeenCalled();
      expect(listen).toHaveBeenCalled();
    });

    it('onScroll: should call `hideDropdown` if `open` is `true`', () => {
      component['open'] = true;
      spyOn(component, <any>'hideDropdown');

      component['onScroll']({ target: {} });

      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `hideDropdown` if `open` is `false`', () => {
      component['open'] = false;
      spyOn(component, <any>'hideDropdown');

      component['onScroll']({ target: {} });

      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `hideDropdown` if `open` is true and target.className is `po-popup-container`', () => {
      const fakeEvent = { target: { className: 'po-popup-container' } };
      component['open'] = true;

      spyOn(component, <any>'hideDropdown');

      component['onScroll'](fakeEvent);

      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });

    describe('removeListeners:', () => {
      it('should remove click, resize and scroll listeners.', () => {
        component['clickoutListener'] = () => {};
        component['resizeListener'] = () => {};

        spyOn(component, <any>'clickoutListener');
        spyOn(component, <any>'resizeListener');
        spyOn(window, 'removeEventListener');

        component['removeListeners']();

        expect(component['clickoutListener']).toHaveBeenCalled();
        expect(component['resizeListener']).toHaveBeenCalled();
        expect(window.removeEventListener).toHaveBeenCalled();
      });

      it('should not remove click, if resize and scroll listeners are undefined', () => {
        component['clickoutListener'] = undefined;
        component['resizeListener'] = undefined;

        spyOn(window, 'removeEventListener');

        component['removeListeners']();

        expect(window.removeEventListener).toHaveBeenCalled();
      });
    });

    it(`showDropdown: should set icon with 'po-icon-arrow-up', call 'initializeListeners' set 'open' to 'false'
    and call 'popupRef.close'.`, () => {
      const fakeThis = {
        icon: undefined,
        initializeListeners: () => {},
        popupRef: {
          open: () => {}
        },
        open: undefined
      };

      spyOn(fakeThis, 'initializeListeners');
      spyOn(fakeThis.popupRef, 'open');

      component[`showDropdown`].call(fakeThis);

      expect(fakeThis.icon).toBe('po-icon-arrow-up');
      expect(fakeThis.initializeListeners).toHaveBeenCalled();
      expect(fakeThis.popupRef.open).toHaveBeenCalled();
      expect(fakeThis.open).toBe(true);
    });

    it(`wasClickedOnDropdown: should call 'hideDropdown' if 'checkClickArea' return 'false'.`, () => {
      const fakeEvent: any = {
        target: ''
      };

      const dropdownRef = {
        nativeElement: {
          contains: () => false
        }
      };
      component.dropdownRef = dropdownRef;

      spyOn(component, <any>'hideDropdown');

      component['wasClickedOnDropdown'](fakeEvent);

      expect(component['hideDropdown']).toHaveBeenCalled();
    });

    it(`wasClickedOnDropdown: shouldn't call 'hideDropdown' if 'checkClickArea' return 'true'.`, () => {
      const fakeEvent: any = {
        target: ''
      };
      const dropdownRef = {
        nativeElement: {
          contains: () => true
        }
      };
      component.dropdownRef = dropdownRef;

      spyOn(component, <any>'checkClickArea').and.returnValue(true);
      spyOn(component, <any>'hideDropdown');

      component['wasClickedOnDropdown'](fakeEvent);

      expect(component['hideDropdown']).not.toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it(`should apply -1 to 'tabindex' if 'disabled' is 'true'`, () => {
      component.disabled = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-dropdown[tabindex="-1"]')).toBeTruthy();
    });

    it(`should apply 0 to 'tabindex' if 'disabled' is 'false'`, () => {
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-dropdown[tabindex="0"]')).toBeTruthy();
    });

    it(`should call 'toggleDropdown' if click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      spyOn(component, 'toggleDropdown');

      poDropdown.dispatchEvent(eventClick);

      expect(component.toggleDropdown).toHaveBeenCalled();
    });

    it(`should call 'toggleDropdown' if press enter key in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      spyOn(component, 'onKeyDown');

      poDropdown.dispatchEvent(keyboardEvents('keydown', 13));

      expect(component.onKeyDown).toHaveBeenCalled();
    });

    it(`should have a class 'po-dropdown-button-disabled' if 'disabled' is 'true'`, () => {
      component.disabled = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-dropdown-button-disabled')).toBeTruthy();
    });

    it(`shouldn't have a class 'po-dropdown-button-disabled' if 'disabled' is 'false'`, () => {
      component.disabled = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-dropdown-button-disabled')).toBeNull();
    });

    it(`should have a class 'po-icon-arrow-up' if 'click' in 'po-dropdown'`, () => {
      const arrowDown = nativeElement.querySelector('.po-icon-arrow-down');
      const poDropdown = nativeElement.querySelector('.po-dropdown');

      expect(arrowDown).toBeTruthy();

      component.actions = [{ label: 'action1', action: () => {} }];

      fixture.detectChanges();

      poDropdown.dispatchEvent(eventClick);

      fixture.detectChanges();

      const arrowUp = nativeElement.querySelector('.po-icon-arrow-up');

      expect(arrowUp).toBeTruthy();
    });

    it(`should open a popup if have 'actions' and click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');
      component.actions = [{ label: 'action1', action: () => {} }];

      fixture.detectChanges();

      poDropdown.dispatchEvent(eventClick);

      expect(nativeElement.querySelector('.po-popup')).toBeTruthy();
    });

    it(`shouldn't open a popup if doesn't have 'actions' and click in 'po-dropdown'`, () => {
      const poDropdown = nativeElement.querySelector('.po-dropdown');
      component.actions = undefined;

      fixture.detectChanges();

      poDropdown.dispatchEvent(eventClick);

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup')).toBeNull();
    });
  });
});

function keyboardEvents(event: string, keyCode: number) {
  const eventKeyBoard = document.createEvent('KeyboardEvent');
  eventKeyBoard.initEvent(event, true, true);
  Object.defineProperty(eventKeyBoard, 'keyCode', { 'value': keyCode });
  return eventKeyBoard;
}

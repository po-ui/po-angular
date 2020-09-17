import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { configureTestSuite, expectPropertiesValues } from './../../util-test/util-expect.spec';

import * as UtilsFunctions from '../../utils/util';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';

import { PoPopupAction } from './po-popup-action.interface';
import { PoPopupComponent } from './po-popup.component';

describe('PoPopupComponent:', () => {
  let actions: Array<PoPopupAction>;
  let component: PoPopupComponent;
  let fixture: ComponentFixture<PoPopupComponent>;
  let nativeElement;

  const eventClick = document.createEvent('MouseEvents');
  eventClick.initEvent('click', false, true);

  const eventResize = document.createEvent('Event');
  eventResize.initEvent('resize', false, true);

  const fakeThis = {
    target: {
      contains: value => {
        const target = ['a', 'b'];
        return target.includes(value);
      }
    }
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoPopupComponent],
      providers: [PoControlPositionService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoPopupComponent);
    component = fixture.componentInstance;

    actions = [
      { label: 'teste1' },
      { label: 'teste2', separator: true, type: '' },
      { label: 'teste3', separator: true, type: 'danger' },
      { label: 'teste4', separator: true, visible: false }
    ];

    component.actions = actions;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties:', () => {
    it('actions: should update if values are valid.', () => {
      expectPropertiesValues(component, 'actions', [actions], [actions]);
    });

    it('actions: shouldn`t update if values are invalid.', () => {
      const valueInvalid = [undefined, 'menu', 123, true];

      expectPropertiesValues(component, 'actions', valueInvalid, []);
    });
  });

  describe('Methods:', () => {
    let popupItem;
    let event;

    beforeEach(() => {
      popupItem = { label: 'teste' };
      event = { target: {} };
    });

    it('clickoutListener: should call `closePopupOnClickout` on click in document', () => {
      component.open();
      fixture.detectChanges();

      spyOn(component, <any>'closePopupOnClickout');

      document.dispatchEvent(eventClick);

      fixture.detectChanges();

      expect(component['closePopupOnClickout']).toHaveBeenCalled();
    });

    it('resizeListener: should call `close` on resize window', () => {
      spyOn(component, <any>'close');

      component.open();
      fixture.detectChanges();

      window.dispatchEvent(eventResize);

      expect(component['close']).toHaveBeenCalled();
    });

    describe('onActionClick:', () => {
      it('should call `popupItem.action` if has popupItem and popupItem.action', () => {
        popupItem.action = () => {};

        const popupItemActionSpy = spyOn(popupItem, 'action');
        spyOn(component, <any>'openUrl');
        spyOn(component, 'close');

        component.onActionClick(popupItem);

        expect(component.close).toHaveBeenCalled();
        expect(popupItemActionSpy).toHaveBeenCalled();
        expect(component['openUrl']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `popupItem.action` if receives undefined as param', () => {
        popupItem.action = () => {};

        const popupItemActionSpy = spyOn(popupItem, 'action');
        spyOn(component, <any>'openUrl');
        spyOn(component, 'close');

        component.onActionClick(undefined);

        expect(component.close).not.toHaveBeenCalled();
        expect(popupItemActionSpy).not.toHaveBeenCalled();
        expect(component['openUrl']).not.toHaveBeenCalled();
      });

      it('shouldn`t call `popupItem.action` if has popupItem but doesn`t have popupItem.action and popupItem URL', () => {
        spyOn(component, <any>'openUrl');
        spyOn(component, 'close');

        const result = () => component.onActionClick(popupItem);

        expect(result).not.toThrowError();
        expect(component.close).not.toHaveBeenCalled();
        expect(component['openUrl']).not.toHaveBeenCalled();
      });

      it('should call `openUrl` if has a popupItem with URL and without action', () => {
        popupItem.url = 'http://www.fakeUrlPo.com';

        spyOn(component, <any>'openUrl');
        spyOn(component, 'close');

        component.onActionClick(popupItem);

        expect(component.close).toHaveBeenCalled();
        expect(component['openUrl']).toHaveBeenCalled();
      });
    });

    it('openUrl: should call `openExternalLink` but shouldn`t call `router.navigate`', () => {
      const url = 'http://www.fakeUrlPo.com';

      spyOn(UtilsFunctions, 'openExternalLink');
      spyOn(component['router'], 'navigate');

      component['openUrl'](url);

      expect(UtilsFunctions.openExternalLink).toHaveBeenCalledWith(url);
      expect(component['router'].navigate).not.toHaveBeenCalled();
    });

    it('openUrl: should call `router.navigate` if it`s an internal URL and shouldn`t call external URL', () => {
      const url = '/customers';

      spyOn(component['router'], 'navigate');
      spyOn(UtilsFunctions, 'openExternalLink');

      component['openUrl'](url);

      expect(component['router'].navigate).toHaveBeenCalled();
      expect(UtilsFunctions.openExternalLink).not.toHaveBeenCalledWith(url);
    });

    it('openUrl: shouldn`t call `router.navigate` and `openExternalLink` if URL is undefined ', () => {
      spyOn(component['router'], 'navigate');
      spyOn(UtilsFunctions, 'openExternalLink');

      component['openUrl'](undefined);

      expect(component['router'].navigate).not.toHaveBeenCalled();
      expect(UtilsFunctions.openExternalLink).not.toHaveBeenCalled();
    });

    it('removeListeners: should call `resizeListener` and `clickoutListener`', () => {
      component['initializeListeners']();

      spyOn(component, <any>'resizeListener');
      spyOn(component, <any>'clickoutListener');

      component['removeListeners']();

      expect(component['resizeListener']).toHaveBeenCalled();
      expect(component['clickoutListener']).toHaveBeenCalled();
    });

    it('removeListeners: shouldn`t call `resizeListener` and `clickoutListener`', () => {
      component['removeListeners']();

      expect(component['resizeListener']).toBeUndefined();
      expect(component['clickoutListener']).toBeUndefined();
    });

    it('open: should set `showPopup` to `true` and call `validateInitialContent`.', () => {
      component.showPopup = false;

      spyOn(component, <any>'validateInitialContent');

      component.open();

      expect(component.showPopup).toBe(true);
      expect(component['validateInitialContent']).toHaveBeenCalled();
    });

    it('open: should set `param` with parameter and `oldTarget` with `target`.', () => {
      component['param'] = undefined;
      component.target = 'targetValue';

      spyOn(component, <any>'validateInitialContent');

      component.open('paramValue');

      expect(component['param']).toBe('paramValue');
      expect(component['oldTarget']).toBe('targetValue');
    });

    it('toggle: should call `open` if showPopup is false shouldn`t call `close` method', () => {
      const param = { name: 'po' };

      component.showPopup = false;

      spyOn(component, 'close');
      spyOn(component, 'open');

      component.toggle(param);

      expect(component.open).toHaveBeenCalledWith(param);
      expect(component.close).not.toHaveBeenCalled();
    });

    it('toggle: should call `close` if showPopup is true and `oldTarget` is `target` and shouldn`t call `open` method', () => {
      component.showPopup = true;

      spyOn(component, 'open');
      spyOn(component, 'close');

      component.toggle();

      expect(component.close).toHaveBeenCalled();
      expect(component.open).not.toHaveBeenCalled();
    });

    it('clickedOutTarget: should return true if doesn`t click in event target', () => {
      event = {
        target: 'c'
      };

      expect(component['clickedOutTarget'].call(fakeThis, event)).toBeTruthy();
    });

    it('clickedOutTarget: should return false if click is in event target', () => {
      event = {
        target: 'a'
      };

      expect(component['clickedOutTarget'].call(fakeThis, event)).toBeFalsy();
    });

    it('clickedOutTarget: should return false if doesn`t have target', () => {
      event = {
        target: 'a'
      };

      component.target = undefined;

      fixture.detectChanges();

      expect(component['clickedOutTarget'](event)).toBeFalsy();
    });

    it('onScroll: should call `close` if `showPopup` is true', () => {
      component.showPopup = true;

      spyOn(component, 'close');

      component['onScroll']({ target: {} });

      expect(component.close).toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `close` if `showPopup` is false', () => {
      component.showPopup = false;

      spyOn(component, 'close');

      component['onScroll']({ target: {} });

      expect(component.close).not.toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `close` if `showPopup` is true and target.className is `po-popup-container`', () => {
      const fakeEvent = { target: { className: 'po-popup-container' } };
      component.showPopup = true;

      spyOn(component, 'close');

      component['onScroll'](fakeEvent);

      expect(component.close).not.toHaveBeenCalled();
    });

    it('close: should set left style to 0 and showPopup to false', () => {
      component.showPopup = true;

      spyOn(component, <any>'removeListeners');

      component.close();

      expect(component.showPopup).toBeFalsy();
      expect(component['removeListeners']).toHaveBeenCalled();
    });

    it(`closePopupOnClickout: should call 'close' if clickedOutDisabledItem, clickedOutTarget and
      clickedOutHeaderTemplate return true`, () => {
      spyOn(component, <any>'clickedOutDisabledItem').and.returnValue(true);
      spyOn(component, <any>'clickedOutTarget').and.returnValue(true);
      spyOn(component, <any>'clickedOutHeaderTemplate').and.returnValue(true);
      spyOn(component, <any>'close');

      component['closePopupOnClickout'](event);

      expect(component['close']).toHaveBeenCalled();
      expect(component['clickedOutHeaderTemplate']).toHaveBeenCalled();
      expect(component['clickedOutTarget']).toHaveBeenCalled();
      expect(component['clickedOutDisabledItem']).toHaveBeenCalled();
    });

    it(`closePopupOnClickout: shouldn't call 'close' if any condition clickedOutDisabledItem, clickedOutTarget and
      clickedOutHeaderTemplate returns false`, () => {
      spyOn(component, <any>'clickedOutDisabledItem').and.returnValue(true);
      spyOn(component, <any>'clickedOutTarget').and.returnValue(true);
      spyOn(component, <any>'clickedOutHeaderTemplate').and.returnValue(false);
      spyOn(component, 'close');

      component['closePopupOnClickout'](event);

      expect(component.close).not.toHaveBeenCalled();

      expect(component['clickedOutDisabledItem']).toHaveBeenCalled();
      expect(component['clickedOutTarget']).toHaveBeenCalled();
      expect(component['clickedOutHeaderTemplate']).toHaveBeenCalled();
    });

    it('hasContentToShow: should return true if has actions', () => {
      component.actions = actions;
      component.open();
      fixture.detectChanges();

      expect(component['hasContentToShow']()).toBeTruthy();
    });

    it('hasContentToShow: should return false if doesn`t have actions', () => {
      const fakePopup = {
        popupRef: {
          nativeElement: {
            clientHeight: 0
          }
        }
      };

      expect(component['hasContentToShow'].call(fakePopup)).toBeFalsy();
    });

    it('clickedOutDisabledItem: should return false if element contains `po-popup-item-disabled` className', () => {
      spyOn(component, <any>'elementContains').and.returnValue(true);

      expect(component['clickedOutDisabledItem'](event)).toBeFalsy();
    });

    it('clickedOutDisabledItem: should return true if element doesn`t contain `po-popup-item-disabled` className', () => {
      spyOn(component, <any>'elementContains').and.returnValue(false);

      expect(component['clickedOutDisabledItem'](event)).toBeTruthy();
    });

    it('clickedOutHeaderTemplate: should return true if popupRef doesn`t contain popupHeaderTemplate', () => {
      expect(component['clickedOutHeaderTemplate'](event)).toBeTruthy();
    });

    it('clickedOutHeaderTemplate: should return false if popupHeaderTemplate contains `event.target`', () => {
      const popupHeaderTemplate = { contains: (e?) => true };
      component.open();

      spyOn(component.popupRef.nativeElement, 'querySelector').and.returnValue(popupHeaderTemplate);

      expect(component['clickedOutHeaderTemplate'](event)).toBeFalsy();
    });

    it('elementContains: should return true if element contains className', () => {
      const element = {
        classList: {
          contains: value => {
            const target = ['po-popup-item-disabled'];
            return target.includes(value);
          }
        }
      };

      expect(component['elementContains'](<any>element, 'po-popup-item-disabled')).toBeTruthy();
    });

    it('elementContains: should return false if element is null', () => {
      const element = null;

      expect(component['elementContains'](element, 'po-popup-item-disabled')).toBeFalsy();
    });

    describe('checkBooleanValue:', () => {
      it('checkBooleanValue: should return `true` if `action.disabled` is `true`.', () => {
        const action = { label: 'PO ', disabled: true };
        spyOn(UtilsFunctions, 'isTypeof').and.returnValue(false);

        expect(component.returnBooleanValue(action, 'disabled')).toBe(true);
        expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
      });

      it('checkBooleanValue: should return `true` if `action.disabled` is a function.', () => {
        const action = { label: 'PO ', disabled: () => true };

        spyOn(action, 'disabled').and.returnValue(true);
        spyOn(UtilsFunctions, 'isTypeof').and.returnValue(true);

        const result = component.returnBooleanValue(action, 'disabled');

        expect(result).toBe(true);
        expect(action.disabled).toHaveBeenCalled();
        expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
      });
    });

    it('setPosition: should call setElements, adjustPosition and getArrowdirection.', () => {
      const fakeFunctions = {
        poControlPosition: {
          setElements: () => {},
          adjustPosition: () => {},
          getArrowDirection: () => {}
        },
        popupRef: {
          nativeElement: undefined
        },
        target: undefined,
        position: undefined
      };

      spyOn(fakeFunctions.poControlPosition, 'setElements');
      spyOn(fakeFunctions.poControlPosition, 'adjustPosition');
      spyOn(fakeFunctions.poControlPosition, 'getArrowDirection');

      component['setPosition'].call(fakeFunctions);

      expect(fakeFunctions.poControlPosition.setElements).toHaveBeenCalled();
      expect(fakeFunctions.poControlPosition.adjustPosition).toHaveBeenCalled();
      expect(fakeFunctions.poControlPosition.getArrowDirection).toHaveBeenCalled();
    });

    it('validateInitialContent: should call `setPosition` and `initializeListeners` if `hasContentToShow` is `true`', () => {
      spyOn(component, <any>'hasContentToShow').and.returnValue(true);
      spyOn(component, <any>'setPosition');
      spyOn(component, <any>'initializeListeners');

      component['validateInitialContent']();

      expect(component['setPosition']).toHaveBeenCalled();
      expect(component['initializeListeners']).toHaveBeenCalled();
    });

    it('validateInitialContent: should call `close` if `hasContentToShow` is `false`', () => {
      spyOn(component, <any>'hasContentToShow').and.returnValue(false);
      spyOn(component, 'close');

      component['validateInitialContent']();

      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('Templates:', () => {
    it('should show `po-popup` if `showPopup` is `true`', () => {
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup')).toBeTruthy();
    });

    it('shouldn`t show `po-popup` if `showPopup` is `false`', () => {
      component.showPopup = false;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup')).toBeNull();
    });

    it('should set class to default if type is different to danger', () => {
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-popup-item-default').length).toBe(2);
    });

    it('should set class to danger if type is danger', () => {
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-popup-item-danger').length).toBe(1);
    });

    it('should set class to separator if separator is true', () => {
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelectorAll('.po-popup-item-separator').length).toBe(2);
    });

    it('should add `po-popup-item-selected` class if PopupAction.selected is true', () => {
      component.actions = [{ label: 'PopupAction ', selected: true }];
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup-item-selected')).toBeTruthy();
    });

    it('should not add `po-popup-item-selected` class if PopupAction.selected is false', () => {
      component.actions = [{ label: 'PopupAction ', selected: false }];
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup-item-selected')).toBeFalsy();
    });

    it('should display arrow.', () => {
      component.hideArrow = false;
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup-arrow')).toBeTruthy();
    });

    it('shouldn´t display arrow.', () => {
      component.hideArrow = true;
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup-arrow')).toBeFalsy();
    });

    it('shouldn`t display action if `visible` is `false`.', () => {
      component.actions = [{ label: 'PO ', type: 'danger', visible: false }];
      component.showPopup = true;

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-popup-item-danger')).toBeNull();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { configureTestSuite, expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoUtils as UtilsFunctions } from '../../utils/util';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';

import { PoPopupAction } from './po-popup-action.interface';
import { PoPopupComponent } from './po-popup.component';

describe('PoPopupComponent:', () => {
  let actions: Array<PoPopupAction>;
  let component: PoPopupComponent;
  let fixture: ComponentFixture<PoPopupComponent>;
  let nativeElement;

  const eventClick = new MouseEvent('click', { 'bubbles': false, 'cancelable': true });

  const eventResize = document.createEvent('Event');
  eventResize.initEvent('resize', false, true);

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

    it('ngAfterViewInit: should set target if templateIcon is true', () => {
      component.templateIcon = true;
      component.target = {
        iconElement: {
          nativeElement: 'test'
        }
      };
      component.ngAfterViewInit();

      expect(component.target).toBe('test');
    });

    it('clickoutListener: should call `closePopupOnClickout` on click in document', () => {
      const targetEl = document.createElement('button');
      document.body.appendChild(targetEl);
      component.target = targetEl;

      component.open();
      fixture.detectChanges();

      spyOn(component, <any>'closePopupOnClickout');

      document.dispatchEvent(eventClick);

      fixture.detectChanges();

      expect(component['closePopupOnClickout']).toHaveBeenCalled();
      targetEl.remove();
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

    it('open: should emit openEvent when popup is opened.', () => {
      spyOn(component.openEvent, 'emit');
      spyOn(component, <any>'validateInitialContent');

      component.open();

      expect(component.openEvent.emit).toHaveBeenCalled();
    });

    it(`open: should emit openEvent before validateInitialContent, so p-open is emitted even if the
      content is not rendered yet (lazyload timing).`, () => {
      const callOrder: Array<string> = [];

      component.rootLazyLoad = () => of([]);
      component['_actions'] = [];
      component.popupRef = undefined;
      component.listbox = undefined;

      spyOn(component.openEvent, 'emit').and.callFake(() => callOrder.push('open'));
      spyOn(component, <any>'validateInitialContent').and.callFake(() => callOrder.push('validate'));

      component.open();

      expect(component.openEvent.emit).toHaveBeenCalled();
      expect(callOrder).toEqual(['open', 'validate']);
    });

    it(`open: shouldn't auto-close (keep showPopup true) in lazyload mode when content is not rendered
      yet, otherwise p-open/p-close would fire in the same tick.`, () => {
      component.rootLazyLoad = () => of([]);
      component['_actions'] = [];
      component.popupRef = undefined;
      component.listbox = undefined;

      spyOn(component.changeDetector, 'detectChanges');
      spyOn(component, 'close').and.callThrough();

      component.open();

      expect(component.close).not.toHaveBeenCalled();
      expect(component.showPopup).toBeTrue();
    });

    it(`validateInitialContent: should call close when content is not available and it is not lazyload.`, () => {
      component.rootLazyLoad = undefined;
      component.popupRef = undefined;
      component.listbox = undefined;

      spyOn(component, 'close');

      component['validateInitialContent']();

      expect(component.close).toHaveBeenCalled();
    });

    it(`validateInitialContent: shouldn't call close when content is not available but in lazyload mode.`, () => {
      component.rootLazyLoad = () => of([]);
      component.popupRef = undefined;
      component.listbox = undefined;

      spyOn(component, 'close');

      component['validateInitialContent']();

      expect(component.close).not.toHaveBeenCalled();
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
      component.target = document.createElement('div');
      spyOn(component as any, 'isEventInsideElement').and.returnValue(false);

      event = {
        target: 'c'
      };

      expect(component['clickedOutTarget'](event)).toBeTruthy();
      expect((component as any).isEventInsideElement).toHaveBeenCalled();
    });

    it('clickedOutTarget: should return false if click is in event target', () => {
      component.target = document.createElement('div');
      spyOn(component as any, 'isEventInsideElement').and.returnValue(true);

      event = {
        target: 'a'
      };

      expect(component['clickedOutTarget'](event)).toBeFalsy();
      expect((component as any).isEventInsideElement).toHaveBeenCalled();
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
      component.popupRef = {
        nativeElement: document.createElement('div')
      };

      component.showPopup = true;

      spyOn(component, 'close');

      component['onScroll']({ target: document.createElement('div') });

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

    it('close: should set left style to 0, showPopup to false and emit close', () => {
      component.showPopup = true;

      spyOn(component, <any>'removeListeners');
      spyOn(component.closeEvent, <any>'emit');

      component.close();

      expect(component.showPopup).toBeFalsy();
      expect(component['removeListeners']).toHaveBeenCalled();
      expect(component.closeEvent.emit).toHaveBeenCalled();
    });

    it('close: should focus target when close reason is escape', () => {
      const target = document.createElement('button');
      const focusSpy = spyOn(target, 'focus');
      component.target = target;

      component.close({ reason: 'escape', origin: 'keyboard' });

      expect(focusSpy).toHaveBeenCalled();
    });

    it('close: should not focus target when close reason is not escape', () => {
      const target = document.createElement('button');
      const focusSpy = spyOn(target, 'focus');
      component.target = target;

      component.close();

      expect(focusSpy).not.toHaveBeenCalled();
    });

    it('checkAllActionIsInvisible: should return true is all itens are invisible', () => {
      component.actions = [
        { 'label': 'PO Popup', 'visible': false },
        { 'label': 'PO Popup2', 'visible': false }
      ];
      const allInvisible = component['checkAllActionIsInvisible']();

      expect(allInvisible).toBeTruthy();
    });

    it('checkAllActionIsInvisible: should return true is one item are visible', () => {
      component.actions = [
        { 'label': 'PO Popup', 'visible': false },
        { 'label': 'PO Popup2', 'visible': true }
      ];
      const allInvisible = component['checkAllActionIsInvisible']();

      expect(allInvisible).toBeFalsy();
    });

    it('checkAllActionIsInvisible: should return false when rootLazyLoad is set and no actions', () => {
      component.actions = () => of([{ label: 'a' }]);

      const allInvisible = component['checkAllActionIsInvisible']();

      expect(allInvisible).toBeFalse();
    });

    it(`closePopupOnClickout: should call 'close' if clickedOutDisabledItem, clickedOutTarget and
      clickedOutHeaderTemplate return true`, () => {
      spyOn(component, <any>'clickedOutDisabledItem').and.returnValue(true);
      spyOn(component, <any>'clickedOutTarget').and.returnValue(true);
      spyOn(component, <any>'clickedOutPopup').and.returnValue(true);
      spyOn(component, <any>'clickedOutHeaderTemplate').and.returnValue(true);
      spyOn(component, <any>'close');

      component['closePopupOnClickout'](event);

      expect(component['close']).toHaveBeenCalled();
      expect(component['clickedOutHeaderTemplate']).toHaveBeenCalled();
      expect(component['clickedOutTarget']).toHaveBeenCalled();
      expect(component['clickedOutPopup']).toHaveBeenCalled();
      expect(component['clickedOutDisabledItem']).toHaveBeenCalled();
    });

    it(`closePopupOnClickout: shouldn't call 'close' if any condition clickedOutDisabledItem, clickedOutTarget and
      clickedOutHeaderTemplate returns false`, () => {
      spyOn(component, <any>'clickedOutDisabledItem').and.returnValue(true);
      spyOn(component, <any>'clickedOutTarget').and.returnValue(true);
      spyOn(component, <any>'clickedOutPopup').and.returnValue(true);
      spyOn(component, <any>'clickedOutHeaderTemplate').and.returnValue(false);
      spyOn(component, 'close');

      component['closePopupOnClickout'](event);

      expect(component.close).not.toHaveBeenCalled();

      expect(component['clickedOutDisabledItem']).toHaveBeenCalled();
      expect(component['clickedOutTarget']).toHaveBeenCalled();
      expect(component['clickedOutPopup']).toHaveBeenCalled();
      expect(component['clickedOutHeaderTemplate']).toHaveBeenCalled();
    });

    it('isEventInsideElement: should return true when composedPath contains the element', () => {
      const element = document.createElement('div');
      const event = {
        target: document.createElement('span'),
        composedPath: () => [document.createElement('a'), element]
      } as unknown as MouseEvent;

      expect(component['isEventInsideElement'](event, element)).toBeTrue();
    });

    it('isEventInsideElement: should fallback to contains when composedPath is unavailable', () => {
      const element = document.createElement('div');
      const target = document.createElement('button');
      element.appendChild(target);
      const event = { target, composedPath: undefined } as unknown as MouseEvent;

      expect(component['isEventInsideElement'](event, element)).toBeTrue();
    });

    it('isEventInsideElement: should return false when element is undefined', () => {
      const event = { target: document.createElement('button') } as unknown as MouseEvent;

      expect(component['isEventInsideElement'](event, undefined)).toBeFalse();
    });

    it('clickedOutPopup: should return true when click is outside popup', () => {
      const popupElement = document.createElement('div');
      const externalElement = document.createElement('span');
      component.popupRef = { nativeElement: popupElement } as any;

      const event = { target: externalElement, composedPath: undefined } as unknown as MouseEvent;

      expect(component['clickedOutPopup'](event)).toBeTrue();
    });

    it('clickedOutPopup: should return false when popupRef is undefined', () => {
      component.popupRef = undefined;
      const event = { target: document.createElement('span') } as unknown as MouseEvent;

      expect(component['clickedOutPopup'](event)).toBeFalsy();
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

    it('onClickItem: should emit clickItem when item has no goBack', () => {
      const spyEmit = spyOn(component.clickItem, 'emit');
      const spyDetect = spyOn(component['changeDetector'], 'detectChanges');
      const spyValidate = spyOn(component as any, 'validateInitialContent');

      component.onClickItem({ label: 'test' });

      expect(spyEmit).toHaveBeenCalledWith({ label: 'test' });
      expect(spyDetect).not.toHaveBeenCalled();
      expect(spyValidate).not.toHaveBeenCalled();
    });

    it('onClickItem: should NOT emit clickItem when goBack is true, but should call detectChanges and validateInitialContent', () => {
      const spyEmit = spyOn(component.clickItem, 'emit');
      const spyDetect = spyOn(component['changeDetector'], 'detectChanges');
      const spyValidate = spyOn(component as any, 'validateInitialContent');

      component.onClickItem({ goBack: true });

      expect(spyEmit).not.toHaveBeenCalled();
      expect(spyDetect).toHaveBeenCalled();
      expect(spyValidate).toHaveBeenCalled();
    });

    it('onClickItem: should emit and also call detectChanges and validateInitialContent when item has subItems', () => {
      const spyEmit = spyOn(component.clickItem, 'emit');
      const spyDetect = spyOn(component['changeDetector'], 'detectChanges');
      const spyValidate = spyOn(component as any, 'validateInitialContent');

      const item = { label: 'parent', subItems: [{ label: 'child' }] };
      component.onClickItem(item);

      expect(spyEmit).toHaveBeenCalledWith(item);
      expect(spyDetect).toHaveBeenCalled();
      expect(spyValidate).toHaveBeenCalled();
    });

    it('onContentChange: should reposition (call setPosition) when popup is open and has content', () => {
      component.showPopup = true;
      spyOn(component['changeDetector'], 'detectChanges');
      spyOn(component as any, 'hasContentToShow').and.returnValue(true);
      const spySetPosition = spyOn(component as any, 'setPosition');

      component.onContentChange();

      expect(spySetPosition).toHaveBeenCalled();
    });

    it('onContentChange: should NOT reposition when popup is closed', () => {
      component.showPopup = false;
      const spySetPosition = spyOn(component as any, 'setPosition');

      component.onContentChange();

      expect(spySetPosition).not.toHaveBeenCalled();
    });

    it('onContentChange: should NOT reposition when there is no content to show', () => {
      component.showPopup = true;
      spyOn(component['changeDetector'], 'detectChanges');
      spyOn(component as any, 'hasContentToShow').and.returnValue(false);
      const spySetPosition = spyOn(component as any, 'setPosition');

      component.onContentChange();

      expect(spySetPosition).not.toHaveBeenCalled();
    });

    it('onContentChange: should reposition using sticky positions to keep the current side', () => {
      component.showPopup = true;
      spyOn(component['changeDetector'], 'detectChanges');
      spyOn(component as any, 'hasContentToShow').and.returnValue(true);
      spyOn(component as any, 'getStickyPositions').and.returnValue(['top-left', 'bottom-left']);
      const spySetPosition = spyOn(component as any, 'setPosition');

      component.onContentChange();

      expect(spySetPosition).toHaveBeenCalledWith(['top-left', 'bottom-left']);
    });

    it('getStickyPositions: should return undefined when there are no custom positions', () => {
      component.customPositions = undefined;

      expect(component['getStickyPositions']()).toBeUndefined();
    });

    it(`getStickyPositions: should reorder to put the currently open side first (corner-align),
      so the popup keeps opening upwards after lazy content loads`, () => {
      component.isCornerAlign = true;
      component.customPositions = ['bottom-left', 'top-left'];
      // arrowDirection 'bottom-left' => popup aberto em 'top-left' (para cima)
      component.arrowDirection = 'bottom-left';

      expect(component['getStickyPositions']()).toEqual(['top-left', 'bottom-left']);
    });

    it(`getStickyPositions: should keep original order when the current side is already first`, () => {
      component.isCornerAlign = true;
      component.customPositions = ['bottom-left', 'top-left'];
      // arrowDirection 'top-left' => popup aberto em 'bottom-left' (para baixo, já é o índice 0)
      component.arrowDirection = 'top-left';

      expect(component['getStickyPositions']()).toEqual(['bottom-left', 'top-left']);
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
        listbox: {
          nativeElement: {
            querySelector: () => true
          }
        },
        target: undefined,
        position: undefined,
        popupOffset: 8,
        clampHeightToViewport: () => {}
      };

      spyOn(fakeFunctions.poControlPosition, 'setElements');
      spyOn(fakeFunctions.poControlPosition, 'adjustPosition');
      spyOn(fakeFunctions.poControlPosition, 'getArrowDirection');
      spyOn(fakeFunctions, 'clampHeightToViewport');

      component['setPosition'].call(fakeFunctions);

      expect(fakeFunctions.poControlPosition.setElements).toHaveBeenCalled();
      expect(fakeFunctions.poControlPosition.adjustPosition).toHaveBeenCalled();
      expect(fakeFunctions.poControlPosition.getArrowDirection).toHaveBeenCalled();
      expect(fakeFunctions.clampHeightToViewport).toHaveBeenCalled();
    });

    it('isOpeningUp: should return true when corner-aligned arrow points to a top position', () => {
      component.isCornerAlign = true;
      component.arrowDirection = 'bottom-left'; // => posição top-left (abre para cima)

      expect(component['isOpeningUp']()).toBeTrue();
    });

    it('isOpeningUp: should return false when corner-aligned arrow points to a bottom position', () => {
      component.isCornerAlign = true;
      component.arrowDirection = 'top-left'; // => posição bottom-left (abre para baixo)

      expect(component['isOpeningUp']()).toBeFalse();
    });

    it('clampHeightToViewport: should remove dynamic maxHeight from the listbox scroller when not opening up', () => {
      const popupEl = document.createElement('div');
      const scrollEl = document.createElement('ul');
      component.popupRef = { nativeElement: popupEl } as any;
      component.target = document.createElement('button');
      spyOn(component as any, 'getScrollableListboxElement').and.returnValue(scrollEl);
      spyOn(component as any, 'isOpeningUp').and.returnValue(false);
      const removeSpy = spyOn(component['renderer'], 'removeStyle');

      component['clampHeightToViewport']();

      expect(removeSpy).toHaveBeenCalledWith(scrollEl, 'maxHeight');
    });

    it(`clampHeightToViewport: should clamp the listbox scroller maxHeight to the space above the target
      when opening up and content is taller than that space`, () => {
      const popupEl = document.createElement('div');
      Object.defineProperty(popupEl, 'offsetHeight', { value: 400, configurable: true });
      const scrollEl = document.createElement('ul');
      Object.defineProperty(scrollEl, 'offsetHeight', { value: 400, configurable: true });
      component.popupRef = { nativeElement: popupEl } as any;

      const targetEl = document.createElement('button');
      spyOn(targetEl, 'getBoundingClientRect').and.returnValue({ top: 266 } as DOMRect);
      component.target = targetEl;

      spyOn(component as any, 'getScrollableListboxElement').and.returnValue(scrollEl);
      spyOn(component as any, 'isOpeningUp').and.returnValue(true);
      const setStyleSpy = spyOn(component['renderer'], 'setStyle');
      spyOn(component['poControlPosition'], 'adjustPosition');
      spyOn(component['poControlPosition'], 'getArrowDirection').and.returnValue('bottom-left');

      component['clampHeightToViewport']();

      // spaceAbove = 266 - 8 - 8 = 250; nonScrollableHeight = 400 - 400 = 0 => maxScrollHeight = 250
      expect(setStyleSpy).toHaveBeenCalledWith(scrollEl, 'maxHeight', '250px');
    });

    it('clampHeightToViewport: should not apply overflow to the popup container (avoids double scroll)', () => {
      const popupEl = document.createElement('div');
      Object.defineProperty(popupEl, 'offsetHeight', { value: 400, configurable: true });
      const scrollEl = document.createElement('ul');
      Object.defineProperty(scrollEl, 'offsetHeight', { value: 400, configurable: true });
      component.popupRef = { nativeElement: popupEl } as any;

      const targetEl = document.createElement('button');
      spyOn(targetEl, 'getBoundingClientRect').and.returnValue({ top: 266 } as DOMRect);
      component.target = targetEl;

      spyOn(component as any, 'getScrollableListboxElement').and.returnValue(scrollEl);
      spyOn(component as any, 'isOpeningUp').and.returnValue(true);
      const setStyleSpy = spyOn(component['renderer'], 'setStyle');
      spyOn(component['poControlPosition'], 'adjustPosition');
      spyOn(component['poControlPosition'], 'getArrowDirection').and.returnValue('bottom-left');

      component['clampHeightToViewport']();

      expect(setStyleSpy).not.toHaveBeenCalledWith(popupEl, 'overflowY', 'auto');
    });

    it(`clampHeightToViewport: should NOT clamp when opening up but content fits in the space above`, () => {
      const popupEl = document.createElement('div');
      Object.defineProperty(popupEl, 'offsetHeight', { value: 100, configurable: true });
      const scrollEl = document.createElement('ul');
      Object.defineProperty(scrollEl, 'offsetHeight', { value: 100, configurable: true });
      component.popupRef = { nativeElement: popupEl } as any;

      const targetEl = document.createElement('button');
      spyOn(targetEl, 'getBoundingClientRect').and.returnValue({ top: 400 } as DOMRect);
      component.target = targetEl;

      spyOn(component as any, 'getScrollableListboxElement').and.returnValue(scrollEl);
      spyOn(component as any, 'isOpeningUp').and.returnValue(true);
      const setStyleSpy = spyOn(component['renderer'], 'setStyle');

      component['clampHeightToViewport']();

      expect(setStyleSpy).not.toHaveBeenCalled();
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
      component.rootLazyLoad = undefined;
      spyOn(component, <any>'hasContentToShow').and.returnValue(false);
      spyOn(component, 'close');

      component['validateInitialContent']();

      expect(component.close).toHaveBeenCalled();
    });

    it('clampHeightToViewport: should return early when there is no scrollable listbox element', () => {
      component.popupRef = { nativeElement: document.createElement('div') } as any;
      component.target = document.createElement('button');
      spyOn(component as any, 'getScrollableListboxElement').and.returnValue(null);
      const isOpeningUpSpy = spyOn(component as any, 'isOpeningUp');

      component['clampHeightToViewport']();

      expect(isOpeningUpSpy).not.toHaveBeenCalled();
    });

    it('clampHeightToViewport: should return early when space above the target is not positive', () => {
      const popupEl = document.createElement('div');
      Object.defineProperty(popupEl, 'offsetHeight', { value: 400, configurable: true });
      component.popupRef = { nativeElement: popupEl } as any;

      const targetEl = document.createElement('button');
      spyOn(targetEl, 'getBoundingClientRect').and.returnValue({ top: 10 } as DOMRect);
      component.target = targetEl;

      spyOn(component as any, 'getScrollableListboxElement').and.returnValue(document.createElement('ul'));
      spyOn(component as any, 'isOpeningUp').and.returnValue(true);
      const setStyleSpy = spyOn(component['renderer'], 'setStyle');

      component['clampHeightToViewport']();

      expect(setStyleSpy).not.toHaveBeenCalled();
    });

    it('getScrollableListboxElement: should return null when there is no listbox element', () => {
      component.listbox = undefined;

      expect(component['getScrollableListboxElement']()).toBeNull();
    });

    it('getScrollableListboxElement: should return the inner ul[role=listbox] when present', () => {
      const listboxEl = document.createElement('div');
      const ul = document.createElement('ul');
      ul.setAttribute('role', 'listbox');
      listboxEl.appendChild(ul);
      component.listbox = { nativeElement: listboxEl } as any;

      expect(component['getScrollableListboxElement']()).toBe(ul);
    });

    it('getScrollableListboxElement: should fallback to the listbox element when the inner ul is absent', () => {
      const listboxEl = document.createElement('div');
      component.listbox = { nativeElement: listboxEl } as any;

      expect(component['getScrollableListboxElement']()).toBe(listboxEl);
    });

    it('isOpeningUp: should use default (non corner-align) mapping and return true for a top position', () => {
      component.isCornerAlign = false;
      component.arrowDirection = 'bottom'; // => posição top (abre para cima)

      expect(component['isOpeningUp']()).toBeTrue();
    });

    it('isOpeningUp: should return false when the arrow direction has no mapping', () => {
      component.isCornerAlign = false;
      component.arrowDirection = 'unknown';

      expect(component['isOpeningUp']()).toBeFalse();
    });

    it('getStickyPositions: should return undefined when customPositions is empty', () => {
      component.customPositions = [];

      expect(component['getStickyPositions']()).toBeUndefined();
    });

    it('getStickyPositions: should use default (non corner-align) mapping to reorder positions', () => {
      component.isCornerAlign = false;
      component.customPositions = ['bottom', 'top'];
      component.arrowDirection = 'bottom'; // => posição top

      expect(component['getStickyPositions']()).toEqual(['top', 'bottom']);
    });

    it('getStickyPositions: should return original positions when the current side is not in the list', () => {
      component.isCornerAlign = true;
      component.customPositions = ['bottom-left', 'top-left'];
      component.arrowDirection = 'left'; // sem mapeamento corner => currentPosition undefined

      expect(component['getStickyPositions']()).toEqual(['bottom-left', 'top-left']);
    });

    it('setPosition: should use the preferred positions when provided', () => {
      component.listbox = { nativeElement: { querySelector: () => true } } as any;
      component.popupRef = { nativeElement: document.createElement('div') } as any;
      component.target = document.createElement('button');
      const setElementsSpy = spyOn(component['poControlPosition'], 'setElements');
      spyOn(component['poControlPosition'], 'adjustPosition');
      spyOn(component['poControlPosition'], 'getArrowDirection');
      spyOn(component as any, 'clampHeightToViewport');

      component['setPosition'](['top-left', 'bottom-left']);

      const callArgs = setElementsSpy.calls.mostRecent().args;
      expect(callArgs[3]).toEqual(['top-left', 'bottom-left']);
    });
  });
});

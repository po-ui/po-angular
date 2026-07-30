import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoUtils as UtilsFunctions } from '../../utils/util';
import { PoControlPositionService } from '../../services/po-control-position/po-control-position.service';

import { PoPopupAction } from './po-popup-action.interface';
import { PoPopupComponent } from './po-popup.component';

describe('PoPopupComponent:', () => {
  let actions: Array<PoPopupAction>;
  let component: PoPopupComponent;
  let fixture: ComponentFixture<PoPopupComponent>;
  let nativeElement;

  const eventClick = new MouseEvent('click', { bubbles: false, cancelable: true });

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [PoPopupComponent],
      providers: [PoControlPositionService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

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

  afterEach(() => {
    vi.restoreAllMocks();
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
      } as any;
      component.ngAfterViewInit();

      expect(component.target).toBe('test');
    });

    it('clickoutListener: should call `closePopupOnClickout` on click in document', () => {
      component.open();
      fixture.detectChanges();

      const spy = vi.spyOn(component as any, 'closePopupOnClickout').mockImplementation(() => {});

      document.dispatchEvent(eventClick);

      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
    });

    it('resizeListener: should call `close` on resize window', () => {
      const spy = vi.spyOn(component as any, 'close').mockImplementation(() => {});

      component.open();
      fixture.detectChanges();

      window.dispatchEvent(eventResize);

      expect(spy).toHaveBeenCalled();
    });

    describe('onActionClick:', () => {
      it('should call `popupItem.action` if has popupItem and popupItem.action', () => {
        popupItem.action = vi.fn();

        const openUrlSpy = vi.spyOn(component as any, 'openUrl');
        const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

        component.onActionClick(popupItem);

        expect(closeSpy).toHaveBeenCalled();
        expect(popupItem.action).toHaveBeenCalled();
        expect(openUrlSpy).not.toHaveBeenCalled();
      });

      it('shouldn`t call `popupItem.action` if receives undefined as param', () => {
        popupItem.action = vi.fn();

        const openUrlSpy = vi.spyOn(component as any, 'openUrl');
        const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

        component.onActionClick(undefined);

        expect(closeSpy).not.toHaveBeenCalled();
        expect(popupItem.action).not.toHaveBeenCalled();
        expect(openUrlSpy).not.toHaveBeenCalled();
      });

      it('shouldn`t call `popupItem.action` if has popupItem but doesn`t have popupItem.action and popupItem URL', () => {
        const openUrlSpy = vi.spyOn(component as any, 'openUrl');
        const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

        const result = () => component.onActionClick(popupItem);

        expect(result).not.toThrowError();
        expect(closeSpy).not.toHaveBeenCalled();
        expect(openUrlSpy).not.toHaveBeenCalled();
      });

      it('should call `openUrl` if has a popupItem with URL and without action', () => {
        popupItem.url = 'http://www.fakeUrlPo.com';

        const openUrlSpy = vi.spyOn(component as any, 'openUrl').mockImplementation(() => {});
        const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

        component.onActionClick(popupItem);

        expect(closeSpy).toHaveBeenCalled();
        expect(openUrlSpy).toHaveBeenCalled();
      });
    });

    it('openUrl: should call `openExternalLink` but shouldn`t call `router.navigate`', () => {
      const url = 'http://www.fakeUrlPo.com';

      const externalSpy = vi.spyOn(UtilsFunctions, 'openExternalLink').mockImplementation(() => {});
      const navigateSpy = vi.spyOn(component['router'], 'navigate');

      component['openUrl'](url);

      expect(externalSpy).toHaveBeenCalledWith(url);
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('openUrl: should call `router.navigate` if it`s an internal URL and shouldn`t call external URL', () => {
      const url = '/customers';

      const navigateSpy = vi.spyOn(component['router'], 'navigate').mockImplementation(() => Promise.resolve(true));
      const externalSpy = vi.spyOn(UtilsFunctions, 'openExternalLink');

      component['openUrl'](url);

      expect(navigateSpy).toHaveBeenCalled();
      expect(externalSpy).not.toHaveBeenCalledWith(url);
    });

    it('openUrl: shouldn`t call `router.navigate` and `openExternalLink` if URL is undefined ', () => {
      const navigateSpy = vi.spyOn(component['router'], 'navigate');
      const externalSpy = vi.spyOn(UtilsFunctions, 'openExternalLink');

      component['openUrl'](undefined);

      expect(navigateSpy).not.toHaveBeenCalled();
      expect(externalSpy).not.toHaveBeenCalled();
    });

    it('removeListeners: should call `resizeListener` and `clickoutListener`', () => {
      component['initializeListeners']();

      const resizeSpy = vi.spyOn(component as any, 'resizeListener').mockImplementation(() => {});
      const clickoutSpy = vi.spyOn(component as any, 'clickoutListener').mockImplementation(() => {});

      component['removeListeners']();

      expect(resizeSpy).toHaveBeenCalled();
      expect(clickoutSpy).toHaveBeenCalled();
    });

    it('removeListeners: shouldn`t call `resizeListener` and `clickoutListener`', () => {
      component['removeListeners']();

      expect(component['resizeListener']).toBeUndefined();
      expect(component['clickoutListener']).toBeUndefined();
    });

    it('open: should set `showPopup` to `true` and call `validateInitialContent`.', () => {
      component.showPopup = false;

      vi.spyOn(component as any, 'validateInitialContent').mockImplementation(() => {});

      component.open();

      expect(component.showPopup).toBe(true);
      expect(component['validateInitialContent']).toHaveBeenCalled();
    });

    it('open: should set `param` with parameter and `oldTarget` with `target`.', () => {
      component['param'] = undefined;
      component.target = 'targetValue' as any;

      vi.spyOn(component as any, 'validateInitialContent').mockImplementation(() => {});

      component.open('paramValue');

      expect(component['param']).toBe('paramValue');
      expect(component['oldTarget']).toBe('targetValue');
    });

    it('toggle: should call `open` if showPopup is false shouldn`t call `close` method', () => {
      const param = { name: 'po' };

      component.showPopup = false;

      const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});
      const openSpy = vi.spyOn(component, 'open').mockImplementation(() => {});

      component.toggle(param);

      expect(openSpy).toHaveBeenCalledWith(param);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('toggle: should call `close` if showPopup is true and `oldTarget` is `target` and shouldn`t call `open` method', () => {
      component.showPopup = true;

      const openSpy = vi.spyOn(component, 'open').mockImplementation(() => {});
      const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

      component.toggle();

      expect(closeSpy).toHaveBeenCalled();
      expect(openSpy).not.toHaveBeenCalled();
    });

    it('clickedOutTarget: should return true if doesn`t click in event target', () => {
      event = { target: 'c' };

      expect(component['clickedOutTarget'].call(fakeThis, event)).toBeTruthy();
    });

    it('clickedOutTarget: should return false if click is in event target', () => {
      event = { target: 'a' };

      expect(component['clickedOutTarget'].call(fakeThis, event)).toBeFalsy();
    });

    it('clickedOutTarget: should return false if doesn`t have target', () => {
      event = { target: 'a' };

      component.target = undefined;

      fixture.detectChanges();

      expect(component['clickedOutTarget'](event)).toBeFalsy();
    });

    it('onScroll: should call `close` if `showPopup` is true', () => {
      component.popupRef = {
        nativeElement: document.createElement('div')
      };

      component.showPopup = true;

      const spy = vi.spyOn(component, 'close').mockImplementation(() => {});

      component['onScroll']({ target: document.createElement('div') });

      expect(spy).toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `close` if `showPopup` is false', () => {
      component.showPopup = false;

      const spy = vi.spyOn(component, 'close').mockImplementation(() => {});

      component['onScroll']({ target: {} });

      expect(spy).not.toHaveBeenCalled();
    });

    it('onScroll: shouldn`t call `close` if `showPopup` is true and target.className is `po-popup-container`', () => {
      const fakeEvent = { target: { className: 'po-popup-container' } };
      component.showPopup = true;

      const spy = vi.spyOn(component, 'close').mockImplementation(() => {});

      component['onScroll'](fakeEvent);

      expect(spy).not.toHaveBeenCalled();
    });

    it('close: should set left style to 0, showPopup to false and emit close', () => {
      component.showPopup = true;

      const removeSpy = vi.spyOn(component as any, 'removeListeners').mockImplementation(() => {});
      const emitSpy = vi.spyOn(component.closeEvent, 'emit');

      component.close();

      expect(component.showPopup).toBeFalsy();
      expect(removeSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalled();
    });

    it('checkAllActionIsInvisible: should return true is all itens are invisible', () => {
      component.actions = [
        { label: 'PO Popup', visible: false },
        { label: 'PO Popup2', visible: false }
      ];
      const allInvisible = component['checkAllActionIsInvisible']();

      expect(allInvisible).toBeTruthy();
    });

    it('checkAllActionIsInvisible: should return true is one item are visible', () => {
      component.actions = [
        { label: 'PO Popup', visible: false },
        { label: 'PO Popup2', visible: true }
      ];
      const allInvisible = component['checkAllActionIsInvisible']();

      expect(allInvisible).toBeFalsy();
    });

    it(`closePopupOnClickout: should call 'close' if clickedOutDisabledItem, clickedOutTarget and
      clickedOutHeaderTemplate return true`, () => {
      vi.spyOn(component as any, 'clickedOutDisabledItem').mockReturnValue(true);
      vi.spyOn(component as any, 'clickedOutTarget').mockReturnValue(true);
      vi.spyOn(component as any, 'clickedOutHeaderTemplate').mockReturnValue(true);
      const closeSpy = vi.spyOn(component as any, 'close').mockImplementation(() => {});

      component['closePopupOnClickout'](event);

      expect(closeSpy).toHaveBeenCalled();
      expect(component['clickedOutHeaderTemplate']).toHaveBeenCalled();
      expect(component['clickedOutTarget']).toHaveBeenCalled();
      expect(component['clickedOutDisabledItem']).toHaveBeenCalled();
    });

    it(`closePopupOnClickout: shouldn't call 'close' if any condition returns false`, () => {
      vi.spyOn(component as any, 'clickedOutDisabledItem').mockReturnValue(true);
      vi.spyOn(component as any, 'clickedOutTarget').mockReturnValue(true);
      vi.spyOn(component as any, 'clickedOutHeaderTemplate').mockReturnValue(false);
      const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

      component['closePopupOnClickout'](event);

      expect(closeSpy).not.toHaveBeenCalled();
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
      vi.spyOn(component as any, 'elementContains').mockReturnValue(true);

      expect(component['clickedOutDisabledItem'](event)).toBeFalsy();
    });

    it('clickedOutDisabledItem: should return true if element doesn`t contain `po-popup-item-disabled` className', () => {
      vi.spyOn(component as any, 'elementContains').mockReturnValue(false);

      expect(component['clickedOutDisabledItem'](event)).toBeTruthy();
    });

    it('clickedOutHeaderTemplate: should return true if popupRef doesn`t contain popupHeaderTemplate', () => {
      expect(component['clickedOutHeaderTemplate'](event)).toBeTruthy();
    });

    it('clickedOutHeaderTemplate: should return false if popupHeaderTemplate contains `event.target`', () => {
      const popupHeaderTemplate = { contains: (e?) => true };
      component.open();

      vi.spyOn(component.popupRef.nativeElement, 'querySelector').mockReturnValue(popupHeaderTemplate);

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

      expect(component['elementContains'](element as any, 'po-popup-item-disabled')).toBeTruthy();
    });

    it('elementContains: should return false if element is null', () => {
      const element = null;

      expect(component['elementContains'](element, 'po-popup-item-disabled')).toBeFalsy();
    });

    it('onClickItem: should emit clickItem when item has no goBack', () => {
      const emitSpy = vi.spyOn(component.clickItem, 'emit');
      const detectSpy = vi.spyOn(component['changeDetector'], 'detectChanges');
      const validateSpy = vi.spyOn(component as any, 'validateInitialContent').mockImplementation(() => {});

      component.onClickItem({ label: 'test' });

      expect(emitSpy).toHaveBeenCalledWith({ label: 'test' });
      expect(detectSpy).not.toHaveBeenCalled();
      expect(validateSpy).not.toHaveBeenCalled();
    });

    it('onClickItem: should NOT emit clickItem when goBack is true, but should call detectChanges and validateInitialContent', () => {
      const emitSpy = vi.spyOn(component.clickItem, 'emit');
      const detectSpy = vi.spyOn(component['changeDetector'], 'detectChanges').mockImplementation(() => {});
      const validateSpy = vi.spyOn(component as any, 'validateInitialContent').mockImplementation(() => {});

      component.onClickItem({ goBack: true });

      expect(emitSpy).not.toHaveBeenCalled();
      expect(detectSpy).toHaveBeenCalled();
      expect(validateSpy).toHaveBeenCalled();
    });

    it('onClickItem: should emit and also call detectChanges and validateInitialContent when item has subItems', () => {
      const emitSpy = vi.spyOn(component.clickItem, 'emit');
      const detectSpy = vi.spyOn(component['changeDetector'], 'detectChanges').mockImplementation(() => {});
      const validateSpy = vi.spyOn(component as any, 'validateInitialContent').mockImplementation(() => {});

      const item = { subItems: [{ label: 'child' }] };
      component.onClickItem(item);

      expect(emitSpy).toHaveBeenCalledWith(item);
      expect(detectSpy).toHaveBeenCalled();
      expect(validateSpy).toHaveBeenCalled();
    });

    describe('checkBooleanValue:', () => {
      it('checkBooleanValue: should return `true` if `action.disabled` is `true`.', () => {
        const action = { label: 'PO ', disabled: true };
        vi.spyOn(UtilsFunctions, 'isTypeof').mockReturnValue(false);

        expect(component.returnBooleanValue(action, 'disabled')).toBe(true);
        expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
      });

      it('checkBooleanValue: should return `true` if `action.disabled` is a function.', () => {
        const action = { label: 'PO ', disabled: vi.fn().mockReturnValue(true) };

        vi.spyOn(UtilsFunctions, 'isTypeof').mockReturnValue(true);

        const result = component.returnBooleanValue(action, 'disabled');

        expect(result).toBe(true);
        expect(action.disabled).toHaveBeenCalled();
        expect(UtilsFunctions.isTypeof).toHaveBeenCalled();
      });
    });

    it('setPosition: should call setElements, adjustPosition and getArrowdirection.', () => {
      const fakeFunctions = {
        poControlPosition: {
          setElements: vi.fn(),
          adjustPosition: vi.fn(),
          getArrowDirection: vi.fn()
        },
        popupRef: { nativeElement: undefined },
        listbox: {
          nativeElement: {
            querySelector: () => true
          }
        },
        target: undefined,
        position: undefined
      };

      component['setPosition'].call(fakeFunctions);

      expect(fakeFunctions.poControlPosition.setElements).toHaveBeenCalled();
      expect(fakeFunctions.poControlPosition.adjustPosition).toHaveBeenCalled();
      expect(fakeFunctions.poControlPosition.getArrowDirection).toHaveBeenCalled();
    });

    it('validateInitialContent: should call `setPosition` and `initializeListeners` if `hasContentToShow` is `true`', () => {
      vi.spyOn(component as any, 'hasContentToShow').mockReturnValue(true);
      vi.spyOn(component as any, 'setPosition').mockImplementation(() => {});
      vi.spyOn(component as any, 'initializeListeners').mockImplementation(() => {});

      component['validateInitialContent']();

      expect(component['setPosition']).toHaveBeenCalled();
      expect(component['initializeListeners']).toHaveBeenCalled();
    });

    it('validateInitialContent: should call `close` if `hasContentToShow` is `false`', () => {
      vi.spyOn(component as any, 'hasContentToShow').mockReturnValue(false);
      const closeSpy = vi.spyOn(component, 'close').mockImplementation(() => {});

      component['validateInitialContent']();

      expect(closeSpy).toHaveBeenCalled();
    });
  });
});

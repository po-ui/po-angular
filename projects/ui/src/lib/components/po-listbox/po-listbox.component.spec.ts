import { ElementRef, NO_ERRORS_SCHEMA, QueryList, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PoListBoxComponent } from './po-listbox.component';
import { PoDropdownAction } from '../po-dropdown';
import { PoUtils as UtilFunctions } from './../../utils/util';
import { Subject, Subscription, debounceTime, delay, fromEvent, of, throwError, timeout } from 'rxjs';

describe('PoListBoxComponent', () => {
  let component: PoListBoxComponent;
  let fixture: ComponentFixture<PoListBoxComponent>;

  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoListBoxComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoListBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('should emit UpdateInfiniteScroll when scroll position is reached', () => {
      const target = {
        offsetHeight: 100,
        scrollTop: 100,
        scrollHeight: 10
      };
      component.infiniteScrollDistance = 80;

      const updateInfiniteScroll = spyOn(component['UpdateInfiniteScroll'], 'emit');

      component.showMoreInfiniteScroll({ target });

      expect(updateInfiniteScroll).toHaveBeenCalled();
    });

    it('should call scrollListener and return', done => {
      const fakeElement = document.createElement('div');
      const scrollEvent = new Event('scroll');
      spyOn(fromEvent(fakeElement, 'scroll'), 'pipe').and.returnValue(of(scrollEvent).pipe(debounceTime(100)));

      const observable = component.scrollListener(fakeElement);

      observable.subscribe(event => {
        expect(event).toBe(scrollEvent);
        done();
      });

      fakeElement.dispatchEvent(scrollEvent);
    });

    it('should include infinite scroll if hasInfiniteScroll returns true', () => {
      spyOn(component, <any>'hasInfiniteScroll').and.returnValue(true);
      spyOn(component, <any>'includeInfiniteScroll');
      component.listboxItemList = {
        nativeElement: { offsetHeight: 100, scrollTop: 100, scrollHeight: 200 }
      };

      component['checkInfiniteScroll']();

      expect(component['includeInfiniteScroll']).toHaveBeenCalled();
    });

    it('should not include infinite scroll if hasInfiniteScroll returns false', () => {
      spyOn(component, <any>'hasInfiniteScroll').and.returnValue(false);
      spyOn(component, <any>'includeInfiniteScroll');

      component['checkInfiniteScroll']();

      expect(component['includeInfiniteScroll']).not.toHaveBeenCalled();
    });

    it('should call focus on element listboxItemList.nativeElement', () => {
      component.listboxItemList = {
        nativeElement: {
          focus: () => {}
        }
      };
      const spyListBoxComponent = spyOn(component.listboxItemList.nativeElement, 'focus');
      component.items = [{ label: 'item 1', value: 'item 1' }];

      component.setFocus();

      expect(spyListBoxComponent).toHaveBeenCalled();
    });

    it('hasInfiniteScroll: should be called when has infiniteScroll and has poComboBody', () => {
      component.infiniteScroll = true;
      component.listboxItemList = {
        nativeElement: { offsetHeight: 100, scrollTop: 100, scrollHeight: 150 }
      };

      const test = component['hasInfiniteScroll']();

      expect(test).toBeTruthy();
    });

    it('hasInfiniteScroll: should be called when has infiniteScroll and poComboBody is undefined', () => {
      component.infiniteScroll = true;
      component.listboxItemList = undefined;

      const test = component['hasInfiniteScroll']();

      expect(test).toBeFalsy();
    });

    it('should`nt include infinite scroll and subscribe to scroll event', () => {
      component.listboxItemList = {
        nativeElement: { offsetHeight: 100, scrollTop: 100, scrollHeight: 200 }
      };
      spyOn(component, 'scrollListener').and.returnValue(
        of({ target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 100 } })
      );
      const showMoreInfiniteScroll = spyOn(component, 'showMoreInfiniteScroll');
      fixture.detectChanges();

      component['includeInfiniteScroll']();

      expect(component['subscriptionScrollEvent']).toBeDefined();
      expect(showMoreInfiniteScroll).toHaveBeenCalled();
    });

    it('should cancel previous subscription before including infinite scroll', () => {
      spyOn(component, 'showMoreInfiniteScroll');
      component.listboxItemList = {
        nativeElement: { offsetHeight: 100, scrollTop: 100, scrollHeight: 200 }
      };
      spyOn(component, 'scrollListener').and.returnValue(
        of({ target: { offsetHeight: 100, scrollTop: 100, scrollHeight: 100 } })
      );
      component['includeInfiniteScroll']();

      expect(component['subscriptionScrollEvent']).toBeDefined();
      expect(component['scrollEvent']).toEqual(undefined);
      expect(component['subscriptionScrollEvent'].closed).toBeTruthy();
      expect(component.showMoreInfiniteScroll).toHaveBeenCalled();
      expect(component.scrollListener).toHaveBeenCalledWith(component.listboxItemList?.nativeElement);
    });

    it('should not unsubscribe if there is no previous subscription', () => {
      spyOn(component, 'scrollListener').and.returnValue(of({}));
      spyOn(component, 'showMoreInfiniteScroll');
      fixture.detectChanges();

      component['includeInfiniteScroll']();

      expect(component['subscriptionScrollEvent']).toBeDefined();
      expect(component['scrollEvent']).toBeUndefined();
    });

    it('should not include infinite scroll if scrollEvent$ is not created', () => {
      component['scrollEvent'] = undefined;
      spyOn(component, 'scrollListener').and.returnValue(of({}));
      spyOn(component, 'showMoreInfiniteScroll');
      spyOn<any>(component, 'includeInfiniteScroll');
      fixture.detectChanges();

      component['includeInfiniteScroll']();

      expect(component['includeInfiniteScroll']).toHaveBeenCalled();
    });

    describe('ngAfterViewInit:', () => {
      it('should focus the first item and dispatch focus event when listboxSubitems is defined', fakeAsync(() => {
        component.listboxSubitems = true;

        const mockElement = document.createElement('div');
        spyOn(mockElement, 'focus');
        spyOn(mockElement, 'dispatchEvent');

        component.listboxItems = {
          first: new ElementRef(mockElement)
        } as QueryList<ElementRef>;

        spyOn(globalThis, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
          cb(0);
          return 0;
        });

        component.ngAfterViewInit();

        tick();

        expect(mockElement.focus).toHaveBeenCalled();
        expect(mockElement.dispatchEvent).toHaveBeenCalledWith(jasmine.any(FocusEvent));
      }));

      it('should have been called', () => {
        spyOn(component, <any>'setListBoxMaxHeight');

        component.ngAfterViewInit();

        expect(component['setListBoxMaxHeight']).toHaveBeenCalled();
      });

      it('should call focus', () => {
        component.items = [{ label: 'Item 1', value: 1 }];
        fixture.detectChanges();

        spyOn(component.listboxItemList.nativeElement, 'focus');

        component.ngAfterViewInit();

        expect(component.listboxItemList.nativeElement.focus).toHaveBeenCalled();
      });

      it('should not call focus', () => {
        component.items = [{ label: 'Item 1', value: 1 }];
        fixture.detectChanges();
        component.listboxItemList = undefined;

        component.ngAfterViewInit();

        expect(component.listboxItemList?.nativeElement).toBeUndefined();
      });

      describe('openUrl:', () => {
        beforeEach(() => {
          component.items = [{ label: 'a', value: 'a', url: 'http://google.com.br' }];
        });
        it('should be open a external link', () => {
          const url = 'http://google.com';
          spyOn(UtilFunctions, <any>'openExternalLink');
          component['openUrl'](url);

          expect(UtilFunctions.openExternalLink).toHaveBeenCalledWith(url);
        });

        it('should be open a internal route', () => {
          spyOn(UtilFunctions, 'isExternalLink');
          spyOn(component['router'], <any>'navigate');
          const url = '/home';

          component['openUrl'](url);

          expect(UtilFunctions.isExternalLink).toHaveBeenCalled();
          expect(component['router'].navigate).toHaveBeenCalledWith([url]);
        });
      });

      describe('returnBooleanValue:', () => {
        it('should be called with value', () => {
          const item = { label: 'a', action: () => {}, value: 'a' };
          const expected = component['returnBooleanValue'](item, 'value');
          expect(expected).toBeTruthy();
        });
        it('should be called with function', () => {
          const item = { label: 'a', action: () => {}, value: 'a' };
          const expected = component['returnBooleanValue'](item, 'action');
          expect(expected).toBe(item.action());
        });
      });

      describe('onSelectItem:', () => {
        it('should be called and disabled is true', () => {
          const item = { label: 'a', action: () => {}, value: 'a', disabled: true };
          spyOn(component, <any>'openUrl');
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).not.toHaveBeenCalled();
          expect(component['openUrl']).not.toHaveBeenCalled();
        });

        it('should be onClickTabs if `isTabs` and tab is not disabled or hide', () => {
          const item = { label: 'a', action: () => {}, value: 'a', disabled: false, hide: false };
          component.isTabs = true;
          spyOn(component, 'onClickTabs');

          component.onSelectItem(item);

          expect(component.onClickTabs).toHaveBeenCalled();
        });

        it('should`n called action if disabled is a function that returns true', () => {
          const fnTrue = () => true;
          const item = { label: 'a', action: () => {}, value: 'a', disabled: fnTrue };
          spyOn(component, <any>'openUrl');
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).not.toHaveBeenCalled();
          expect(component['openUrl']).not.toHaveBeenCalled();
        });

        it('should called action if disabled is a function that returns false', () => {
          const fnFalse = () => false;
          const item = { label: 'a', action: () => {}, value: 'a', disabled: fnFalse };
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).toHaveBeenCalled();
        });

        it('should called action if disabled is a function that returns false and visible is undefined', () => {
          const fnFalse = () => false;
          const item = { label: 'a', action: () => {}, value: 'a', disabled: fnFalse, visible: undefined };
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).toHaveBeenCalled();
        });

        it('should be called with action', () => {
          const item = { label: 'a', action: () => {}, value: 'a' };
          spyOn(component, <any>'openUrl');
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).toHaveBeenCalled();
          expect(component['openUrl']).not.toHaveBeenCalled();
        });

        it('should be called with url', () => {
          const item = { label: 'a', url: 'http://fakeurl.com', value: 'a' };
          const url = 'http://fakeurl.com';
          spyOn(component, <any>'openUrl');

          component.onSelectItem(item);

          expect(component['openUrl']).toHaveBeenCalledWith(url);
        });

        it('should`n called openUrl if visible is false', () => {
          const item = { label: 'a', url: 'http://fakeurl.com', value: 'a', visible: false };
          const url = 'http://fakeurl.com';
          spyOn(component, <any>'openUrl');

          component.onSelectItem(item);

          expect(component['openUrl']).not.toHaveBeenCalledWith(url);
        });

        it('should`n called openUrl if visible is a function that returns false ', () => {
          const fnFalse = () => false;
          const item = { label: 'a', url: 'http://fakeurl.com', value: 'a', visible: fnFalse };
          const url = 'http://fakeurl.com';
          spyOn(component, <any>'openUrl');

          component.onSelectItem(item);

          expect(component['openUrl']).not.toHaveBeenCalledWith(url);
        });

        it('should called openUrl if visible is a function that return true and not disabled', () => {
          const fnTrue = () => true;
          const item = { label: 'a', url: 'http://fakeurl.com', value: 'a', visible: fnTrue };
          const url = 'http://fakeurl.com';
          spyOn(component, <any>'openUrl');

          component.onSelectItem(item);

          expect(component['openUrl']).toHaveBeenCalledWith(url);
        });

        it('should called openUrl if visible is a function that return true and disable is undefined', () => {
          const fnTrue = () => true;
          const item = { label: 'a', url: 'http://fakeurl.com', value: 'a', visible: fnTrue, disable: undefined };
          const url = 'http://fakeurl.com';
          spyOn(component, <any>'openUrl');

          component.onSelectItem(item);

          expect(component['openUrl']).toHaveBeenCalledWith(url);
        });

        it('should`n called openUrl if visible is true and not disabled', () => {
          const item = { label: 'a', url: 'http://fakeurl.com', value: 'a', visible: true };
          const url = 'http://fakeurl.com';
          spyOn(component, <any>'openUrl');

          component.onSelectItem(item);

          expect(component['openUrl']).toHaveBeenCalledWith(url);
        });

        it('should`n be called action if visible is false', () => {
          const item = { label: 'a', action: () => {}, value: 'a', visible: false };
          spyOn(component, <any>'openUrl');
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).not.toHaveBeenCalled();
          expect(component['openUrl']).not.toHaveBeenCalled();
        });

        it('should be called action if visible is true and not disabled', () => {
          const item = { label: 'a', action: () => {}, value: 'a', visible: true };
          spyOn(component, <any>'openUrl');
          spyOn<any>(item, 'action');

          component.onSelectItem(item);

          expect(item.action).toHaveBeenCalled();
          expect(component['openUrl']).not.toHaveBeenCalled();
        });

        it('should call openGroup when item has subItems', () => {
          const item = {
            label: 'Group',
            value: 'group1',
            subItems: [{ label: 'SubItem 1', value: 1 }]
          };
          const event = new MouseEvent('click');

          spyOn(component, 'openGroup');

          component.onSelectItem(item, event);

          expect(component.openGroup).toHaveBeenCalledWith(item, event);
        });

        it('should emit closeEvent when there are no subItems and listboxSubitems is defined', () => {
          const mockItem = { label: 'Item sem subitems' } as any;
          component.listboxSubitems = true;

          const emitSpy = spyOn(component.closeEvent, 'emit');

          component.onSelectItem(mockItem);

          expect(emitSpy).toHaveBeenCalled();
        });
      });
    });

    describe('openGroup and goBack:', () => {
      beforeEach(() => {
        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
          cb(0);
          return 0;
        });
      });

      it('openGroup should set currentGroup/currentItems and focus first item', done => {
        component.listboxGroupHeader = new ElementRef(document.createElement('div'));
        component.currentGroup = null;
        component.currentItems = [];

        const group = { label: 'Group', subItems: [{ label: 'Sub' }] } as PoDropdownAction;

        spyOn(component.listboxGroupHeader.nativeElement, 'focus');

        component.openGroup(group, new MouseEvent('click'));

        expect(component.currentGroup).toBe(group);
        expect(component.currentItems).toEqual(group.subItems as Array<PoDropdownAction>);

        setTimeout(() => {
          expect(component.listboxGroupHeader.nativeElement.focus).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('goBack should restore previous group/items or default items and focus first item', done => {
        const firstItemEl = document.createElement('li');
        component.listboxItems = {
          first: { nativeElement: firstItemEl }
        } as any;
        component.items = [{ label: 'Item1' }];

        spyOn(firstItemEl, 'focus');

        component.goBack(new MouseEvent('click'));
        expect(component.currentGroup).toBeNull();
        expect(component.currentItems).toEqual(component.items);

        setTimeout(() => {
          expect(firstItemEl.focus).toHaveBeenCalled();
          done();
        }, 20);
      });

      it('should handle openGroup and goBack correctly even with multiple groups and empty subItems', () => {
        component.listboxGroupHeader = new ElementRef(document.createElement('div'));
        spyOn(component.listboxGroupHeader.nativeElement, 'focus');

        const group1 = { label: 'Group1', subItems: [{ label: 'Sub1' }] } as PoDropdownAction;
        component.openGroup(group1);

        expect(component.currentGroup).toEqual(group1);
        expect(component.currentItems).toEqual(group1.subItems as Array<PoDropdownAction>);
        expect((component as any).navigationStack.length).toBe(1);

        const group2 = { label: 'Group2', subItems: [{ label: 'Sub2' }] } as PoDropdownAction;
        component.openGroup(group2);

        expect(component.currentGroup).toEqual(group2);
        expect(component.currentItems).toEqual(group2.subItems as Array<PoDropdownAction>);
        expect((component as any).navigationStack.length).toBe(2);

        component.goBack(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(component.currentGroup).toEqual(group1);
        expect(component.currentItems).toEqual(group1.subItems as Array<PoDropdownAction>);
        expect((component as any).navigationStack.length).toBe(1);

        const groupWithoutSubItems = { label: 'EmptyGroup' } as PoDropdownAction;
        component.openGroup(groupWithoutSubItems);

        expect(component.currentGroup).toEqual(groupWithoutSubItems);
        expect(component.currentItems).toEqual([]);
        expect((component as any).navigationStack.length).toBe(2);
      });

      it('onKeydownTemplate: should emit closeEvent if press Tab out .po-listbox-dropdown', () => {
        const emitSpy = spyOn(component.closeEvent, 'emit');
        const stopSpy = jasmine.createSpy('stopPropagation');

        const event = {
          code: 'Tab',
          target: document.createElement('div'),
          stopPropagation: stopSpy
        } as unknown as KeyboardEvent;

        component['onKeydownTemplate'](event);

        expect(stopSpy).not.toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
      });

      it('onKeydownTemplate: should call stopPropagation and not emit closeEvent when press Tab in .po-listbox-dropdown', () => {
        const emitSpy = spyOn(component.closeEvent, 'emit');
        const stopSpy = jasmine.createSpy('stopPropagation');

        const dropdown = document.createElement('div');
        dropdown.classList.add('po-listbox-dropdown');

        const child = document.createElement('div');
        dropdown.appendChild(child);
        document.body.appendChild(dropdown);

        const event = {
          code: 'Tab',
          target: child,
          stopPropagation: stopSpy
        } as unknown as KeyboardEvent;

        component['onKeydownTemplate'](event);

        expect(stopSpy).toHaveBeenCalled();
        expect(emitSpy).not.toHaveBeenCalled();

        dropdown.remove();
      });

      it('onKeydownGoBack: should not emit closeEvent if subItemTemplate is true', () => {
        const eventTab = new KeyboardEvent('keydown', { code: 'Tab' });

        spyOn(component.closeEvent, 'emit');

        component.onKeydownGoBack(eventTab, { label: 'item', $subItemTemplate: true as any });
        expect(component.closeEvent.emit).not.toHaveBeenCalled();
      });

      it('onKeydownGoBack should call goBack on Enter, emit closeEvent on Escape or Tab', () => {
        const eventEnter = new KeyboardEvent('keydown', { key: 'Enter' });
        const eventEscape = new KeyboardEvent('keydown', { code: 'Escape' });
        const eventTab = new KeyboardEvent('keydown', { code: 'Tab' });

        spyOn(component, 'goBack');
        spyOn(component.closeEvent, 'emit');

        component.onKeydownGoBack(eventEnter);
        expect(component.goBack).toHaveBeenCalledWith(eventEnter);

        component.onKeydownGoBack(eventEscape);
        expect(component.closeEvent.emit).toHaveBeenCalled();

        component.onKeydownGoBack(eventTab);
        expect(component.closeEvent.emit).toHaveBeenCalledTimes(2);
      });

      it('onKeydownGoBack: should call goBack on ArrowLeft', () => {
        const eventArrowLeft = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

        spyOn(component, 'goBack');

        component.onKeydownGoBack(eventArrowLeft);

        expect(component.goBack).toHaveBeenCalledWith(eventArrowLeft);
      });
    });
    it('ngOnInit should set currentItems to items if listboxSubitems is true', () => {
      component.listboxSubitems = true;
      component.items = [{ label: 'Item 1', value: 1 }];

      component.ngOnInit();

      expect(component.currentItems).toEqual(component.items);
    });

    describe('onSelectTabs:', () => {
      it('Should emit if changeStateTabs if `isTabs` and has tab', () => {
        component.isTabs = true;
        spyOn(component.changeStateTabs, 'emit');

        component.onSelectTabs({ label: 'tab', click: () => {} });

        expect(component.changeStateTabs.emit).toHaveBeenCalled();
      });
    });

    describe('onClickTabs:', () => {
      it('Should emit if clickTab if tabs is not disabled', () => {
        component.isTabs = true;
        spyOn(component.clickTab, 'emit');

        component.onClickTabs({ label: 'tab', click: () => {}, disabled: false });

        expect(component.clickTab.emit).toHaveBeenCalled();
      });
    });

    describe('ngOnDestroy:', () => {
      const mockSubscription: Subscription = new Subscription();

      it('ngOnDestroy: should unsubscribe if infiniteScroll is true', () => {
        component.infiniteScroll = true;
        component['subscriptionScrollEvent'] = mockSubscription;

        spyOn(mockSubscription, <any>'unsubscribe');

        component.ngOnDestroy();

        expect(mockSubscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('ngOnChanges:', () => {
      it(`should call 'setListBoxMaxHeight' when has changes`, () => {
        spyOn(component, <any>'setListBoxMaxHeight');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component.ngOnChanges({
          items: new SimpleChange(null, component.items, true)
        });

        expect(component['setListBoxMaxHeight']).toHaveBeenCalled();
      });

      it(`should'n call 'setListBoxMaxHeight' when has changes`, () => {
        spyOn(component, <any>'checkInfiniteScroll');
        spyOn(component, <any>'setListBoxMaxHeight');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];
        component.infiniteScroll = true;

        component.ngOnChanges();

        expect(component['checkInfiniteScroll']).not.toHaveBeenCalled();
        expect(component['setListBoxMaxHeight']).not.toHaveBeenCalled();
      });

      it('should call `checkInfiniteScroll` if infiniteScroll is true', () => {
        const checkInfiniteScroll = spyOn<any>(component, 'checkInfiniteScroll');
        component.infiniteScroll = true;
        fixture.componentRef.setInput('p-visible', true);
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component.ngOnChanges();

        expect(checkInfiniteScroll).toHaveBeenCalled();
      });
    });

    describe('setListBoxMaxHeight', () => {
      it('should be call `renderer.setStyle` when has more than 6 items', () => {
        spyOn<any>(component['renderer'], 'setStyle');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 },
          { label: 'Item 4', value: 4 },
          { label: 'Item 5', value: 5 },
          { label: 'Item 6', value: 6 },
          { label: 'Item 7', value: 7 }
        ];

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).toHaveBeenCalled();

        component.type = 'check';
        component.hideSearch = false;
        component['setListBoxMaxHeight']();
        expect(component['renderer'].setStyle).toHaveBeenCalled();
      });

      it(`should'n be call 'renderer.setStyle' when has less then 6 items`, () => {
        spyOn<any>(component['renderer'], 'setStyle');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).not.toHaveBeenCalled();
      });

      it('should call `renderer.setStyle` and `renderer.removeStyle` when has more than 6 items and popupHeaderContainer contains children', () => {
        spyOn<any>(component['renderer'], 'setStyle');
        spyOn<any>(component['renderer'], 'removeStyle');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 },
          { label: 'Item 4', value: 4 },
          { label: 'Item 5', value: 5 },
          { label: 'Item 6', value: 6 },
          { label: 'Item 7', value: 7 }
        ];

        component.type = 'action';
        component.popupHeaderContainer = new ElementRef(document.createElement('div'));
        component.popupHeaderContainer.nativeElement.appendChild(document.createElement('div'));

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).toHaveBeenCalledWith(
          component.listbox.nativeElement.querySelector('ul[role=listbox]'),
          'maxHeight',
          `${44 * 6 - 44 / 3}px`
        );
        expect(component['renderer'].removeStyle).toHaveBeenCalledWith(component.listbox.nativeElement, 'maxHeight');
      });

      it(`should'n call 'renderer.removeStyle' when has more than 6 items and popupHeaderContainer is undefined`, () => {
        spyOn<any>(component['renderer'], 'setStyle');
        spyOn<any>(component['renderer'], 'removeStyle');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 },
          { label: 'Item 4', value: 4 },
          { label: 'Item 5', value: 5 },
          { label: 'Item 6', value: 6 },
          { label: 'Item 7', value: 7 }
        ];

        component.type = 'action';

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).toHaveBeenCalledWith(
          component.listbox.nativeElement,
          'maxHeight',
          `${44 * 6 - 44 / 3}px`
        );
        expect(component['renderer'].removeStyle).not.toHaveBeenCalledWith(
          component.listbox.nativeElement,
          'maxHeight'
        );
      });

      it('should set maxHeight to dropdownMaxHeight when listboxSubitems is true', () => {
        spyOn<any>(component['renderer'], 'setStyle');

        component.listboxSubitems = true;
        component.listbox = new ElementRef(document.createElement('div'));

        component['setListBoxMaxHeight']();

        expect(component['renderer'].setStyle).toHaveBeenCalledWith(
          component.listbox.nativeElement,
          'maxHeight',
          '400px'
        );
      });
    });

    it('should set minWidth and maxWidth when listboxSubitems is true and items exist', () => {
      spyOn<any>(component['renderer'], 'setStyle');

      component.listboxSubitems = true;
      component.items = [
        { label: 'Item 1', value: 1 },
        { label: 'Item 2', value: 2 }
      ];
      component.listbox = new ElementRef(document.createElement('div'));

      component['setListBoxWidth']();

      expect(component['renderer'].setStyle).toHaveBeenCalledWith(component.listbox.nativeElement, 'minWidth', '240px');

      expect(component['renderer'].setStyle).toHaveBeenCalledWith(component.listbox.nativeElement, 'maxWidth', '340px');
    });

    describe('checkboxClicked:', () => {
      it('should emit change ', () => {
        spyOn(component.change, 'emit');
        component.type = 'check';
        component.checkboxClicked({ option: [{ value: 'test', label: 'test' }], selected: true });

        expect(component.change.emit).toHaveBeenCalled();
      });
    });

    describe('onSelectCheckBoxItem:', () => {
      it('should call `checkboxClicked`', () => {
        spyOn(component, 'checkboxClicked');
        component.type = 'check';
        component.onSelectCheckBoxItem({ option: [{ value: 'test', label: 'test' }], selected: true });

        expect(component.checkboxClicked).toHaveBeenCalled();
      });
    });

    describe('onActivatedTabs:', () => {
      it('should emit activatedTab', () => {
        spyOn(component.activatedTab, 'emit');
        component.onActivatedTabs({ label: 'tab' });

        expect(component.activatedTab.emit).toHaveBeenCalled();
      });
    });

    describe('changeAllEmit:', () => {
      it('should emit changeAll if event is Enter', () => {
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Enter' });
        spyOn(component.changeAll, 'emit');

        component.changeAllEmit(eventEnterKey);

        expect(component.changeAll.emit).toHaveBeenCalled();
      });

      it('should emit changeAll if event is Space', () => {
        const eventSpaceKey = new KeyboardEvent('keydown', { 'code': 'Space' });
        spyOn(component.changeAll, 'emit');

        component.changeAllEmit(eventSpaceKey);

        expect(component.changeAll.emit).toHaveBeenCalled();
      });
    });

    describe('callChangeSearch:', () => {
      it('should emit changeSearch', () => {
        spyOn(component.changeSearch, 'emit');

        component.callChangeSearch('test');

        expect(component.changeSearch.emit).toHaveBeenCalled();
      });
    });

    describe('isSelectedItem:', () => {
      it('should return false if option is not selected', () => {
        const selectedOptions = [
          { label: 'Option 1', value: 'value1' },
          { label: 'Option 2', value: 'value2' }
        ];
        component.selectedOptions = selectedOptions;
        const option = { label: 'Option 3', value: 'value3' };
        const result = component.isSelectedItem(option);
        expect(result).toBeFalsy();
      });

      it('should return true if option is selected', () => {
        const selectedOptions = [
          { label: 'Option 1', value: 'value1' },
          { label: 'Option 2', value: 'value2' }
        ];
        component.selectedOptions = selectedOptions;
        const option = { label: 'Option 2', value: 'value2' };
        const result = component.isSelectedItem(option);
        expect(result).toBeTruthy();
      });
    });

    describe('getSelectedItem:', () => {
      it('should return undefined when items is empty', () => {
        component.items = [];

        expect(component['getSelectedItem']()).toBeUndefined();
      });

      it('should return undefined when items is undefined', () => {
        component.items = undefined;

        expect(component['getSelectedItem']()).toBeUndefined();
      });

      it('should return the item when it is selected by `isSelectedItem`', () => {
        const item = { label: 'Option 2', value: 'value2' };
        component.items = [{ label: 'Option 1', value: 'value1' }, item];
        component.selectedOptions = [{ label: 'Option 2', value: 'value2' }];

        expect(component['getSelectedItem']()).toBe(item);
      });

      it('should return the item when it has the `selected` property', () => {
        const item = { label: 'Option 2', value: 'value2', selected: true };
        component.items = [{ label: 'Option 1', value: 'value1' }, item];
        component.selectedOptions = [];

        expect(component['getSelectedItem']()).toBe(item);
      });

      it('should return undefined when no item matches', () => {
        component.items = [
          { label: 'Option 1', value: 'value1' },
          { label: 'Option 2', value: 'value2' }
        ];
        component.selectedOptions = [];

        expect(component['getSelectedItem']()).toBeUndefined();
      });
    });

    describe('onKeydown:', () => {
      it('should call onSelectCheckBoxItem if event is `enter` and type is `check`', () => {
        const item = { label: 'a', value: 'a' };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Enter' });
        component.type = 'check';
        spyOn(component, 'onSelectCheckBoxItem');

        component.onKeyDown(item, eventEnterKey);

        expect(component.onSelectCheckBoxItem).toHaveBeenCalled();
      });

      it('should call onSelectCheckBoxItem when type is "check" and Enter key is pressed', () => {
        spyOn(component, 'onSelectCheckBoxItem');

        const keyboardEvent = new KeyboardEvent('keydown', {
          code: 'Enter'
        });

        component.type = 'check';
        component.onKeyDown('item', keyboardEvent);

        expect(component.onSelectCheckBoxItem).toHaveBeenCalledWith('item');
      });

      it('should call comboClicked when type is "option" and Enter key is pressed', () => {
        spyOn(component, 'optionClicked');

        const keyboardEvent = new KeyboardEvent('keydown', {
          code: 'Enter'
        });

        component.type = 'option';
        component.onKeyDown('item', keyboardEvent);

        expect(component.optionClicked).toHaveBeenCalledWith('item');
      });

      it('should call onSelectItem when type is "action" and Enter key is pressed', () => {
        spyOn(component, 'onSelectItem');

        const keyboardEvent = new KeyboardEvent('keydown', {
          code: 'Enter'
        });

        component.type = 'action';
        component.onKeyDown('item', keyboardEvent);

        expect(component.onSelectItem).toHaveBeenCalledWith('item');
      });

      it('should emit closeEvent when Escape key is pressed', () => {
        spyOn(component.closeEvent, 'emit');

        const keyboardEvent = new KeyboardEvent('keydown', {
          code: 'Escape'
        });

        component.onKeyDown('item', keyboardEvent);

        expect(component.closeEvent.emit).toHaveBeenCalled();
      });

      it('comboClicked: should emit selectCombo if `p-type` is option', () => {
        component.type = 'option';
        component.cdkListbox = { selectValue: () => {} } as any;
        spyOn(component.selectCombo, 'emit');

        component.items = [{ label: 'a', value: 'a' }];
        component.optionClicked(component.items[0]);

        expect(component.selectCombo.emit).toHaveBeenCalled();
        expect(component.items[0]).toEqual({ label: 'a', value: 'a', selected: true });
      });

      it('comboClicked: should emit selectCombo if `p-type` is option', () => {
        spyOn(component.selectCombo, 'emit');
        component.type = 'option';
        component.cdkListbox = { selectValue: () => {} } as any;
        component.items = [
          { label: 'option 1', value: 'option 2' },
          { label: 'option 3', value: 'option 4' }
        ];

        component.optionClicked(component.items[1]);

        expect(component.selectCombo.emit).toHaveBeenCalled();
        expect(component.items[0]).toEqual({ label: 'option 1', value: 'option 2', selected: false });
      });

      it('should`t call onSelectItem if event is not `space` or `enter`', () => {
        const item = { label: 'a', value: 'a' };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'esc' });

        spyOn(component, 'onSelectItem');

        component.onKeyDown(item, eventEnterKey);

        expect(component.onSelectItem).not.toHaveBeenCalled();
      });

      it('should call closeEvent if event is `Escape`', () => {
        const item = { label: 'a', value: 'a' };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Escape' });

        spyOn(component.closeEvent, 'emit');

        component.onKeyDown(item, eventEnterKey);

        expect(component.closeEvent.emit).toHaveBeenCalled();
      });

      it('should call onSelectItem on ArrowRight when item has subItems array', () => {
        const item = { label: 'Parent', subItems: [{ label: 'Child' }] };
        const eventArrowRight = new KeyboardEvent('keydown', { code: 'ArrowRight' });

        spyOn(component, 'onSelectItem');

        component.onKeyDown(item, eventArrowRight);

        expect(component.onSelectItem).toHaveBeenCalledWith(item, eventArrowRight);
      });

      it('should call goBack on ArrowLeft when in subitems context', () => {
        const item = { label: 'Child' };
        const eventArrowLeft = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

        component.listboxSubitems = true;
        component.currentGroup = { label: 'Parent' };
        spyOn(component, 'goBack');

        component.onKeyDown(item, eventArrowLeft);

        expect(component.goBack).toHaveBeenCalledWith(eventArrowLeft);
      });

      it('should not call goBack on ArrowLeft when not in subitems context', () => {
        const item = { label: 'Child' };
        const eventArrowLeft = new KeyboardEvent('keydown', { code: 'ArrowLeft' });

        component.listboxSubitems = false;
        component.currentGroup = null;
        spyOn(component, 'goBack');

        component.onKeyDown(item, eventArrowLeft);

        expect(component.goBack).not.toHaveBeenCalled();
      });

      it('should emit closeEvent on Tab keydown', () => {
        const mockEvent = new KeyboardEvent('keydown', { code: 'Tab' });

        spyOn(component.closeEvent, 'emit');

        component.onSelectAllCheckboxKeyDown(mockEvent);
        expect(component.closeEvent.emit).toHaveBeenCalled();
      });

      it('should call footerActionListboxEvent when keyboard enter', () => {
        const item = { type: 'footerAction' };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Enter' });

        spyOn(component.footerActionListboxEvent, 'emit');

        component.onKeyDown(item, eventEnterKey);

        expect(component.footerActionListboxEvent.emit).toHaveBeenCalled();
      });

      it('should call selectCombo when keyboard enter', () => {
        const item = {
          action: () => {}
        };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Enter' });

        spyOn(component.selectCombo, 'emit');

        component.type = 'option';
        component.cdkListbox = { selectValue: () => {} } as any;
        component.onKeyDown(item, eventEnterKey);

        expect(component.selectCombo.emit).toHaveBeenCalled();
      });
    });

    describe('getSizeLoading', () => {
      it('should return `md` when containerWidth > 180', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 0
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 190;

        expect((component as any).getSizeLoading()).toBe('md');
      });

      it('should return `sm` when containerWidth is between 140 and 180', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 0
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 150;
        expect((component as any).getSizeLoading()).toBe('sm');
      });

      it('should return `xs` when containerWidth < 140', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 0
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 130;
        expect((component as any).getSizeLoading()).toBe('xs');
      });

      it('should return `md` when listbox width > 180', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 181
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 0;
        expect((component as any).getSizeLoading()).toBe('md');
      });

      it('should return `sm` when listbox width is between 140 and 180', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 150
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 0;
        expect((component as any).getSizeLoading()).toBe('sm');
      });

      it('should return `xs` when listbox width < 140', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 120
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 0;
        expect((component as any).getSizeLoading()).toBe('xs');
      });
    });

    describe('getTextLoading', () => {
      it('should return space when containerWidth < 140', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 0
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 130;
        expect((component as any).getTextLoading()).toBe(' ');
      });

      it('should return empty string when containerWidth >= 140', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 0
        });

        component['listbox'] = listboxMock;
        component.containerWidth = 140;
        expect((component as any).getTextLoading()).toBe('');
      });

      it('should return space when listbox width < 140', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 120
        });

        component['listbox'] = listboxMock;
        component['containerWidth'] = 0;

        expect((component as any).getTextLoading()).toBe(' ');
      });

      it('should return empty string when listbox width >= 140', () => {
        const listboxMock = new ElementRef({
          offsetWidth: 140
        });

        component['listbox'] = listboxMock;
        component['containerWidth'] = 130;
        expect((component as any).getTextLoading()).toBe('');
      });
    });
  });

  describe('Templates:', () => {
    it('should be show listbox when has items', () => {
      const items = [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
        { label: 'c', value: 'c' },
        { label: 'd', value: 'd' }
      ];
      component.items = items;
      fixture.componentRef.setInput('p-visible', true);
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-listbox-item')).toBeTruthy();
    });
  });

  describe('Integration: ', () => {
    it('checkTemplate: should return truthy if items has items', () => {
      component.items = [{ label: '1', value: '1' }];

      expect(component.checkTemplate()).toBeTruthy();
    });

    it('checkTemplate: should return false if items is empty', () => {
      component.items = [];

      expect(component.checkTemplate()).toBeFalsy();
    });

    it('checkTemplate: should return false if cache is false and isServerSearching is true', () => {
      component.cache = false;
      component.isServerSearching = true;
      component.items = [{ label: '1', value: '1' }];

      expect(component.checkTemplate()).toBeFalsy();
    });

    it('checkTemplate: should return truthy if cache is false and isServerSearching is false', () => {
      component.cache = false;
      component.isServerSearching = false;
      component.items = [{ label: '1', value: '1' }];

      expect(component.checkTemplate()).toBeTruthy();
    });

    it('checkTemplate: should return falsy if cache is false and isServerSearching is false but items is empty', () => {
      component.cache = false;
      component.isServerSearching = false;
      component.items = [];

      expect(component.checkTemplate()).toBeFalsy();
    });

    it('check Template: should return true if footerActionListbox is true', () => {
      component.cache = false;
      component.isServerSearching = false;
      component.items = [];
      component.footerActionListbox = true;

      expect(component.checkTemplate()).toBeTruthy();
    });
  });

  describe('formatItemList', () => {
    it('should return item.id if isTabs is true', () => {
      component.isTabs = true;
      const item = { id: 'identifier' };
      expect(component.formatItemList(item)).toEqual('identifier');
    });

    it('should return stringified item if isTabs is false and item is stringifiable', () => {
      component.isTabs = false;
      const item = { name: 'Test' };
      expect(component.formatItemList(item)).toEqual(JSON.stringify(item));
    });

    it('should return item itself if isTabs is false and item cannot be stringified', () => {
      component.isTabs = false;
      const item: any = { self: null };
      item.self = item;
      const result = component.formatItemList(item);
      expect(result).toBe(item);
    });
  });

  describe('visible effect:', () => {
    it(`should call 'scrollToAndSelectCurrentItem' when visible is true, type is 'option' and listboxSubitems is false`, () => {
      const scrollToAndSelectCurrentItem = spyOn<any>(component, 'scrollToAndSelectCurrentItem');
      component.type = 'option';
      component.listboxSubitems = false;

      fixture.componentRef.setInput('p-visible', true);
      fixture.detectChanges();

      expect(scrollToAndSelectCurrentItem).toHaveBeenCalled();
    });

    it(`should not call 'scrollToAndSelectCurrentItem' when visible is false`, () => {
      const scrollToAndSelectCurrentItem = spyOn<any>(component, 'scrollToAndSelectCurrentItem');
      component.type = 'option';
      component.listboxSubitems = false;

      fixture.componentRef.setInput('p-visible', false);
      fixture.detectChanges();

      expect(scrollToAndSelectCurrentItem).not.toHaveBeenCalled();
    });

    it(`should not call 'scrollToAndSelectCurrentItem' when type is not 'option'`, () => {
      const scrollToAndSelectCurrentItem = spyOn<any>(component, 'scrollToAndSelectCurrentItem');
      component.type = 'check';
      component.listboxSubitems = false;

      fixture.componentRef.setInput('p-visible', true);
      fixture.detectChanges();

      expect(scrollToAndSelectCurrentItem).not.toHaveBeenCalled();
    });

    it(`should not call 'scrollToAndSelectCurrentItem' when listboxSubitems is true`, () => {
      const scrollToAndSelectCurrentItem = spyOn<any>(component, 'scrollToAndSelectCurrentItem');
      component.type = 'option';
      component.listboxSubitems = true;

      fixture.componentRef.setInput('p-visible', true);
      fixture.detectChanges();

      expect(scrollToAndSelectCurrentItem).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedItem:', () => {
    it('should return undefined when items is empty', () => {
      component.items = [];

      expect(component['getSelectedItem']()).toBeUndefined();
    });

    it('should return undefined when items is undefined', () => {
      component.items = undefined;

      expect(component['getSelectedItem']()).toBeUndefined();
    });

    it('should return the item flagged with `selected`', () => {
      const selectedItem = { label: 'b', value: 'b', selected: true };
      component.items = [{ label: 'a', value: 'a' }, selectedItem];
      spyOn(component, 'isSelectedItem').and.returnValue(false);

      expect(component['getSelectedItem']()).toBe(selectedItem);
    });

    it('should return the item found by `isSelectedItem`', () => {
      const selectedItem = { label: 'a', value: 'a' };
      component.items = [selectedItem, { label: 'b', value: 'b' }];
      spyOn(component, 'isSelectedItem').and.callFake((item: any) => item.value === 'a');

      expect(component['getSelectedItem']()).toBe(selectedItem);
    });

    it('should return undefined when there is no selected item', () => {
      component.items = [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' }
      ];
      spyOn(component, 'isSelectedItem').and.returnValue(false);

      expect(component['getSelectedItem']()).toBeUndefined();
    });
  });

  describe('scrollToAndSelectCurrentItem:', () => {
    it('should call `scrollIntoView` on the item with `aria-selected` true and `selectValue` when there is a selected item', () => {
      const scrollIntoViewSpy = jasmine.createSpy('scrollIntoView');
      const selectedElement = {
        nativeElement: {
          getAttribute: (attr: string) => (attr === 'aria-selected' ? 'true' : null),
          scrollIntoView: scrollIntoViewSpy
        }
      };
      const notSelectedElement = {
        nativeElement: {
          getAttribute: () => 'false',
          scrollIntoView: jasmine.createSpy('scrollIntoView')
        }
      };
      component.listboxItems = {
        toArray: () => [notSelectedElement, selectedElement]
      } as any;

      const selectedItem = { label: 'b', value: 'b' };
      spyOn<any>(component, 'getSelectedItem').and.returnValue(selectedItem);
      const selectValueSpy = jasmine.createSpy('selectValue');
      component.cdkListbox = { selectValue: selectValueSpy } as any;

      component.scrollToAndSelectCurrentItem();

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({ block: 'nearest' });
      expect(selectValueSpy).toHaveBeenCalledWith(selectedItem[component.fieldLabel]);
    });

    it('should not call `selectValue` when there is no selected item', () => {
      const element = {
        nativeElement: {
          getAttribute: () => 'false',
          scrollIntoView: jasmine.createSpy('scrollIntoView')
        }
      };
      component.listboxItems = {
        toArray: () => [element]
      } as any;

      spyOn<any>(component, 'getSelectedItem').and.returnValue(undefined);
      const selectValueSpy = jasmine.createSpy('selectValue');
      component.cdkListbox = { selectValue: selectValueSpy } as any;

      component.scrollToAndSelectCurrentItem();

      expect(selectValueSpy).not.toHaveBeenCalled();
    });

    it('should not throw and default to empty array when `listboxItems` is undefined', () => {
      component.listboxItems = undefined as any;
      spyOn<any>(component, 'getSelectedItem').and.returnValue(undefined);
      const selectValueSpy = jasmine.createSpy('selectValue');
      component.cdkListbox = { selectValue: selectValueSpy } as any;

      expect(() => component.scrollToAndSelectCurrentItem()).not.toThrow();
      expect(selectValueSpy).not.toHaveBeenCalled();
    });

    it('should not throw when `cdkListbox` is undefined even if there is a selected item', () => {
      const element = {
        nativeElement: {
          getAttribute: () => 'false',
          scrollIntoView: jasmine.createSpy('scrollIntoView')
        }
      };
      component.listboxItems = {
        toArray: () => [element]
      } as any;

      const selectedItem = { label: 'b', value: 'b' };
      spyOn<any>(component, 'getSelectedItem').and.returnValue(selectedItem);
      component.cdkListbox = undefined;

      expect(() => component.scrollToAndSelectCurrentItem()).not.toThrow();
    });
  });

  describe('onListboxFocusIn:', () => {
    let setActiveOptionSpy: jasmine.Spy;
    let isActiveSpy: jasmine.Spy;

    beforeEach(() => {
      setActiveOptionSpy = jasmine.createSpy('_setActiveOption');
      isActiveSpy = jasmine.createSpy('isActive').and.returnValue(false);
      component.cdkListbox = {
        _setActiveOption: setActiveOptionSpy,
        isActive: isActiveSpy
      } as any;
    });

    it('should return early when `type` is not `option`', () => {
      component.type = 'check';
      component.listboxSubitems = false;

      component['onListboxFocusIn']({ target: document.createElement('li') } as any);

      expect(setActiveOptionSpy).not.toHaveBeenCalled();
    });

    it('should return early when `listboxSubitems` is true', () => {
      component.type = 'option';
      component.listboxSubitems = true;

      component['onListboxFocusIn']({ target: document.createElement('li') } as any);

      expect(setActiveOptionSpy).not.toHaveBeenCalled();
    });

    it('should return early when `cdkListbox` is undefined', () => {
      component.type = 'option';
      component.listboxSubitems = false;
      component.cdkListbox = undefined;

      expect(() => component['onListboxFocusIn']({ target: document.createElement('li') } as any)).not.toThrow();
      expect(setActiveOptionSpy).not.toHaveBeenCalled();
    });

    it('should call `_setActiveOption` when the focused element is the option element and it is not active', () => {
      component.type = 'option';
      component.listboxSubitems = false;
      const focusedElement = document.createElement('li');
      const focusedOption = { element: focusedElement } as any;
      component.cdkOptions = { find: (cb: any) => [focusedOption].find(cb) } as any;

      component['onListboxFocusIn']({ target: focusedElement } as any);

      expect(setActiveOptionSpy).toHaveBeenCalledWith(focusedOption);
    });

    it('should find the option when the focused element is a child of the option element', () => {
      component.type = 'option';
      component.listboxSubitems = false;
      const optionElement = document.createElement('li');
      const childElement = document.createElement('span');
      optionElement.appendChild(childElement);
      const focusedOption = { element: optionElement } as any;
      component.cdkOptions = { find: (cb: any) => [focusedOption].find(cb) } as any;

      component['onListboxFocusIn']({ target: childElement } as any);

      expect(setActiveOptionSpy).toHaveBeenCalledWith(focusedOption);
    });

    it('should not call `_setActiveOption` when the focused option is already active', () => {
      component.type = 'option';
      component.listboxSubitems = false;
      isActiveSpy.and.returnValue(true);
      const focusedElement = document.createElement('li');
      const focusedOption = { element: focusedElement } as any;
      component.cdkOptions = { find: (cb: any) => [focusedOption].find(cb) } as any;

      component['onListboxFocusIn']({ target: focusedElement } as any);

      expect(setActiveOptionSpy).not.toHaveBeenCalled();
    });

    it('should not call `_setActiveOption` when no matching option is found', () => {
      component.type = 'option';
      component.listboxSubitems = false;
      const focusedElement = document.createElement('li');
      component.cdkOptions = { find: () => undefined } as any;

      component['onListboxFocusIn']({ target: focusedElement } as any);

      expect(setActiveOptionSpy).not.toHaveBeenCalled();
    });

    it('should not throw when `cdkOptions` is undefined', () => {
      component.type = 'option';
      component.listboxSubitems = false;
      component.cdkOptions = undefined;

      expect(() => component['onListboxFocusIn']({ target: document.createElement('li') } as any)).not.toThrow();
      expect(setActiveOptionSpy).not.toHaveBeenCalled();
    });
  });

  describe('optionClicked:', () => {
    it('should call `cdkListbox.selectValue` and emit `selectCombo` when type is `option`', () => {
      component.type = 'option';
      component.items = [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' }
      ];
      const selectValueSpy = jasmine.createSpy('selectValue');
      component.cdkListbox = { selectValue: selectValueSpy } as any;
      spyOn(component.selectCombo, 'emit');

      const option = { label: 'b', value: 'b' };
      component.optionClicked(option);

      expect(selectValueSpy).toHaveBeenCalledWith(option[component.fieldLabel]);
      expect(component.selectCombo.emit).toHaveBeenCalledWith({ ...option });
    });

    it('should not call `cdkListbox.selectValue` when type is not `option`', () => {
      component.type = 'action';
      const selectValueSpy = jasmine.createSpy('selectValue');
      component.cdkListbox = { selectValue: selectValueSpy } as any;
      spyOn(component.selectCombo, 'emit');

      component.optionClicked({ label: 'a', value: 'a' });

      expect(selectValueSpy).not.toHaveBeenCalled();
      expect(component.selectCombo.emit).not.toHaveBeenCalled();
    });
  });

  describe('Subitems lazy loading:', () => {
    beforeEach(() => {
      spyOn(component as any, 'focusGroupHeader');
    });

    it('openGroup: should load static array subItems synchronously', () => {
      const group: PoDropdownAction = { label: 'G', subItems: [{ label: 'A' }, { label: 'B' }] };

      component.openGroup(group);

      expect(component.currentGroup).toBe(group);
      expect(component.currentItems.length).toBe(2);
    });

    it('subItemsSkeletonPlaceholders: should expose placeholder list for skeleton rendering', () => {
      expect(Array.isArray(component.subItemsSkeletonPlaceholders)).toBeTrue();
      expect(component.subItemsSkeletonPlaceholders.length).toBeGreaterThan(0);
    });

    it('openGroup: should render skeleton elements while loading the subitems', fakeAsync(() => {
      const source = new Subject<Array<PoDropdownAction>>();
      const group: PoDropdownAction = { label: 'G', subItems: () => source.asObservable() };
      component.listboxSubitems = true;

      component.openGroup(group);
      fixture.detectChanges();

      const loadingContainer = nativeElement.querySelector('.po-listbox-subitems-loading');
      expect(loadingContainer).toBeTruthy();
      expect(loadingContainer.querySelectorAll('po-skeleton').length).toBe(
        component.subItemsSkeletonPlaceholders.length
      );

      source.next([{ label: 'ok' }]);
      source.complete();
      tick();
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-listbox-subitems-loading')).toBeNull();
    }));

    it('openGroup: should call the function and populate items on success', fakeAsync(() => {
      const items = [{ label: 'X' }, { label: 'Y' }];
      const group: PoDropdownAction = { label: 'G', subItems: () => of(items) };
      spyOn(component.subItemsLoad, 'emit');

      component.openGroup(group);
      tick();

      expect(component.subItemsLoad.emit).toHaveBeenCalledWith(group);
      expect(component.currentItems).toEqual(items);
      expect(component.isSubItemsLoading(group)).toBeFalse();
      expect(component.isSubItemsError(group)).toBeFalse();
    }));

    it('openGroup: should fallback to empty list when subItems response is not an array', fakeAsync(() => {
      const group: PoDropdownAction = {
        label: 'G',
        subItems: () => of(null as unknown as Array<PoDropdownAction>)
      };

      component.openGroup(group);
      tick();

      expect(component.currentItems).toEqual([]);
      expect(component.isSubItemsError(group)).toBeFalse();
    }));

    it('openGroup: should set error state when the observable fails', fakeAsync(() => {
      const group: PoDropdownAction = { label: 'G', subItems: () => throwError(() => new Error('fail')) };

      component.openGroup(group);
      tick();

      expect(component.isSubItemsError(group)).toBeTrue();
      expect(component.isSubItemsLoading(group)).toBeFalse();
      expect((component as any).focusGroupHeader).toHaveBeenCalled();
    }));

    it('openGroup: should set error state when the observable times out', fakeAsync(() => {
      const group: PoDropdownAction = {
        label: 'G',
        subItems: () => of([{ label: 'Z' }]).pipe(delay(2000), timeout(1000))
      };

      component.openGroup(group);
      tick(1000);

      expect(component.isSubItemsError(group)).toBeTrue();
      expect((component as any).focusGroupHeader).toHaveBeenCalled();
    }));

    it('openGroup: should ignore concurrent expansions while loading', fakeAsync(() => {
      const source = new Subject<Array<PoDropdownAction>>();
      const fn = jasmine.createSpy('subItems').and.returnValue(source.asObservable());
      const group: PoDropdownAction = { label: 'G', subItems: fn };

      component.openGroup(group);
      component.openGroup(group);

      expect(fn).toHaveBeenCalledTimes(1);

      source.next([{ label: 'ok' }]);
      source.complete();
      tick();
    }));

    it('openGroup: should reuse cache on reopen and not refetch', fakeAsync(() => {
      const items = [{ label: 'Cached' }];
      const fn = jasmine.createSpy('subItems').and.returnValue(of(items));
      const group: PoDropdownAction = { label: 'G', subItems: fn };

      component.openGroup(group);
      tick();
      component.goBack({ stopPropagation: () => {} } as any);
      component.openGroup(group);
      tick();

      expect(fn).toHaveBeenCalledTimes(1);
      expect(component.currentItems).toEqual(items);
    }));

    it('retrySubItems: should reexecute the fetch after an error', fakeAsync(() => {
      let shouldFail = true;
      const fn = jasmine
        .createSpy('subItems')
        .and.callFake(() => (shouldFail ? throwError(() => new Error('fail')) : of([{ label: 'OK' }])));
      const group: PoDropdownAction = { label: 'G', subItems: fn };

      component.openGroup(group);
      tick();
      expect(component.isSubItemsError(group)).toBeTrue();

      shouldFail = false;
      component.retrySubItems({ stopPropagation: () => {} } as any);
      tick();

      expect(component.isSubItemsError(group)).toBeFalse();
      expect(component.currentItems).toEqual([{ label: 'OK' }]);
    }));

    it('retrySubItems: should do nothing when there is no pending group', () => {
      component['lastLoadedGroup'] = null;
      expect(() => component.retrySubItems()).not.toThrow();
    });

    it('should ignore a late response after navigating away', fakeAsync(() => {
      const source = new Subject<Array<PoDropdownAction>>();
      const group: PoDropdownAction = { label: 'G', subItems: () => source.asObservable() };

      component.openGroup(group);
      component.goBack({ stopPropagation: () => {} } as any);

      source.next([{ label: 'late' }]);
      source.complete();
      tick();

      expect(component.currentItems).not.toEqual([{ label: 'late' }]);
    }));

    it('should ignore a late error after navigating away', fakeAsync(() => {
      const source = new Subject<Array<PoDropdownAction>>();
      const group: PoDropdownAction = { label: 'G', subItems: () => source.asObservable() };

      component.openGroup(group);
      component.goBack({ stopPropagation: () => {} } as any);

      source.error(new Error('late-fail'));
      tick();

      expect(component.isSubItemsError(group)).toBeFalse();
    }));

    it('should ignore next payload when currentGroup changes before response', fakeAsync(() => {
      const source = new Subject<Array<PoDropdownAction>>();
      const group: PoDropdownAction = { label: 'G', subItems: () => source.asObservable() };

      component.openGroup(group);
      component.currentGroup = { label: 'other' };

      source.next([{ label: 'late' }]);
      source.complete();
      tick();

      expect(component.currentItems).toEqual([]);
      expect(component.isSubItemsError(group)).toBeFalse();
    }));

    it('isFunction: should detect functions', () => {
      expect(component.isFunction(() => {})).toBeTrue();
      expect(component.isFunction([])).toBeFalse();
    });

    it('isGroupItem: should detect array and function groups', () => {
      expect(component.isGroupItem({ label: 'a', subItems: [{ label: 'x' }] })).toBeTrue();
      expect(component.isGroupItem({ label: 'a', subItems: () => of([]) })).toBeTrue();
      expect(component.isGroupItem({ label: 'a' })).toBeFalse();
    });

    it('isSubItemsLoading/isSubItemsError: should return false for null group', () => {
      expect(component.isSubItemsLoading(null)).toBeFalse();
      expect(component.isSubItemsError(null)).toBeFalse();
    });

    describe('ngOnInit (lazy root):', () => {
      it('should call loadRootItemsAsync when listboxSubitems and rootLazyLoad set and not loaded', () => {
        component.listboxSubitems = true;
        component.items = [{ label: 'a' }];
        component.rootLazyLoad = () => of([{ label: 'x' }]);
        const spy = spyOn(component, 'loadRootItemsAsync');

        component.ngOnInit();

        expect(component.currentItems).toEqual(component.items);
        expect(spy).toHaveBeenCalled();
      });

      it('should not call loadRootItemsAsync when rootLazyLoad is undefined', () => {
        component.listboxSubitems = true;
        component.rootLazyLoad = undefined;
        const spy = spyOn(component, 'loadRootItemsAsync');

        component.ngOnInit();

        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('ngAfterViewInit (subitems focus):', () => {
      it('should focus first item and dispatch focus event when listboxSubitems', fakeAsync(() => {
        component.listboxSubitems = true;
        const firstEl = document.createElement('div');
        const focusSpy = spyOn(firstEl, 'focus');
        const dispatchSpy = spyOn(firstEl, 'dispatchEvent');
        component.listboxItems = { first: { nativeElement: firstEl } } as any;
        component.listboxItemList = { nativeElement: { focus: () => {} } } as any;
        spyOn(window, 'requestAnimationFrame').and.callFake((cb: any) => {
          cb();
          return 0;
        });

        component.ngAfterViewInit();
        tick(0);

        expect(focusSpy).toHaveBeenCalled();
        expect(dispatchSpy).toHaveBeenCalled();
      }));

      it('should not fail when listboxSubitems and no first item', fakeAsync(() => {
        component.listboxSubitems = true;
        component.listboxItems = { first: undefined } as any;
        component.listboxItemList = { nativeElement: { focus: () => {} } } as any;
        spyOn(window, 'requestAnimationFrame').and.callFake((cb: any) => {
          cb();
          return 0;
        });

        expect(() => {
          component.ngAfterViewInit();
          tick(0);
        }).not.toThrow();
      }));
    });

    describe('loadRootItemsAsync:', () => {
      it('should return early when rootLazyLoad is undefined', () => {
        component.rootLazyLoad = undefined;
        const emitSpy = spyOn(component.rootItemsLoad, 'emit');

        component.loadRootItemsAsync();

        expect(emitSpy).not.toHaveBeenCalled();
      });

      it('should return early when already loading root', () => {
        component.rootLazyLoad = () => of([{ label: 'x' }]);
        component.subItemsLoading.set({ ROOT: true });
        const emitSpy = spyOn(component.rootItemsLoad, 'emit');

        component.loadRootItemsAsync();

        expect(emitSpy).not.toHaveBeenCalled();
      });

      it('should use cached items when rootLoaded and cache present', () => {
        component.rootLazyLoad = () => of([{ label: 'x' }]);
        component['rootLoaded'] = true;
        component['loadedSubItems']['ROOT'] = [{ label: 'cached' }];
        const emitSpy = spyOn(component.rootItemsLoad, 'emit');

        component.loadRootItemsAsync();

        expect(component.currentItems).toEqual([{ label: 'cached' }]);
        expect(emitSpy).not.toHaveBeenCalled();
      });

      it('should load root items, emit event and set rootLoaded on success', () => {
        const items = [{ label: 'a' }, { label: 'b' }];
        component.rootLazyLoad = () => of(items);
        const emitSpy = spyOn(component.rootItemsLoad, 'emit');

        component.loadRootItemsAsync();

        expect(emitSpy).toHaveBeenCalled();
        expect(component.currentItems).toEqual(items);
        expect(component['rootLoaded']).toBeTrue();
        expect(component.subItemsLoading()['ROOT']).toBeFalse();
      });

      it('should set currentItems to empty array when response is not an array', () => {
        component.rootLazyLoad = () => of(null as any);

        component.loadRootItemsAsync();

        expect(component.currentItems).toEqual([]);
        expect(component['rootLoaded']).toBeTrue();
      });

      it('should set error state when root load fails', () => {
        component.rootLazyLoad = () => throwError(() => new Error('fail'));

        component.loadRootItemsAsync();

        expect(component.subItemsError()['ROOT']).toBeTrue();
        expect(component.subItemsLoading()['ROOT']).toBeFalse();
      });
    });

    describe('retryRootItems:', () => {
      it('should reset rootLoaded, clear cache and reload', () => {
        component.rootLazyLoad = () => of([{ label: 'x' }]);
        component['rootLoaded'] = true;
        component['loadedSubItems']['ROOT'] = [{ label: 'old' }];
        const spy = spyOn(component, 'loadRootItemsAsync');

        component.retryRootItems();

        expect(component['rootLoaded']).toBeFalse();
        expect(component['loadedSubItems']['ROOT']).toBeUndefined();
        expect(spy).toHaveBeenCalled();
      });

      it('should stop propagation when event provided', () => {
        component.rootLazyLoad = () => of([{ label: 'x' }]);
        spyOn(component, 'loadRootItemsAsync');
        const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as any;

        component.retryRootItems(event);

        expect(event.stopPropagation).toHaveBeenCalled();
      });

      describe('retrySubItems:', () => {
        it('should return early when currentGroup set but lastLoadedGroup is not a function group', () => {
          component.currentGroup = { label: 'g' };
          component['lastLoadedGroup'] = null;
          const spy = spyOn<any>(component, 'loadSubItemsAsync');

          component.retrySubItems();

          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('onKeyDown:', () => {
        it('should emit closeEvent with escape reason on Escape', () => {
          const spy = spyOn(component.closeEvent, 'emit');
          component.onKeyDown({ label: 'a' }, new KeyboardEvent('keydown', { code: 'Escape' }));

          expect(spy).toHaveBeenCalledWith({ reason: 'escape', origin: 'keyboard' });
        });

        it('should emit closeEvent on Tab', () => {
          const spy = spyOn(component.closeEvent, 'emit');
          component.onKeyDown({ label: 'a' }, new KeyboardEvent('keydown', { code: 'Tab' }));

          expect(spy).toHaveBeenCalledWith();
        });

        it('should call onSelectItem on ArrowRight when item has function subItems', () => {
          const spy = spyOn(component, 'onSelectItem');
          const item = { label: 'a', subItems: () => of([]) };
          component.onKeyDown(item, new KeyboardEvent('keydown', { code: 'ArrowRight' }));

          expect(spy).toHaveBeenCalled();
        });

        it('should call onSelectItem on ArrowRight when item has $subItemTemplate', () => {
          const spy = spyOn(component, 'onSelectItem');
          const item = { label: 'a', $subItemTemplate: {} };
          component.onKeyDown(item, new KeyboardEvent('keydown', { code: 'ArrowRight' }));

          expect(spy).toHaveBeenCalled();
        });

        it('should not call onSelectItem on ArrowRight when item has no subItems', () => {
          const spy = spyOn(component, 'onSelectItem');
          component.onKeyDown({ label: 'a' }, new KeyboardEvent('keydown', { code: 'ArrowRight' }));

          expect(spy).not.toHaveBeenCalled();
        });
      });
    });
  });
});

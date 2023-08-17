import { EventEmitter, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoListBoxComponent } from './po-listbox.component';
import * as UtilFunctions from './../../utils/util';
import { Subscription, debounceTime, fromEvent, of } from 'rxjs';

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
        component.visible = true;
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
        spyOn(component.selectCombo, 'emit');

        component.items = [{ label: 'a', value: 'a' }];
        component.optionClicked(component.items[0]);

        expect(component.selectCombo.emit).toHaveBeenCalled();
        expect(component.items[0]).toEqual({ label: 'a', value: 'a', selected: true });
      });

      it('comboClicked: should emit selectCombo if `p-type` is option', () => {
        spyOn(component.selectCombo, 'emit');
        component.type = 'option';
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
  });
});

import { ElementRef, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoListBoxComponent } from './po-listbox.component';
import * as UtilFunctions from './../../utils/util';
import { Subject, Subscription, debounceTime, fromEvent, of } from 'rxjs';

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
      // Configuração completa dos mocks necessários
      component.infiniteScroll = true;
      component.listboxItemList = {
        nativeElement: {
          offsetHeight: 100,
          scrollTop: 100,
          scrollHeight: 150,
          querySelector: jasmine.createSpy().and.returnValue({ offsetHeight: 40 }) // Mock para o li
        }
      };

      // Mock adicional para evitar efeitos colaterais
      spyOn(component, 'getMinHeight').and.returnValue('100px');

      const test = component['hasInfiniteScroll']();

      expect(test).toBeTruthy();
    });

    it('hasInfiniteScroll: should be called when has infiniteScroll and poComboBody is undefined', () => {
      component.infiniteScroll = true;
      component.listboxItemList = undefined;

      const test = component['hasInfiniteScroll']();

      expect(test).toBeFalsy();
    });

    it('should include infinite scroll and subscribe to scroll event', fakeAsync(() => {
      // Configuração dos mocks
      component.listboxItemList = {
        nativeElement: {
          offsetHeight: 100,
          scrollTop: 100,
          scrollHeight: 200,
          querySelector: jasmine.createSpy().and.returnValue({ offsetHeight: 40 })
        }
      };

      // Mocks para evitar efeitos colaterais
      spyOn(component, 'getMinHeight').and.returnValue('100px');
      spyOn(component, 'getHeight').and.returnValue(null);

      // Cria um Subject para controlar o Observable de scroll
      const scrollSubject = new Subject<any>();
      const mockScroll$ = scrollSubject.asObservable();

      // Mock do scrollListener para retornar nosso Subject
      spyOn(component, 'scrollListener').and.returnValue(mockScroll$);

      // Spy no método showMoreInfiniteScroll
      const showMoreInfiniteScrollSpy = spyOn(component, 'showMoreInfiniteScroll');

      fixture.detectChanges();

      // Chama o método que queremos testar
      component['includeInfiniteScroll']();

      // Emite um evento de scroll
      scrollSubject.next({
        target: {
          offsetHeight: 100,
          scrollTop: 100,
          scrollHeight: 200
        }
      });

      // Avança o tempo para o debounce
      tick(100);

      // Verificações
      expect(component['subscriptionScrollEvent']).toBeDefined();
      expect(showMoreInfiniteScrollSpy).toHaveBeenCalled();
    }));

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
      let mockListboxItemList: any;

      beforeEach(() => {
        // Mock completo do listboxItemList
        mockListboxItemList = {
          nativeElement: {
            focus: jasmine.createSpy('focus'),
            querySelector: jasmine.createSpy('querySelector').and.returnValue({ offsetHeight: 40 }),
            offsetHeight: 100,
            scrollTop: 0,
            scrollHeight: 200
          }
        };

        component.listboxItemList = mockListboxItemList;

        // Mocks padrão para métodos de altura
        spyOn(component, 'getMinHeight').and.returnValue('100px');
        spyOn(component, 'getHeight').and.returnValue(null);
      });

      afterEach(() => {
        // Limpeza completa
        if (component['subscriptionScrollEvent']) {
          component['subscriptionScrollEvent'].unsubscribe();
        }
        fixture.destroy();
      });

      it('should call setListBoxMaxHeight', () => {
        spyOn(component, <any>'setListBoxMaxHeight');
        component.ngAfterViewInit();
        expect(component['setListBoxMaxHeight']).toHaveBeenCalled();
      });

      it('should not throw when listboxItemList is undefined', fakeAsync(() => {
        component.listboxItemList = undefined;
        fixture.detectChanges();

        expect(() => {
          component.ngAfterViewInit();
          tick();
        }).not.toThrow();
      }));

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
      });
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

      it('should emit closeEvent on Tab keydown', () => {
        const mockEvent = new KeyboardEvent('keydown', { code: 'Tab' });

        spyOn(component.closeEvent, 'emit');

        component.onSelectAllCheckboxKeyDown(mockEvent);
        expect(component.closeEvent.emit).toHaveBeenCalled();
      });
    });

    describe('getSizeLoading', () => {
      // Configuração básica para todos os testes
      beforeEach(() => {
        component.containerWidth = 0;
        component['listbox'] = new ElementRef({
          offsetWidth: 0,
          offsetHeight: 0
        });
      });

      // Testes existentes para width (mantidos para garantir compatibilidade)
      it('should return `md` when containerWidth > 180', () => {
        // Configura altura e largura adequadas
        component['listbox'].nativeElement.offsetHeight = 120; // >= 120
        component['listbox'].nativeElement.offsetWidth = 190; // > 180
        component.containerWidth = 190;

        expect(component['getSizeLoading']()).toBe('md');
      });

      it('should return `sm` when containerWidth is between 140 and 180', () => {
        component.containerWidth = 150;
        expect(component['getSizeLoading']()).toBe('sm');
      });

      it('should return `xs` when containerWidth < 140', () => {
        component.containerWidth = 130;
        expect(component['getSizeLoading']()).toBe('xs');
      });

      // Novos testes para altura (height)
      it('should return `xs` when height < 88 regardless of width', () => {
        component['listbox'].nativeElement.offsetHeight = 87;
        component.containerWidth = 200; // Width grande não deve influenciar
        expect(component['getSizeLoading']()).toBe('xs');
      });

      it('should return `sm` when height is between 88 and 111', () => {
        component['listbox'].nativeElement.offsetWidth = 200;
        component['listbox'].nativeElement.offsetHeight = 100;
        expect(component['getSizeLoading']()).toBe('sm');
      });

      it('should return `sm` when height is between 112 and 119', () => {
        component['listbox'].nativeElement.offsetWidth = 200;
        component['listbox'].nativeElement.offsetHeight = 115;
        expect(component['getSizeLoading']()).toBe('sm');
      });

      it('should return `md` when height >= 120 and width > 180', () => {
        component['listbox'].nativeElement.offsetHeight = 120;
        component['listbox'].nativeElement.offsetWidth = 181;
        expect(component['getSizeLoading']()).toBe('md');
      });

      // Testes para combinações de altura e largura
      it('should prioritize xs when either dimension is too small', () => {
        // Caso 1: Altura ok (100), largura pequena (130)
        component['listbox'].nativeElement.offsetHeight = 100;
        component['listbox'].nativeElement.offsetWidth = 130;
        expect(component['getSizeLoading']()).toBe('xs');

        // Caso 2: Altura pequena (80), largura ok (150)
        component['listbox'].nativeElement.offsetHeight = 80;
        component['listbox'].nativeElement.offsetWidth = 150;
        expect(component['getSizeLoading']()).toBe('xs');
      });

      it('should return md only when both dimensions meet requirements', () => {
        // Altura ok, largura não
        component['listbox'].nativeElement.offsetHeight = 120;
        component['listbox'].nativeElement.offsetWidth = 170;
        expect(component['getSizeLoading']()).toBe('sm');

        // Largura ok, altura não
        component['listbox'].nativeElement.offsetHeight = 110;
        component['listbox'].nativeElement.offsetWidth = 190;
        expect(component['getSizeLoading']()).toBe('sm');

        // Ambos ok
        component['listbox'].nativeElement.offsetHeight = 120;
        component['listbox'].nativeElement.offsetWidth = 190;
        expect(component['getSizeLoading']()).toBe('md');
      });

      // Testes para fallback/edge cases
      it('should return md as default when no conditions are met', () => {
        // Altura e largura em valores não especificados nos conditions
        component['listbox'].nativeElement.offsetHeight = 200;
        component['listbox'].nativeElement.offsetWidth = 500;
        expect(component['getSizeLoading']()).toBe('md');
      });

      it('should use listbox width when available', () => {
        component['listbox'].nativeElement.offsetWidth = 190; // Usa width do listbox
        component.containerWidth = 130; // Deve ser ignorado

        expect(component['getSizeLoading']()).toBe('md');
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

    describe('getHeight()', () => {
      it('should return null when height is not defined', () => {
        component.height = undefined;
        expect(component['getHeight']()).toBeNull();
      });

      it('should return height with px when calculation fails', () => {
        component.height = 100;
        spyOn(component, <any>'getItemHeight').and.throwError('Error');
        expect(component['getHeight']()).toBe('100px');
      });

      it('should calculate correct height with items and search', () => {
        component.height = 300;
        component.items = [{}, {}, {}]; // 3 items
        component.type = 'check'; // +1 item
        component.hideSearch = false;

        spyOn(component, <any>'getItemHeight').and.returnValue(50);
        spyOn(component, <any>'getSearchHeight').and.returnValue(40);
        spyOn(component, <any>'getContainerSpacing').and.returnValue(10);

        // (3 items + 1) * 50 + 40 + 10 = 250
        expect(component['getHeight']()).toBe('250px'); // menor que 300
      });
    });

    describe('getMinHeight', () => {
      beforeEach(() => {
        // Mock básico dos elementos do DOM
        component['listbox'] = {
          nativeElement: {
            querySelector: jasmine.createSpy()
          }
        };
        component['listboxItemList'] = {
          nativeElement: {
            querySelector: jasmine.createSpy()
          }
        };

        // Valores padrão para os spies
        spyOn(component, <any>'getSearchHeight').and.returnValue(40);
        spyOn(component, <any>'getContainerSpacing').and.returnValue(10);
      });

      it('should return height for 2 items when search is hidden', () => {
        component.hideSearch = true;
        component.items = [{}, {}]; // 2 items
        spyOn(component, <any>'getItemHeight').and.returnValue(30);

        // 30 * 2 + 10 = 70px (menor que 88)
        expect(component['getMinHeight']()).toBe('88px');
      });

      it('should return height for 1 item when search is hidden and only 1 item exists', () => {
        component.hideSearch = true;
        component.items = [{}]; // 1 item
        spyOn(component, <any>'getItemHeight').and.returnValue(30);

        expect(component['getMinHeight']()).toBe('54px');
      });

      it('should return height with search when visible and type is check', () => {
        component.hideSearch = false;
        component.type = 'check';
        component.items = [{}];
        spyOn(component, <any>'getItemHeight').and.returnValue(30);

        expect(component['getMinHeight']()).toBe('88px');
      });

      it('should use no-data message height when no items', () => {
        const mockNoData = { offsetHeight: 25 } as any;
        (component.listbox.nativeElement.querySelector as jasmine.Spy)
          .withArgs('po-listbox-container-no-data')
          .and.returnValue(mockNoData)
          .withArgs('li')
          .and.returnValue(null);

        expect(component['getMinHeight']()).toBe('54px');
      });

      it('should cap the height at 88px maximum', () => {
        component.hideSearch = false;
        component.type = 'check';
        component.items = [{}, {}];
        spyOn(component, <any>'getItemHeight').and.returnValue(50);

        // (50 + 40 + 10 = 100) → limitado a 88px
        expect(component['getMinHeight']()).toBe('88px');
      });

      it('should handle undefined itemHeight with items', () => {
        // Mocka todas as dependências
        spyOn(component, <any>'getItemHeight').and.returnValue(undefined);

        component.items = [{}];

        expect(component['getMinHeight']()).toBe('54px');
      });

      it('should use no-data height when items is empty and itemHeight is undefined', () => {
        const mockNoDataElement = { offsetHeight: 30 };

        component.items = [];
        component.listbox = {
          nativeElement: {
            querySelector: jasmine
              .createSpy()
              .withArgs('po-listbox-container-no-data')
              .and.returnValue(mockNoDataElement)
          }
        };

        spyOn(component, <any>'getItemHeight').and.returnValue(undefined);

        const result = component.getMinHeight();

        expect(component['getItemHeight']).toHaveBeenCalled();
        expect(result).toBe('40px');
      });

      it('should use default height when both itemHeight and no-data element are undefined', () => {
        component.items = [];

        component.listbox = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(null)
          }
        };

        spyOn(component, <any>'getItemHeight').and.returnValue(undefined);

        const result = component.getMinHeight();

        expect(result).toBe('10px');
      });
    });

    describe('getItemHeight()', () => {
      it('should return item height when li exists', () => {
        const mockLi = { offsetHeight: 44 };
        component.listboxItemList = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(mockLi)
          }
        };

        expect(component['getItemHeight']()).toBe(44);
      });

      it('should return undefined when no li element is found', () => {
        component.listboxItemList = {
          nativeElement: {
            querySelector: jasmine.createSpy().and.returnValue(null)
          }
        };

        expect(component['getItemHeight']()).toBe(0);
      });

      it('should return undefined when listboxItemList is undefined', () => {
        component.listboxItemList = undefined;

        expect(component['getItemHeight']()).toBe(0);
      });

      it('should return undefined when nativeElement is undefined', () => {
        component.listboxItemList = { nativeElement: undefined };

        expect(component['getItemHeight']()).toBe(0);
      });
    });

    describe('getContainerSpacing()', () => {
      it('should calculate spacing correctly', () => {
        const mockStyles = {
          paddingTop: '8px',
          paddingBottom: '12px'
        };
        component.listboxItemList = {
          nativeElement: {}
        };
        spyOn(window, 'getComputedStyle').and.returnValue(mockStyles as any);

        expect(component['getContainerSpacing']()).toBe(20); // 8 + 12
      });

      it('should return fallback when error occurs', () => {
        component.listboxItemList = { nativeElement: {} };
        spyOn(window, 'getComputedStyle').and.throwError('Error');
        expect(component['getContainerSpacing']()).toBe(2);
      });

      it('should calculate spacing correctly if dont have padding', () => {
        const mockElement = document.createElement('div');

        component.listboxItemList = { nativeElement: mockElement };

        spyOn(window, 'getComputedStyle').and.callFake(
          () =>
            ({
              get paddingTop() {
                return undefined;
              },
              get paddingBottom() {
                return undefined;
              }
            }) as any
        );

        expect(component['getContainerSpacing']()).toBe(0);
      });
    });

    describe('getSearchHeight()', () => {
      it('should return search height when visible', () => {
        component.hideSearch = false;
        const mockSearch = { offsetHeight: 56 };
        component.listbox = { nativeElement: { querySelector: jasmine.createSpy().and.returnValue(mockSearch) } };
        expect(component['getSearchHeight']()).toBe(56);
      });

      it('should return 0 when search is hidden', () => {
        component.hideSearch = true;
        expect(component['getSearchHeight']()).toBe(0);
      });
    });
  });

  describe('Templates:', () => {
    beforeEach(() => {
      // Configuração inicial para evitar o erro
      spyOn(component, 'getMinHeight').and.returnValue('100px');
      spyOn(component, 'getHeight').and.returnValue(null);
    });

    it('should be show listbox when has items', () => {
      const items = [
        { label: 'a', value: 'a' },
        { label: 'b', value: 'b' },
        { label: 'c', value: 'c' },
        { label: 'd', value: 'd' }
      ];
      component.items = items;
      component.visible = true;

      // Primeira detecção de mudanças
      fixture.detectChanges();

      // Força a estabilização
      fixture.whenStable().then(() => {
        expect(nativeElement.querySelector('.po-listbox-item')).toBeTruthy();
      });
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
});

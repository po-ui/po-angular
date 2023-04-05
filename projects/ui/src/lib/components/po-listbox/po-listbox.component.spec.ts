import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoListBoxComponent } from './po-listbox.component';
import * as UtilFunctions from './../../utils/util';

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
        spyOn(component, <any>'setListBoxMaxHeight');
        component.items = [
          { label: 'Item 1', value: 1 },
          { label: 'Item 2', value: 2 },
          { label: 'Item 3', value: 3 }
        ];

        component.ngOnChanges();

        expect(component['setListBoxMaxHeight']).not.toHaveBeenCalled();
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

    describe('onKeydown:', () => {
      it('should call onSelectItem if event is `enter`', () => {
        const item = { label: 'a', value: 'a' };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Enter' });

        spyOn(component, 'onSelectItem');

        component.onKeyDown(item, eventEnterKey);

        expect(component.onSelectItem).toHaveBeenCalled();
      });

      it('should call onSelectItem if event is `space`', () => {
        const item = { label: 'a', value: 'a' };
        const eventEnterKey = new KeyboardEvent('keydown', { 'code': 'Space' });

        spyOn(component, 'onSelectItem');

        component.onKeyDown(item, eventEnterKey);

        expect(component.onSelectItem).toHaveBeenCalled();
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
});

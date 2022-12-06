import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PoItemListComponent } from './po-item-list.component';
import * as UtilFunctions from './../../../utils/util';

describe('PoItemListComponent', () => {
  let component: PoItemListComponent;
  let fixture: ComponentFixture<PoItemListComponent>;

  let nativeElement: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoItemListComponent],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component instanceof PoItemListComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    beforeEach(() => {
      component.item = { label: 'a', value: 'a', url: 'http://google.com.br' };
    });
    describe('openUrl:', () => {
      it('should be open a external link', () => {
        const url = 'http://google.com';
        spyOn(UtilFunctions, 'openExternalLink');
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
        const expected = component.returnBooleanValue(item, 'value');
        expect(expected).toBeTruthy();
      });
      it('should be called with function', () => {
        const item = { label: 'a', action: () => {}, value: 'a' };
        const expected = component.returnBooleanValue(item, 'action');
        expect(expected).toBe(item.action());
      });
    });

    describe('onClickItem:', () => {
      it('should be called and disabled is true', () => {
        const item = { label: 'a', action: () => {}, value: 'a', disabled: true };
        spyOn(component, <any>'openUrl');
        spyOn<any>(item, 'action');

        component.onClickItem(item);

        expect(item.action).not.toHaveBeenCalled();
        expect(component['openUrl']).not.toHaveBeenCalled();
      });

      it('should be called with action', () => {
        const item = { label: 'a', action: () => {}, value: 'a' };
        spyOn(component, <any>'openUrl');
        spyOn<any>(item, 'action');

        component.onClickItem(item);

        expect(item.action).toHaveBeenCalled();
        expect(component['openUrl']).not.toHaveBeenCalled();
      });

      it('should be called with url', () => {
        const item = { label: 'a', url: 'http://fakeurl.com', value: 'a' };
        const url = 'http://fakeurl.com';
        spyOn(component, <any>'openUrl');

        component.onClickItem(item);

        expect(component['openUrl']).toHaveBeenCalledWith(url);
      });
    });

    describe('onSelectItem:', () => {
      it('should be called', () => {
        spyOn(component.selectItem, 'emit');
        const item = { label: 'a', value: 'a' };
        component.onSelectItem(item);

        expect(component.selectedView).toBe(item);
        expect(component.selectItem.emit).toHaveBeenCalled();
      });
    });
  });

  describe('Templates:', () => {
    it('should de set type `action`', () => {
      component.type = 'action';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list__action')).toBeTruthy();
    });
    it('should de set type `option`', () => {
      component.type = 'option';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list__option')).toBeTruthy();
    });
    it('should de set type `check`', () => {
      component.type = 'check';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list__check')).toBeTruthy();
    });

    it('should be set label', () => {
      component.label = 'PO UI';

      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-item-list-label').innerHTML).toBe('PO UI');
    });
  });
});

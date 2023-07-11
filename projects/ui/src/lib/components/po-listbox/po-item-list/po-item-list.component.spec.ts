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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoTableColumnIconComponent } from './po-table-column-icon.component';
import { PoTableModule } from '../po-table.module';
import { PoTooltipModule } from '../../../directives/po-tooltip';

describe('PoTableColumnIconComponent:', () => {

  let component: PoTableColumnIconComponent;
  let fixture: ComponentFixture<PoTableColumnIconComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        PoTableModule,
        PoTooltipModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnIconComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoTableColumnIconComponent).toBeTruthy();
  });

  describe('Properties:', () => {

    it('p-icons: should update property value.', () => {
      const icon = [{ value: 'po-icon-star', action: () => alert('PO'), color: 'color-11' }];

      component.icons = icon;

      expect(component.icons).toEqual(icon);
    });

    it('p-icons: should return empty array with `undefined` parameter.', () => {
      const icon = undefined;

      component.icons = icon;

      expect(component.icons).toEqual([]);
    });

  });

  describe('Methods:', () => {

    it('isClickable: should call `isDisabled` function and return value true.', () => {
      const fakeColumn = {
        color: 'color-08',
        value: 'po-icon-copy',
        action: () => true,
        disabled: () => false
      };

      spyOn(component, 'isDisabled').and.returnValue(false);

      const expectedValue = component.isClickable(fakeColumn);

      expect(expectedValue).toBeTruthy();
    });

    it('isClickable: should call `isDisabled` function and return value false.', () => {
      const fakeColumn = {
        color: 'color-08',
        value: 'po-icon-copy',
        action: () => true,
        disabled: () => true
      };

      spyOn(component, 'isDisabled').and.returnValue(true);

      const expectedValue = component.isClickable(fakeColumn);

      expect(expectedValue).toBeFalsy();
    });

    it('isDisabled: should return value true.', () => {
      const fakeColumn = {
        value: 'po-icon-copy',
        disabled: () => true
      };

      const expectedValue = component.isDisabled(fakeColumn);

      expect(expectedValue).toBeTruthy();
    });

    it('isDisabled: should return value false', () => {
      const fakeColumn = {
        value: 'po-icon-copy'
      };

      const expectedValue = component.isDisabled(fakeColumn);

      expect(expectedValue).toBeFalsy();
    });

    it('getColor: should call `color` function and return string color.', () => {
      const fakeRow = component.row = {};
      const fakeColumn = {
        color: () => '',
        value: 'po-icon-copy'
      };
      const expectedColor = 'po-text-color-08';

      spyOn(fakeColumn, 'color').and.returnValue('color-08');

      const expectedValue = component.getColor(fakeColumn);

      expect(fakeColumn.color).toHaveBeenCalledWith(fakeRow, fakeColumn);
      expect(expectedValue).toBe(expectedColor);
    });

    it('getColor: should return string color.', () => {
      const fakeColumn = {
        color: 'color-08',
        value: 'po-icon-copy'
      };
      const expectedColor = 'po-text-color-08';

      const expectedValue = component.getColor(fakeColumn);

      expect(expectedValue).toBe(expectedColor);
    });

    it('getColor: shouldn`t return if `color` isn`t defined', () => {
      const fakeColumn = {
        color: undefined,
        value: 'po-icon-copy'
      };

      const expectedValue = component.getColor(fakeColumn);

      expect(expectedValue).toBeUndefined();
    });

    it('getIcon: should return column.icon', () => {
      const fakeColumn = {
        color: 'color-08',
        icon: 'po-icon-copy',
        value: 'teste'
      };
      const expectedIcon = 'po-icon-copy';

      const expectedValue = component.getIcon(fakeColumn);

      expect(expectedValue).toBe(expectedIcon);
    });

    it('getIcon: should return column.value', () => {
      const fakeColumn = {
        color: 'color-08',
        value: 'teste'
      };
      const expectedIcon = 'teste';

      const expectedValue = component.getIcon(fakeColumn);

      expect(expectedValue).toBe(expectedIcon);
    });

    it('click: should call column.action', () => {
      const fakeRow = component.row = {};
      const fakeColumn = {
        color: 'color-08',
        value: 'po-icon-copy',
        action: () => true,
        disabled: () => true
      };

      spyOn(fakeColumn, 'action');

      component.click(fakeColumn);

      expect(fakeColumn.action).toHaveBeenCalledWith(fakeRow, fakeColumn);
    });

    it('trackByFunction: should return index', () => {
      const fakeIndex = 'teste';
      const trackBy = component.trackByFunction(fakeIndex);

      expect(trackBy).toBe(fakeIndex);
    });

  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../../util-test/util-expect.spec';

import { PoTableColumnIcon } from './po-table-column-icon.interface';
import { PoTableColumnIconComponent } from './po-table-column-icon.component';
import { PoTableModule } from '../po-table.module';
import { PoTooltipModule } from '../../../directives/po-tooltip';

describe('PoTableColumnIconComponent:', () => {
  let component: PoTableColumnIconComponent;
  let fixture: ComponentFixture<PoTableColumnIconComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTableModule, PoTooltipModule]
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
      const fakeRow = (component.row = {});
      const fakeColumn = {
        color: (arg1, arg2) => '',
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

    it('click: shouldn`t call columnIcon.action or column.action neither `stopPropagation` if columnIcon.disabled is true', () => {
      const fakeEvent = {
        stopPropagation: () => {}
      };
      const fakeRow = (component.row = {});
      const fakeColumnIcon = {
        color: 'color-08',
        value: 'po-icon-copy',
        action: (arg1, arg2) => true,
        disabled: () => true
      };
      component.column = { property: 'columnIcon', type: 'icon', action: () => true };

      spyOn(component, 'isDisabled').and.callThrough();
      spyOn(fakeColumnIcon, 'action');
      spyOn(component.column, 'action');
      spyOn(fakeEvent, 'stopPropagation');

      component.click(fakeColumnIcon, fakeEvent);

      expect(component.column.action).not.toHaveBeenCalledWith(fakeColumnIcon);
      expect(fakeColumnIcon.action).not.toHaveBeenCalledWith(fakeRow, fakeColumnIcon);
      expect(component['isDisabled']).toHaveBeenCalledWith(fakeColumnIcon);
      expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
    });

    it('click: should call `columnIcon.action` and `stopPropagation` if isDisabled is false', () => {
      const fakeEvent = {
        stopPropagation: () => {}
      };
      const fakeRow = (component.row = {});
      const fakeColumnIcon = {
        color: 'color-08',
        value: 'po-icon-copy',
        action: (arg1, arg2) => true,
        disabled: () => false
      };
      component.column = { property: 'columnIcon', type: 'icon', action: () => {} };

      spyOn(component, 'isDisabled').and.callThrough();
      spyOn(component.column, 'action');
      spyOn(fakeColumnIcon, 'action');
      spyOn(fakeEvent, 'stopPropagation');

      component.click(fakeColumnIcon, fakeEvent);

      expect(fakeColumnIcon.action).toHaveBeenCalledWith(fakeRow, fakeColumnIcon);
      expect(component.column.action).not.toHaveBeenCalledWith(fakeColumnIcon);
      expect(component['isDisabled']).toHaveBeenCalledWith(fakeColumnIcon);
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    });

    it('click: should call column.action with columnIcon  and `stopPropagation` if isDisabled is falsy and columnIcon.action is undefined', () => {
      const fakeEvent = {
        stopPropagation: () => {}
      };
      const fakeRow = (component.row = {});
      const fakeColumnIcon = {
        color: 'color-08',
        value: 'po-icon-copy',
        disabled: () => false
      };
      component.column = { property: 'columnIcon', type: 'icon', action: () => {} };

      spyOn(component, 'isDisabled').and.callThrough();
      spyOn(component.column, 'action');
      spyOn(fakeEvent, 'stopPropagation');

      component.click(fakeColumnIcon, fakeEvent);

      expect(component.column.action).toHaveBeenCalledWith(fakeRow, fakeColumnIcon);
      expect(component['isDisabled']).toHaveBeenCalledWith(fakeColumnIcon);
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
    });

    it('click: should call only `stopPropagation` if `columnIcon.action` and `column.action` are undefined', () => {
      const fakeEvent = {
        stopPropagation: () => {}
      };
      const fakeColumnIcon = {
        color: 'color-08',
        value: 'po-icon-copy',
        action: undefined,
        disabled: () => false
      };
      component.column = { property: 'columnIcon', type: 'icon' };

      spyOn(component, 'isDisabled').and.callThrough();
      spyOn(fakeEvent, 'stopPropagation');

      component.click(fakeColumnIcon, fakeEvent);

      expect(component['isDisabled']).toHaveBeenCalledWith(fakeColumnIcon);
      expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      expect(component.column.action).toBeUndefined();
      expect(fakeColumnIcon.action).toBeUndefined();
    });

    it('trackByFunction: should return index', () => {
      const fakeIndex = 'teste';
      const trackBy = component.trackByFunction(fakeIndex);

      expect(trackBy).toBe(fakeIndex);
    });

    it('convertToColumnIcon: should convert to columnIcon pattern if pass string', () => {
      const icon = 'po-icon-copy';
      const columnIcons: Array<PoTableColumnIcon> = [{ value: icon }];

      expect(component['convertToColumnIcon'](icon)).toEqual(columnIcons);
    });

    it('convertToColumnIcon: should convert to columnIcon pattern if pass array of string', () => {
      const icons = ['po-icon-copy', 'po-icon-edit'];
      const columnIcons: Array<PoTableColumnIcon> = [{ value: 'po-icon-copy' }, { value: 'po-icon-edit' }];

      expect(component['convertToColumnIcon'](icons)).toEqual(columnIcons);
    });

    it('convertToColumnIcon: should return `icons` if is correct pattern', () => {
      const columnIcons: Array<PoTableColumnIcon> = [{ value: 'po-icon-copy' }, { value: 'po-icon-edit' }];

      expect(component['convertToColumnIcon'](columnIcons)).toEqual(columnIcons);
    });
  });
});

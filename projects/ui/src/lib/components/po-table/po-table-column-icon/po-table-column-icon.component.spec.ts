import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

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
      imports: [
        PoTableModule,
        PoTooltipModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnIconComponent);
    component = fixture.componentInstance;

    component.column = <any> { color: 'color-07' };

    fixture.detectChanges();
    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should be created', () => {
    expect(component instanceof PoTableColumnIconComponent).toBeTruthy();
  });

  describe('Methods:', () => {

    it('checkDisabled: should call `disabled` function.', () => {
      const iconColumn = { color: 'color-08', value: 'po-icon-copy', disabled: () => true };

      spyOn(iconColumn, 'disabled');

      component.checkDisabled(iconColumn);
      expect(iconColumn.disabled).toHaveBeenCalled();
    });

    it('checkDisabled: shouldn´t call `iconColumn.disabled` when `iconColumn.disabled` is falsy.', () => {
      const iconColumn = { color: 'color-08', value: 'po-icon-copy' };

      const result = component.checkDisabled(iconColumn);
      expect(result).toBe(false);
    });

    it('getIconColorClass: should return `po-color-08` when `iconColumn.color` have value and call `getIconColor`.', () => {
      const iconColumn = { color: 'color-08', value: 'po-icon-copy'};

      expect(component.getIconColorClass(iconColumn)).toBe('po-text-color-08');
    });

    it('getIconColorClass: should return `po-text-color-07` when `iconColumn.color` is falsy and `column.color` has value.', () => {
      const iconColumn = { value: 'po-icon-copy'};

      expect(component.getIconColorClass(iconColumn)).toBe('po-text-color-07');
    });

    it('getIconColorClass: should return `` when `column.color` is falsy and `iconColumn.color` is undefined.', () => {
      component.column.color = undefined;
      const iconColumn = { color: undefined, value: 'po-icon-copy'};

      expect(component.getIconColorClass(iconColumn)).toBe('');
    });

    it('getIconColor: should return `columnIcon.color` when it isn`t function', () => {
      const iconColumn = { color: 'color-08', value: 'po-icon-copy'};

      expect(component['getIconColor'](iconColumn)).toBe('color-08');
    });

    it('getIconColor: should call `columnIcon.color` function and return it value', () => {
      const iconColumn = { color: () => 'color-07', value: 'po-icon-copy'};

      expect(component['getIconColor'](iconColumn)).toBe('color-07');
    });

    it('convertToColumnIcon: should convert to columnIcon pattern when pass string', () => {
      const icon = 'po-icon-copy';
      const columnIcons: Array<PoTableColumnIcon> = [{ value: icon }];

      expect(component['convertToColumnIcon'](icon)).toEqual(columnIcons);
    });

    it('convertToColumnIcon: should convert to columnIcon pattern when pass array of string', () => {
      const icons = ['po-icon-copy', 'po-icon-edit'];
      const columnIcons: Array<PoTableColumnIcon> = [{ value: 'po-icon-copy' }, { value: 'po-icon-edit' }];

      expect(component['convertToColumnIcon'](icons)).toEqual(columnIcons);
    });

    it('convertToColumnIcon: should return `icons` when is right pattern', () => {
      const columnIcons: Array<PoTableColumnIcon> = [{ value: 'po-icon-copy' }, { value: 'po-icon-edit' }];

      expect(component['convertToColumnIcon'](columnIcons)).toEqual(columnIcons);
    });

    it('onIconClick: should call `iconColumn.action` with row and iconColumn.', () => {
      const iconColumn = { value: 'po-icon', action: (row, column) => {}, disabled: () => false };

      spyOn(iconColumn, 'action');

      component.onIconClick(iconColumn);
      expect(iconColumn.action).toHaveBeenCalledWith(component.row, iconColumn);
    });

    it('onIconClick: should call `column.action` with row and iconColumn when `iconColumn.action` is falsy.', () => {
      const iconColumn = { value: 'po-icon', disabled: () => false };
      component.column = <any> { action: (row, column) => {} };

      spyOn(component.column, 'action');

      component.onIconClick(iconColumn);
      expect(component.column.action).toHaveBeenCalledWith(component.row, iconColumn);
    });

    it('onIconClick: shouldn`t call `column.action` with row and iconColumn when `iconColumn.disabled` is true.', () => {
      const iconColumn = { value: 'po-icon', disabled: () => true };
      component.column = <any> { action: (row, column) => {} };

      spyOn(component.column, 'action');

      component.onIconClick(iconColumn);
      expect(component.column.action).not.toHaveBeenCalledWith(component.row, iconColumn);
    });

    it('tooltipMouseEnter: should call `tooltipMouseEnter` and to define `tooltipText` with parameter.', () => {
      const iconColumn = { value: 'po-icon', disabled: () => false };
      component.tooltipMouseEnter('PO', iconColumn);
      expect(component.tooltipText).toBe('PO');

      component.tooltipMouseEnter('', iconColumn);
      expect(component.tooltipText).toBe('');

      component.tooltipMouseEnter(undefined, iconColumn);
      expect(component.tooltipText).toBe(undefined);
    });

    it('tooltipMouseEnter: should call `tooltipMouseEnter` and to define `tooltipText` with `undefined`.', () => {
      const iconColumn = { value: 'po-icon', disabled: () => true };
      component.tooltipMouseEnter('PO', iconColumn);
      expect(component.tooltipText).toBe(undefined);

      component.tooltipMouseEnter('', iconColumn);
      expect(component.tooltipText).toBe(undefined);
    });

    it('tooltipMouseLeave: should call `tooltipMouseLeave` and to define `tooltipText` to undefined.', () => {
      component.tooltipMouseLeave();
      expect(component.tooltipText).toBeUndefined();
    });

  });

  describe('Templates:', () => {

    const event = document.createEvent('MouseEvents');

    function getNativeElement(elementClass: string) {
      return fixture.debugElement.nativeElement.querySelector(elementClass);
    }

    it('should find span with class po-icon and po-icon-copy', () => {
      component.icons = ['po-icon-copy'];

      fixture.detectChanges();
      const spanHasIcon = getNativeElement('.po-icon.po-icon-copy');

      expect(spanHasIcon).toBeTruthy();
    });

    it('shouldn´t have class `po-clickable` when not has action.', () => {
      component.icons = [{ value: 'po-icon-ok', color: 'color-11' }];

      fixture.detectChanges();
      const clickableClass = getNativeElement('.po-clickable');

      expect(clickableClass).toBeFalsy();
    });

    it('shouldn´t have class `po-clickable` when the icon is disabled.', () => {
      component.icons = [{ value: 'po-icon-ok', color: 'color-11', action: () => alert('po'), disabled: () => true }];

      fixture.detectChanges();
      const clickableClass = getNativeElement('.po-clickable');

      expect(clickableClass).toBeFalsy();
    });

    it('should have class `po-clickable` when has action and disabled is false.', () => {
      component.icons = [{ value: 'po-icon-ok', color: 'color-11', action: () => alert('po'), disabled: () => false }];

      fixture.detectChanges();
      const clickableClass = getNativeElement('.po-clickable');

      expect(clickableClass).toBeTruthy();
    });

    it('should have class `po-table-icon-disabled` when the icon is disabled.', () => {
      component.icons = [{ value: 'po-icon-ok', color: 'color-11', disabled: () => true }];

      fixture.detectChanges();
      const disabledClass = getNativeElement('.po-table-icon-disabled');

      expect(disabledClass).toBeTruthy();
    });

    it('should overlap icon color generic.', () => {
      component.icons = [{ value: 'po-icon-close', color: 'color-07' }];
      component.column.color = 'color-08';

      fixture.detectChanges();

      const specificIconColor = getNativeElement('.po-text-color-07');
      const genericIconColor = getNativeElement('.po-text-color-08');

      expect(specificIconColor).toBeTruthy();
      expect(genericIconColor).toBeFalsy();
    });

    it('shouldn´t display a tooltip if `icons.tooltip` is undefined.', fakeAsync (() => {
      event.initEvent('mouseenter', false, true);
      component.icons = [{ value: 'po-icon-close', color: 'danger' }];
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.po-icon');
      icon.dispatchEvent(event);
      fixture.detectChanges();

      tick(100);

      expect(nativeElement.querySelector('.po-tooltip')).toBeNull();
    }));

    it('shouldn´t display a tooltip when the icon is disabled.', fakeAsync (() => {
      event.initEvent('mouseenter', false, true);
      component.icons = [{ value: 'po-icon-close', color: 'color-07', tooltip: 'Tooltip text', disabled: () => true }];
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.po-icon');
      icon.dispatchEvent(event);
      fixture.detectChanges();

      tick(100);

      expect(nativeElement.querySelector('.po-tooltip')).toBeNull();
    }));

    it('should display a icon color when the icon isn`t disabled.', () => {
      component.icons = [{ value: 'po-icon-close', color: 'color-07', tooltip: 'Tooltip text', disabled: () => false }];
      fixture.detectChanges();

      expect(nativeElement.querySelector('.po-text-color-07')).toBeTruthy();
    });

    it('should display a tooltip if `icons.tooltip` is defined and mouse is entered in icon.', fakeAsync (() => {
      event.initEvent('mouseenter', false, true);
      component.icons = [{ value: 'po-icon-close', color: 'color-07', tooltip: 'Tooltip text' }];
      fixture.detectChanges();

      const icon = nativeElement.querySelector('.po-icon');
      icon.dispatchEvent(event);
      fixture.detectChanges();
      tick(100);

      expect(nativeElement.querySelector('.po-tooltip')).toBeTruthy();
      expect(nativeElement.querySelector('.po-tooltip.po-invisible')).toBeNull();

      event.initEvent('mouseleave', false, true);
      icon.dispatchEvent(event);
      fixture.detectChanges();
      tick(100);

      expect(nativeElement.querySelector('.po-tooltip.po-invisible')).toBeTruthy();
    }));

  });

  describe('Properties:', () => {

    it('p-icons: should update value to array of objects.', () => {
      const icons = ['po-icon-copy', 'po-icon-ok'];

      component.icons = icons;

      expect(component.icons.length).toBe(2);
      expect(component.icons).toEqual([ Object({ value: 'po-icon-copy' }), Object({ value: 'po-icon-ok' }) ]);
    });

    it('p-icons: should convert string to array and update.', () => {
      const icon = 'po-icon-copy';

      component.icons = icon;

      expect(component.icons).toEqual([ Object({ value: 'po-icon-copy' }) ]);
    });

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

    it('p-icons: should return empty array with `number` parameter.', () => {
      const icon: any = 1001;

      component.icons = icon;

      expect(component.icons).toEqual([]);
    });

  });

});

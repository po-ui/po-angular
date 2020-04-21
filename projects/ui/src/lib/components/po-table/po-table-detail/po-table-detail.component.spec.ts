import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectPropertiesValues, configureTestSuite } from '../../../util-test/util-expect.spec';

import * as utilsFunctions from '../../../utils/util';

import { PoTableDetailColumn } from './po-table-detail-column.interface';
import { PoTableDetailComponent } from './po-table-detail.component';
import { PoTableModule } from '../po-table.module';

describe('PoTableDetailComponent', () => {
  let component: PoTableDetailComponent;
  let detailElement;
  let fixture: ComponentFixture<PoTableDetailComponent>;
  let nativeElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [PoTableModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableDetailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
    detailElement = nativeElement.querySelector('.po-table-master-detail');
  });

  it('should be created', () => {
    expect(component instanceof PoTableDetailComponent).toBeTruthy();
  });

  describe('Properties: ', () => {
    it('should set property `detail` with valid values', () => {
      const detail = { columns: [{ property: 'tour', label: 'Tour' }] };
      const validValues = [[{ property: 'tour', label: 'Tour' }], detail];

      expectPropertiesValues(component, 'detail', validValues, detail);
    });

    it('should set property `detail` with invalid values', () => {
      const invalidValues = [1, null, undefined, NaN, 'teste', false, true, {}];

      expectPropertiesValues(component, 'detail', invalidValues, undefined);
    });

    it('should return `true` in `typeHeaderTop` when typeHeader is top', () => {
      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'top' };

      expect(component.typeHeaderTop).toBeTruthy();
    });

    it('should return `false` in `typeHeaderTop` when typeHeader is `inline`, `none` or when not exist typeHeader', () => {
      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'inline' };
      expect(component.typeHeaderTop).toBeFalsy();

      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'none' };
      expect(component.typeHeaderTop).toBeFalsy();

      component.detail = { columns: [{ property: 'tour', label: 'Tour' }] };
      expect(component.typeHeaderTop).toBeFalsy();
    });

    it('should return `true` in `typeHeaderInline` when typeHeader is inline or when not exist typeHeader', () => {
      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'inline' };
      expect(component.typeHeaderInline).toBeTruthy();

      component.detail = { columns: [{ property: 'tour', label: 'Tour' }] };
      expect(component.typeHeaderInline).toBeTruthy();
    });

    it('should return `false` in `typeHeaderInline` when typeHeader is `top` or `none`', () => {
      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'top' };
      expect(component.typeHeaderInline).toBeFalsy();

      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'none' };
      expect(component.typeHeaderInline).toBeFalsy();
    });

    it('should return `true` in `detailColumns` when detail has columns', () => {
      component.detail = { columns: [{ property: 'tour', label: 'Tour' }], typeHeader: 'inline' };
      expect(component.detailColumns).toEqual([{ property: 'tour', label: 'Tour' }]);
    });

    it('should return `false` in `detailColumns` when detail has no columns', () => {
      component.detail = undefined;
      expect(component.detailColumns).toEqual([]);

      component.detail = <any>{ typeHeader: 'none' };
      expect(component.detailColumns).toEqual([]);
    });
  });

  describe('Methods: ', () => {
    it('getColumnTitleLabel: should return `column.label` value if `column.label` is valid', () => {
      const label = 'Label';
      const column: PoTableDetailColumn = { label: label };

      expect(component.getColumnTitleLabel(column)).toBe(label);
    });

    it(`getColumnTitleLabel: should return 'column.property' value with first letter uppercased if doesn't have 'column.label' and call
    'capitalizeFirstLetter' with property value`, () => {
      const label = 'Label';
      const propertyValue = 'label';
      const column: PoTableDetailColumn = { property: propertyValue };

      spyOn(utilsFunctions, 'capitalizeFirstLetter').and.returnValue(label);

      expect(component.getColumnTitleLabel(column)).toBe(label);
      expect(utilsFunctions.capitalizeFirstLetter).toHaveBeenCalledWith(propertyValue);
    });

    it('onSelectRow: should set `$selected` property of row item to `true` and call `selectRow.emit`', () => {
      const row = { title: 'teste', $selected: false };
      spyOn(component.selectRow, 'emit');

      component.onSelectRow(row);

      expect(row.$selected).toBeTruthy();
      expect(component.selectRow.emit).toHaveBeenCalledWith(row);
    });

    describe('returnPoTableDetailObject: ', () => {
      it('should return `poTableDetail` columns as an instance of array', () => {
        const columns = [{ property: 'tour', label: 'Tour' }];
        const poTableDetail = component['returnPoTableDetailObject'](<any>columns);
        expect(poTableDetail).toEqual({ columns: [{ property: 'tour', label: 'Tour' }] });
      });

      it('should return `poTableDetail` nested columns', () => {
        const columns = [{ columns: [{ property: 'tour', label: 'Tour' }] }, { property: 'Plain', label: 'Plain' }];
        const poTableDetail = component['returnPoTableDetailObject']({ columns });
        expect(poTableDetail).toEqual({
          columns: [
            { columns: [{ property: 'tour', label: 'Tour' }], property: undefined },
            { property: 'Plain', label: 'Plain' }
          ]
        });
      });

      it('should return `undefined` if parameter is an empty object', () => {
        const poTableDetail = component['returnPoTableDetailObject']({});

        expect(typeof poTableDetail === 'object').toBeFalsy();
        expect(poTableDetail).toBeUndefined();
      });

      it('should return `poTableDetail` object if parameter is of type `PoTableDetail`', () => {
        const detailObject = { columns: [], typeHeader: 'inline' };
        const poTableDetail = component['returnPoTableDetailObject'](detailObject);

        expect(typeof poTableDetail === 'object').toBeTruthy();
        expect(poTableDetail).toEqual(detailObject);
      });
    });

    describe('formatNumberDetail:', () => {
      it('should return formatted value.', () => {
        const format = '1.2-5';
        const expectedReturn = '10.00';
        const value = '10';

        const returnValue = component.formatNumberDetail(value, format);

        expect(returnValue).toEqual(expectedReturn);
      });

      it('should return the original value.', () => {
        const format = undefined;
        const expectedReturn = '10';
        const value = '10';

        const returnValue = component.formatNumberDetail(value, format);

        expect(returnValue).toEqual(expectedReturn);
      });
    });
  });

  describe('Templates:', () => {
    const elementDetail = 'td.po-table-column-master-detail.po-table-master-detail-label > span';

    it('should display the time', () => {
      const expectedReturn = '10:10:10';
      const valueTime = '10:10:10';

      component.detail = { columns: [{ property: 'time', label: 'Time', type: 'time' }] };
      component.items = [{ time: valueTime }];

      fixture.detectChanges();

      const time = detailElement.querySelector(elementDetail).innerText;
      expect(time).toEqual(expectedReturn);
    });

    it('should display the time as `HH:mm` of detail formatted', () => {
      const expectedReturn = '10:10';
      const valueTime = '10:10:10';

      component.detail = { columns: [{ property: 'time', label: 'Time', type: 'time', format: 'HH:mm' }] };
      component.items = [{ time: valueTime }];

      fixture.detectChanges();

      const time = detailElement.querySelector(elementDetail).innerText;
      expect(time).toEqual(expectedReturn);
    });

    it('should display the time as `mm` of detail formatted', () => {
      const expectedReturn = '22';
      const valueTime = '10:22:10';

      component.detail = { columns: [{ property: 'time', label: 'Time', type: 'time', format: 'mm' }] };
      component.items = [{ time: valueTime }];

      fixture.detectChanges();

      const time = detailElement.querySelector(elementDetail).innerText;
      expect(time).toEqual(expectedReturn);
    });

    it('should display the date in the format of date `dd/mm/yyyy`', () => {
      const expectedReturn = '05/10/2018';
      const valueDate = new Date(2018, 9, 5);

      component.detail = { columns: [{ property: 'date', label: 'Date', type: 'date' }] };
      component.items = [{ date: valueDate }];

      fixture.detectChanges();

      const date = detailElement.querySelector(elementDetail).innerText;
      expect(date).toEqual(expectedReturn);
    });

    it('should display the date in the format of date `dd-MM-yy`', () => {
      const expectedReturn = '05-10-18';
      const valueDate = new Date(2018, 9, 5);

      component.detail = { columns: [{ property: 'date', label: 'Date', type: 'date', format: 'dd-MM-yy' }] };
      component.items = [{ date: valueDate }];

      fixture.detectChanges();

      const dateTime = detailElement.querySelector(elementDetail).innerText;
      expect(dateTime).toEqual(expectedReturn);
    });

    it('should display the date in the format of dateTime `dd/mm/aaaa hh:mm:ss`', () => {
      const expectedReturn = '23/11/2018 11:13:10';
      const valueDateTime = new Date(2018, 10, 23, 11, 13, 10, 1);

      component.detail = { columns: [{ property: 'dateTime', label: 'DateTime', type: 'dateTime' }] };
      component.items = [{ dateTime: valueDateTime }];

      fixture.detectChanges();

      const dateTime = detailElement.querySelector(elementDetail).innerText;
      expect(dateTime).toEqual(expectedReturn);
    });

    it('should display the Time in the format of time `hh:mm:ss', () => {
      const expectedReturn = '12:11:55';
      const valueTime = '12:11:55';

      component.detail = { columns: [{ property: 'time', label: 'Time', type: 'time' }] };
      component.items = [{ time: valueTime }];

      fixture.detectChanges();

      const time = detailElement.querySelector(elementDetail).innerText;
      expect(time).toEqual(expectedReturn);
    });

    it('should display a common text when not passed type', () => {
      const expectedReturn = 'Hello World';
      const valueText = 'Hello World';

      component.detail = { columns: [{ property: 'helloWorld', label: 'Hello World' }] };
      component.items = [{ helloWorld: valueText }];

      fixture.detectChanges();

      const text = detailElement.querySelector(elementDetail).innerText;
      expect(text).toEqual(expectedReturn);
    });

    it('should display text with the standard USD currency type', () => {
      const expectedReturn = '$6,511.00';
      const valueCurrency = '6511';

      component.detail = { columns: [{ property: 'currency', label: 'Currency', type: 'currency', format: 'USD' }] };
      component.items = [{ currency: valueCurrency }];

      fixture.detectChanges();
      const currency = detailElement.querySelector(elementDetail).innerText;
      expect(currency).toEqual(expectedReturn);
    });

    it('should display the formatted number', () => {
      const expectedReturn = '1,000.00';
      const valueNumber = '1000';

      component.detail = { columns: [{ property: 'number', label: 'Number', type: 'number', format: '1.2-5' }] };
      component.items = [{ number: valueNumber }];

      fixture.detectChanges();
      const number = detailElement.querySelector(elementDetail).innerText;
      expect(number).toEqual(expectedReturn);
    });
  });
});

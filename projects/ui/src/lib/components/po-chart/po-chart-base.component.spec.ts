import { EventEmitter } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartType } from './enums/po-chart-type.enum';

class PoCharComponent extends PoChartBaseComponent {
  rebuildComponent() {}
}

describe('PoChartBaseComponent:', () => {
  let component: PoCharComponent;

  beforeEach(() => {
    component = new PoCharComponent();
  });

  it('should be create', () => {
    expect(component instanceof PoChartBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-height: should update property with 200 if values is lower than 200', () => {
      const validValues = [105, 1, 7, 0, -5];

      spyOn(component, 'rebuildComponent');

      expectPropertiesValues(component, 'height', validValues, 200);

      expect(component.rebuildComponent).toHaveBeenCalled();
    });

    it('p-height: should update property with valid values', () => {
      const validValues = [250, 300, 500];

      spyOn(component, 'rebuildComponent');

      expectPropertiesValues(component, 'height', validValues, validValues);

      expect(component.rebuildComponent).toHaveBeenCalled();
    });

    it('p-height: should call `setDefaultHeight` if height isn`t defined`', () => {
      spyOn(component, <any>'setDefaultHeight').and.callThrough();

      const expectedHeight = component.height;

      expect(component.height).toBe(expectedHeight);
      expect(component['setDefaultHeight']).toHaveBeenCalled();
    });

    it('p-height: should update property with 400 if invalid values.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];

      spyOn(component, 'rebuildComponent');

      expectPropertiesValues(component, 'height', invalidValues, 400);

      expect(component.rebuildComponent).toHaveBeenCalled();
    });

    it('p-type: should update property with valid values.', () => {
      const validValues = (<any>Object).values(PoChartType);

      expectPropertiesValues(component, 'type', validValues, validValues);
    });

    it('p-type: should update property with `PoChartType.Pie` if contains invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

      expectPropertiesValues(component, 'type', invalidValues, PoChartType.Pie);
    });

    it('p-series: should update property with valid values', () => {
      const validValues = [[{ value: 1, category: 'value' }], [], { value: 1, description: 'value' }];

      expectPropertiesValues(component, 'series', validValues, validValues);
    });

    it('p-series: should update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0];

      expectPropertiesValues(component, 'series', invalidValues, []);
    });

    it('p-series: should call `transformObjectToArrayObject` if series is an object', () => {
      spyOn(component, <any>'transformObjectToArrayObject');

      component.series = { value: 1, description: 'value' };

      expect(component['transformObjectToArrayObject']).toHaveBeenCalledWith(component.series);
    });
  });

  describe('Methods:', () => {
    it('onSeriesClick: should call `seriesClick.emit` with `event`', () => {
      const eventMock = { target: '', name: 'value' };
      component.seriesClick = new EventEmitter();

      spyOn(component.seriesClick, 'emit');

      component.onSeriesClick(eventMock);

      expect(component.seriesClick.emit).toHaveBeenCalledWith(eventMock);
    });

    it('onSeriesHover: should call `seriesClick.emit` with `event`', () => {
      const eventMock = { target: '', name: 'value' };
      component.seriesHover = new EventEmitter();

      spyOn(component.seriesHover, 'emit');

      component.onSeriesHover(eventMock);

      expect(component.seriesHover.emit).toHaveBeenCalledWith(eventMock);
    });

    it('setDefaultHeight: should return `200` if type is `Gauge`', () => {
      component.type = PoChartType.Gauge;

      const expectedResult = component['setDefaultHeight']();

      expect(expectedResult).toBe(200);
    });

    it('setDefaultHeight: should return `400` if type is different from `Gauge`', () => {
      component.type = PoChartType.Pie;

      const expectedResult = component['setDefaultHeight']();

      expect(expectedResult).toBe(400);
    });

    it('transformObjectToArrayObject: should return an array containing the serie`s object', () => {
      const serie = { value: 1, description: 'description' };
      const expectedResult = component['transformObjectToArrayObject'](serie);

      expect(expectedResult).toEqual([serie]);
    });

    it('transformObjectToArrayObject: should return an empty array if the serie is an object without length', () => {
      const serie = <any>{};
      const expectedResult = component['transformObjectToArrayObject'](serie);

      expect(expectedResult).toEqual([]);
    });
  });
});

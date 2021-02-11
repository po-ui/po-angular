import { Directive, EventEmitter, SimpleChange } from '@angular/core';

import { expectPropertiesValues } from './../../util-test/util-expect.spec';

import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartType } from './enums/po-chart-type.enum';
import { PoColorService } from '../../services/po-color/po-color.service';

@Directive()
class PoCharComponent extends PoChartBaseComponent {
  rebuildComponentRef() {}
  calculateAxisXLabelArea() {
    return 0;
  }
  getSvgContainerSize() {}
}

describe('PoChartBaseComponent:', () => {
  let component: PoCharComponent;

  const colorService: PoColorService = new PoColorService();

  beforeEach(() => {
    component = new PoCharComponent(colorService);
  });

  it('should be create', () => {
    expect(component instanceof PoChartBaseComponent).toBeTruthy();
  });

  describe('Properties:', () => {
    it('p-height: should update property with 200 if values is lower than 200 and call `rebuildComponentRef` plus `getSvgContainerSize`', () => {
      const validValues = [105, 1, 7, 0, -5];

      spyOn(component, 'rebuildComponentRef');
      spyOn(component, 'getSvgContainerSize');

      expectPropertiesValues(component, 'height', validValues, 200);

      expect(component.rebuildComponentRef).toHaveBeenCalled();
      expect(component.getSvgContainerSize).toHaveBeenCalled();
    });

    it('p-height: should update property with valid values', () => {
      const validValues = [250, 300, 500];

      spyOn(component, 'rebuildComponentRef');

      expectPropertiesValues(component, 'height', validValues, validValues);

      expect(component.rebuildComponentRef).toHaveBeenCalled();
    });

    it('p-height: should call `setDefaultHeight` and if height isn`t defined`', () => {
      spyOn(component, <any>'setDefaultHeight').and.callThrough();

      const expectedHeight = component.height;

      expect(component.height).toBe(expectedHeight);
      expect(component['setDefaultHeight']).toHaveBeenCalled();
    });

    it('p-height: should update property with 400 if invalid values.', () => {
      const invalidValues = [null, undefined, '', 'string', {}, [], false, true];

      spyOn(component, 'rebuildComponentRef');

      expectPropertiesValues(component, 'height', invalidValues, 400);

      expect(component.rebuildComponentRef).toHaveBeenCalled();
    });

    it('p-type: should update property with valid values.', () => {
      const validValues = (<any>Object).values(PoChartType);
      spyOn(component, 'rebuildComponentRef');

      expectPropertiesValues(component, 'type', validValues, validValues);

      expect(component.rebuildComponentRef).toHaveBeenCalled();
    });

    it('p-type: should update property with undefined if contains invalid values', () => {
      const invalidValues = [undefined, null, '', true, false, 0, 1, 'aa', [], {}];

      expectPropertiesValues(component, 'type', invalidValues, undefined);
    });

    it('p-series: should update property with valid values', () => {
      const validValues = [[{ value: 1, category: 'value' }], [], { value: 1, description: 'value' }];

      expectPropertiesValues(component, 'series', validValues, validValues);
    });

    it('p-series: should update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0];

      expectPropertiesValues(component, 'series', invalidValues, []);
    });

    it('p-series: should call `setTypeDefault` if series is an array', () => {
      const spySetTypeDefault = spyOn(component, <any>'setTypeDefault');

      component.series = [{ data: 1, label: 'value' }];

      expect(spySetTypeDefault).toHaveBeenCalledWith(component.series[0]);
    });

    it('p-series: shouldn`t call `setTypeDefault` if series is an empty array', () => {
      const spySetTypeDefault = spyOn(component, <any>'setTypeDefault');

      component.series = [];

      expect(spySetTypeDefault).not.toHaveBeenCalled();
    });

    it('p-series: should call `transformObjectToArrayObject` and `rebuildComponentRef` if series is an object', () => {
      const spyTransformObjectToArrayObject = spyOn(component, <any>'transformObjectToArrayObject');
      const spyRebuildComponentRef = spyOn(component, <any>'rebuildComponentRef');

      component.series = { value: 1, description: 'value' };

      expect(spyTransformObjectToArrayObject).toHaveBeenCalled();
      expect(spyRebuildComponentRef).toHaveBeenCalled();
    });

    it('p-series: shouldn`t call `transformObjectToArrayObject` neither `rebuildComponentRef` if series is an array', () => {
      const spyTransformObjectToArrayObject = spyOn(component, <any>'transformObjectToArrayObject');
      const spyRebuildComponentRef = spyOn(component, <any>'rebuildComponentRef');

      component.series = [{ data: 1, label: 'value' }];

      expect(spyTransformObjectToArrayObject).not.toHaveBeenCalled();
      expect(spyRebuildComponentRef).not.toHaveBeenCalled();
    });

    it('p-options: should update property with valid values', () => {
      const validValue = [{}, { axis: { minRange: 0 } }];

      expectPropertiesValues(component, 'options', validValue, validValue);
    });

    it('p-options: shouldn`t update property if receives invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, ['1'], [{ key: 'value' }]];

      expectPropertiesValues(component, 'options', invalidValues, undefined);
    });

    it('p-categories: should update property with valid values', () => {
      const validValue = [[], [1, 2, 3]];

      expectPropertiesValues(component, 'categories', validValue, validValue);
    });

    it('p-categories: shouldn`t update property if receives invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, {}, { key: 'value' }];

      expectPropertiesValues(component, 'categories', invalidValues, undefined);
    });
  });

  describe('Methods:', () => {
    describe('ngOnChanges:', () => {
      it('should call `validateSerieAndAddType` and `calculateAxisXLabelArea` if type changes', () => {
        const changes = { type: new SimpleChange(null, component.type, true) };

        const spyValidateSerieAndAddType = spyOn(component, <any>'validateSerieAndAddType');
        const spycClculateAxisXLabelArea = spyOn(component, <any>'calculateAxisXLabelArea');

        component.type = PoChartType.Bar;
        component.series = [{ data: [1, 2, 3], label: 'value', type: PoChartType.Bar }];

        component.ngOnChanges(changes);

        expect(spyValidateSerieAndAddType).toHaveBeenCalledWith(component.series);
        expect(spycClculateAxisXLabelArea).toHaveBeenCalled();
      });

      it('should call `validateSerieAndAddType` and `calculateAxisXLabelArea` if `categories` changes', () => {
        const changes = { categories: new SimpleChange(null, component.categories, true) };

        const spyValidateSerieAndAddType = spyOn(component, <any>'validateSerieAndAddType');
        const spycClculateAxisXLabelArea = spyOn(component, <any>'calculateAxisXLabelArea');

        component.categories = ['cat1', 'cat2'];
        component.series = [{ data: [1, 2, 3], label: 'value' }];
        component.type = PoChartType.Column;

        component.ngOnChanges(changes);

        expect(spyValidateSerieAndAddType).toHaveBeenCalledWith(component.series);
        expect(spycClculateAxisXLabelArea).toHaveBeenCalled();
      });

      it('shouldn`t call `calculateAxisXLabelArea` if `categories` changes but `type` is a circular type', () => {
        const changes = { categories: new SimpleChange(null, component.categories, true) };

        const spycClculateAxisXLabelArea = spyOn(component, <any>'calculateAxisXLabelArea');

        component.categories = ['cat1', 'cat2'];
        component.series = [{ data: 1, label: 'value' }];
        component.type = PoChartType.Donut;

        component.ngOnChanges(changes);

        expect(spycClculateAxisXLabelArea).not.toHaveBeenCalled();
      });

      it('should call `validateSerieAndAddType` if series is an array', () => {
        const changes = { series: new SimpleChange(null, component.series, true) };

        const spyValidateSerieAndAddType = spyOn(component, <any>'validateSerieAndAddType');

        component.series = [{ data: 1, label: 'value' }];

        component.ngOnChanges(changes);

        expect(spyValidateSerieAndAddType).toHaveBeenCalledWith(component.series);
      });

      it('shouldn`t call `validateSerieAndAddType` if series is an empty array', () => {
        const changes = { series: new SimpleChange(null, component.series, true) };

        const spyValidateSerieAndAddType = spyOn(component, <any>'validateSerieAndAddType');

        component.series = [];

        component.ngOnChanges(changes);

        expect(spyValidateSerieAndAddType).not.toHaveBeenCalled();
      });

      it('shouldn`t call `validateSerieAndAddType` if series doesn`t change', () => {
        const changes = { height: new SimpleChange(null, component.height, true) };

        const spyValidateSerieAndAddType = spyOn(component, <any>'validateSerieAndAddType');

        component.ngOnChanges(changes);

        expect(spyValidateSerieAndAddType).not.toHaveBeenCalled();
      });
    });

    it('onSeriesClick: should call `seriesClick.emit` with `event`', () => {
      const eventMock = { target: '', name: 'value', value: 1, category: 'value' };
      component.seriesClick = new EventEmitter();

      spyOn(component.seriesClick, 'emit');

      component.onSeriesClick(eventMock);

      expect(component.seriesClick.emit).toHaveBeenCalledWith(eventMock);
    });

    it('onSeriesHover: should call `seriesClick.emit` with `event`', () => {
      const eventMock = { target: '', name: 'value', value: 1, category: 'value' };
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

    it('transformObjectToArrayObject: should set an array containing the serie`s object to `chartSeries`', () => {
      const serie = { value: 1, description: 'description' };

      component['transformObjectToArrayObject'](serie);

      expect(component.chartSeries).toEqual([serie]);
    });

    it('transformObjectToArrayObject: should set empty array to `chartSeries` if the serie is an object without length', () => {
      const serie = <any>{};

      component['transformObjectToArrayObject'](serie);

      expect(component.chartSeries).toEqual([]);
    });

    it('setTypeDefault: should apply `PoChartType.Pie` to `chartType` if serie.data is a number', () => {
      const serie = { label: 'serie', data: 1 };

      component['setTypeDefault'](serie);

      expect(component['defaultType']).toBe(PoChartType.Pie);
    });

    it('setTypeDefault: should apply `PoChartType.Pie` to `chartType` if serie.value is a number', () => {
      const serie = { label: 'serie', value: 1 };

      component['setTypeDefault'](serie);

      expect(component['defaultType']).toBe(PoChartType.Pie);
    });

    it('setTypeDefault: should apply `PoChartType.Column` to `chartType` if serie.data is an array', () => {
      const serie = { label: 'serie', data: [1, 2] };

      component['setTypeDefault'](serie);

      expect(component['defaultType']).toBe(PoChartType.Column);
    });

    it('setTypeDefault: should apply `PoChartType.Bar` to `chartType` if serie.type is defined', () => {
      const serie = { label: 'serie', data: [1, 2], type: PoChartType.Bar };

      component['setTypeDefault'](serie);

      expect(component['defaultType']).toBe(PoChartType.Bar);
    });

    describe('validateSerieAndAddType:', () => {
      it('should apply to `chartSeries` a list with two objects with `data` and `pie` as default type', () => {
        component.series = [
          { label: 'serie 1', data: 1 },
          { label: 'serie 2', data: 2 }
        ];

        const expectedResult = [
          { label: 'serie 1', data: 1, type: PoChartType.Pie, color: '#0C6C94' },
          { label: 'serie 2', data: 2, type: PoChartType.Pie, color: '#29B6C5' }
        ];

        component['validateSerieAndAddType'](component.series);

        expect(component.chartSeries).toEqual(expectedResult);
      });

      it('should apply to `chartSeries` a list with two objects with `value` and `pie` as default type', () => {
        component.series = [
          { label: 'serie 1', value: 1 },
          { label: 'serie 2', value: 2 }
        ];

        const expectedResult = [
          { label: 'serie 1', value: 1, type: PoChartType.Pie, color: '#0C6C94' },
          { label: 'serie 2', value: 2, type: PoChartType.Pie, color: '#29B6C5' }
        ];

        component['validateSerieAndAddType'](component.series);

        expect(component.chartSeries).toEqual(expectedResult);
      });

      it('should apply to `chartSeries` a list with two objects with `data` and `column` as default type', () => {
        component.series = [
          { label: 'serie 1', data: [1, 2] },
          { label: 'serie 2', data: [3, 4] }
        ];

        const expectedResult = [
          { label: 'serie 1', data: [1, 2], type: PoChartType.Column, color: '#0C6C94' },
          { label: 'serie 2', data: [3, 4], type: PoChartType.Column, color: '#29B6C5' }
        ];

        component['validateSerieAndAddType'](component.series);

        expect(component.chartSeries).toEqual(expectedResult);
      });

      it('should apply to `chartSeries` a filtered list excluding not array items', () => {
        component.series = [
          { label: 'serie 1', data: [1, 2] },
          { label: 'serie 2', data: 3 }
        ];

        const expectedResult = [{ label: 'serie 1', data: [1, 2], type: PoChartType.Column, color: '#29B6C5' }];

        component['validateSerieAndAddType'](component.series);

        expect(component.chartSeries).toEqual(expectedResult);
      });

      it('should apply to `chartSeries` a filtered list excluding array items', () => {
        component.series = [
          { label: 'serie 1', data: [1, 2], type: PoChartType.Donut },
          { label: 'serie 2', data: 3 },
          { label: 'serie 3', data: 4 }
        ];

        const expectedResult = [
          { label: 'serie 2', data: 3, type: PoChartType.Donut, color: '#0C6C94' },
          { label: 'serie 3', data: 4, type: PoChartType.Donut, color: '#29B6C5' }
        ];

        component['validateSerieAndAddType'](component.series);

        expect(component.chartSeries).toEqual(expectedResult);
      });

      it('should apply the first serie type the others if they do not have declared it', () => {
        component.series = [
          { label: 'serie 1', data: [1, 2], type: PoChartType.Line },
          { label: 'serie 2', data: [3, 4] }
        ];

        const expectedResult = [
          { label: 'serie 1', data: [1, 2], type: PoChartType.Line, color: '#0C6C94' },
          { label: 'serie 2', data: [3, 4], type: PoChartType.Line, color: '#29B6C5' }
        ];

        component['validateSerieAndAddType'](component.series);

        expect(component.chartSeries).toEqual(expectedResult);
      });
    });
  });
});

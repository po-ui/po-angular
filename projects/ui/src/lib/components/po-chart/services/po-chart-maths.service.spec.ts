import { TestBed } from '@angular/core/testing';

import { PoChartMathsService } from './po-chart-maths.service';
import { PoChartType } from '../enums/po-chart-type.enum';

describe('PoChartMathsService', () => {
  let service: PoChartMathsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoChartMathsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    it('calculateMinAndMaxValues: should return the maximum and minimum series values', () => {
      const series = [
        { label: 'A', data: [-20, 20, 45] },
        { label: 'B', data: [200, 170, 210] }
      ];
      const expectedResult = { minValue: -20, maxValue: 210 };

      expect(service.calculateMinAndMaxValues(series)).toEqual(expectedResult);
    });

    it('calculateMinAndMaxValues: should return 0 if serie.data is not an array', () => {
      const series = [
        { label: 'A', data: 40 },
        { label: 'B', data: 20 }
      ];

      const expectedResult = { minValue: 0, maxValue: 0 };

      expect(service.calculateMinAndMaxValues(series)).toEqual(expectedResult);
    });

    it('calculateMinAndMaxValues: should return 0 for minValue if `acceptNegativeValues` is false and minValue is negative', () => {
      const series = [
        { label: 'A', data: [-20, 20, 45] },
        { label: 'B', data: [200, 170, 210] }
      ];
      const expectedResult = { minValue: 0, maxValue: 210 };
      const acceptNegativeValues = false;

      expect(service.calculateMinAndMaxValues(series, acceptNegativeValues)).toEqual(expectedResult);
    });

    it('calculateMinAndMaxValues: should return 0 for maxValue if `acceptNegativeValues` is true and maxValue is negative', () => {
      const series = [
        { label: 'A', data: [-20, -20, -45] },
        { label: 'B', data: [-200, -170, -210] }
      ];
      const expectedResult = { minValue: -210, maxValue: 0 };
      const acceptNegativeValues = true;

      expect(service.calculateMinAndMaxValues(series, acceptNegativeValues)).toEqual(expectedResult);
    });

    it('range: should call `getGridLineArea` and return a list of values according with gridLabels default value', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const expectedResult = [0, 50, 100, 150, 200];
      const gridLines = 5;

      const spygetGridLineArea = spyOn(service, <any>'getGridLineArea').and.callThrough();

      expect(service.range(minMaxValues)).toEqual(expectedResult);
      expect(spygetGridLineArea).toHaveBeenCalledWith(minMaxValues, gridLines);
    });

    it('range: return a list of values according with gridLabels passed value', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const expectedResult = [0, 100, 200];
      const gridLines = 3;

      const spyGetGridLineArea = spyOn(service, <any>'getGridLineArea').and.callThrough();

      expect(service.range(minMaxValues, gridLines)).toEqual(expectedResult);
      expect(spyGetGridLineArea).toHaveBeenCalledWith(minMaxValues, gridLines);
    });

    it('range: should return only one item if minValue and maxValue have same value', () => {
      const minMaxValues = { minValue: 1, maxValue: 1 };
      const expectedResult = [1];

      const gridLines = 5;

      expect(service.range(minMaxValues, gridLines)).toEqual(expectedResult);
    });

    it('range: should return 6 itens', () => {
      const minMaxValues = { minValue: 19, maxValue: 100 };
      const expectedResult = [19, 35.2, 51.4, 67.6, 83.8, 100];

      const gridLines = 6;

      expect(service.range(minMaxValues, gridLines)).toEqual(expectedResult);
    });

    it('seriesGreaterLength: should return the serie`s greater length value', () => {
      const series = [
        { label: 'A', data: [-20, 20, 45] },
        { label: 'B', data: [200, 170, 210, 40, 200] },
        { label: 'B', data: [200, 210, 200] }
      ];

      expect(service.seriesGreaterLength(series)).toBe(5);
    });

    it('getSeriePercentage: should calulate the percentage in decimals.', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const serieValue = 20;

      expect(service.getSeriePercentage(minMaxValues, serieValue)).toBe(0.1);
    });

    it('getSeriePercentage: should return 0 if the result from calculation isn`t a number.', () => {
      const minMaxValues = { minValue: 1, maxValue: 1 };
      const serieValue = 1;

      expect(service.getSeriePercentage(minMaxValues, serieValue)).toBe(0);
    });

    it('verifyIfFloatOrInteger: should return true if valid values', () => {
      const validValues = [1, 2, 500, 50.2, -123, -123.12, 0.000001];

      validValues.forEach(value => {
        expect(service.verifyIfFloatOrInteger(value)).toBeTruthy();
      });
    });

    it('verifyIfFloatOrInteger: should return false if invalid values', () => {
      const validValues = ['1', '-19', 'number', false, true, isNaN, Infinity];

      validValues.forEach(value => {
        expect(service.verifyIfFloatOrInteger(<any>value)).toBeFalsy();
      });
    });

    it('getLongestDataValue: should call `sortLongestData` if type is `bar`', () => {
      const data = ['Vancouver', 'Otawa'];
      const type = PoChartType.Bar;
      const options = {};

      const spySortLongestData = spyOn(service, <any>'sortLongestData');
      const spyGetAxisXLabelLongestValue = spyOn(service, <any>'getAxisXLabelLongestValue');

      service.getLongestDataValue(data, type, options);

      expect(spySortLongestData).toHaveBeenCalledWith(data);
      expect(spyGetAxisXLabelLongestValue).not.toHaveBeenCalled();
    });

    it('getLongestDataValue: should call `getAxisXLabelLongestValue` if type is not `bar`', () => {
      const data = ['Vancouver', 'Otawa'];
      const type = PoChartType.Line;
      const options = { axis: { gridLines: 5 } };

      const spySortLongestData = spyOn(service, <any>'sortLongestData');
      const spyGetAxisXLabelLongestValue = spyOn(service, <any>'getAxisXLabelLongestValue');

      service.getLongestDataValue(data, type, options);

      expect(spyGetAxisXLabelLongestValue).toHaveBeenCalledWith(data, 5);
      expect(spySortLongestData).not.toHaveBeenCalled();
    });

    it('getLongestDataValue: should call `getAxisXLabelLongestValue` passing data and 5 as params if options.axis is undefined', () => {
      const type = PoChartType.Line;
      const options = undefined;

      const spySortLongestData = spyOn(service, <any>'sortLongestData');
      const spyGetAxisXLabelLongestValue = spyOn(service, <any>'getAxisXLabelLongestValue');

      service.getLongestDataValue(undefined, type, options);

      expect(spyGetAxisXLabelLongestValue).toHaveBeenCalledWith([], 5);
      expect(spySortLongestData).not.toHaveBeenCalled();
    });

    it('getAxisXLabelLongestValue: should call `calculateMinAndMaxValues` passing data and allowNegativeData false as params', () => {
      const data = [{ data: [-30, 0, 10], type: PoChartType.Column }];
      const gridLines = 5;

      const spyCalculateMinAndMaxValues = spyOn(service, <any>'calculateMinAndMaxValues');
      spyOn(service, <any>'range');
      spyOn(service, <any>'sortLongestData');

      service['getAxisXLabelLongestValue'](data, gridLines);

      expect(spyCalculateMinAndMaxValues).toHaveBeenCalledWith(data, false);
    });

    it('getAxisXLabelLongestValue: should call `calculateMinAndMaxValues` passing data and allowNegativeData true as params', () => {
      const data = [{ data: [-30, 0, 10], type: PoChartType.Line }];
      const gridLines = 5;

      const spyCalculateMinAndMaxValues = spyOn(service, <any>'calculateMinAndMaxValues');
      spyOn(service, <any>'range');
      spyOn(service, <any>'sortLongestData');

      service['getAxisXLabelLongestValue'](data, gridLines);

      expect(spyCalculateMinAndMaxValues).toHaveBeenCalledWith(data, true);
    });

    it('getAxisXLabelLongestValue: should call `range` and `sortLongestData`', () => {
      const data = [{ data: [-30, 0, 10], type: PoChartType.Line }];
      const gridLines = 5;

      spyOn(service, <any>'calculateMinAndMaxValues');
      const spyRange = spyOn(service, <any>'range');
      const spySortLongestData = spyOn(service, <any>'sortLongestData');

      service['getAxisXLabelLongestValue'](data, gridLines);

      expect(spyRange).toHaveBeenCalled();
      expect(spySortLongestData).toHaveBeenCalled();
    });

    it('amountOfGridLines: should return 5 if options is undefined', () => {
      const options = undefined;

      expect(service['amountOfGridLines'](options)).toBe(5);
    });

    it('amountOfGridLines: should return 5 if options.gridLines value is lower than 2', () => {
      const options = { gridLines: 1 };

      expect(service['amountOfGridLines'](options)).toBe(5);
    });

    it('amountOfGridLines: should return 5 if options.gridLines value is greater than 10', () => {
      const options = { gridLines: 19 };

      expect(service['amountOfGridLines'](options)).toBe(5);
    });

    it('amountOfGridLines: should return options.gridLines value', () => {
      const options = { gridLines: 7 };

      expect(service['amountOfGridLines'](options)).toBe(7);
    });

    it('sortLongestData: should return 400 as longest data value', () => {
      const data = [1, 2, 400, 3];

      expect(service['sortLongestData'](data)).toBe(400);
    });
  });
});

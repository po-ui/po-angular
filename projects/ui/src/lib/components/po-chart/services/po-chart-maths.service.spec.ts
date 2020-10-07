import { TestBed } from '@angular/core/testing';

import { PoChartMathsService } from './po-chart-maths.service';

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

    it('range: should call `getAxisXGridLineArea` and return a list of values according with axisXGridLabels default value', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const expectedResult = [0, 50, 100, 150, 200];
      const axisXGridLines = 5;

      const spyGetAxisXGridLineArea = spyOn(service, <any>'getAxisXGridLineArea').and.callThrough();

      expect(service.range(minMaxValues)).toEqual(expectedResult);
      expect(spyGetAxisXGridLineArea).toHaveBeenCalledWith(minMaxValues, axisXGridLines);
    });

    it('range: return a list of values according with axisXGridLabels passed value', () => {
      const minMaxValues = { minValue: 0, maxValue: 200 };
      const expectedResult = [0, 100, 200];
      const axisXGridLines = 3;

      const spyGetAxisXGridLineArea = spyOn(service, <any>'getAxisXGridLineArea').and.callThrough();

      expect(service.range(minMaxValues, axisXGridLines)).toEqual(expectedResult);
      expect(spyGetAxisXGridLineArea).toHaveBeenCalledWith(minMaxValues, axisXGridLines);
    });

    it('range: should return only one item if minValue and maxValue have same value', () => {
      const minMaxValues = { minValue: 1, maxValue: 1 };
      const expectedResult = [1];

      const axisXGridLines = 5;

      expect(service.range(minMaxValues, axisXGridLines)).toEqual(expectedResult);
    });

    it('calculateSideSpacing: should return value referring to space between label x and serie`s plot', () => {
      const containerWidth = 200;
      const seriesLength = 7;

      expect(service.calculateSideSpacing(containerWidth, seriesLength)).toBe(9);
    });

    it('calculateSideSpacing: should return 24 referring to space between label x and serie`s plot if halfCategoryWidth exceeds the limit of 24', () => {
      const containerWidth = 200;
      const seriesLength = 2;

      expect(service.calculateSideSpacing(containerWidth, seriesLength)).toBe(24);
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
  });
});

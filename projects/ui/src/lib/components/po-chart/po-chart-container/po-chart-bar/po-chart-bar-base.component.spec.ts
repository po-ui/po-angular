import { expectPropertiesValues } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoChartBarBaseComponent } from './po-chart-bar-base.component';

import { PoChartColorService } from '../../services/po-chart-color.service';
import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartType } from '../../enums/po-chart-type.enum';

class PoChartColumnComponent extends PoChartBarBaseComponent {
  barCoordinates(): string {
    return '';
  }
}

describe('PoChartBarBaseComponent', () => {
  let component: PoChartColumnComponent;

  const series = [
    { label: 'category', data: [1, 2, 3] },
    { label: 'category B', data: [10, 20, 30] }
  ];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    svgPlottingAreaWidth: 20,
    svgPlottingAreaHeight: 20
  };

  const colorService: PoChartColorService = new PoChartColorService();
  const mathsService: PoChartMathsService = new PoChartMathsService();

  beforeEach(() => {
    component = new PoChartColumnComponent(colorService, mathsService);
    component.containerSize = containerSize;
    component.series = series;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSerieBarClick: should emit `barClick`', () => {
      const selectedItem = { label: 'cat', data: 200 };

      const spyBarClick = spyOn(component.barClick, 'emit');

      component.onSerieBarClick(selectedItem);

      expect(spyBarClick).toHaveBeenCalledWith(selectedItem);
    });

    it('onSerieBarHover: should emit `BarHover`', () => {
      const selectedItem = { label: 'Vancouver', data: 200 };

      const spyBarHover = spyOn(component.barHover, 'emit');

      component.onSerieBarHover(selectedItem);

      expect(spyBarHover).toHaveBeenCalledWith({ label: 'Vancouver', data: 200 });
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    it('getDomainValues: should always apply zero to minValue and get maxValue from `minMaxSeriesValues`', () => {
      component.options = undefined;
      component['acceptNegativeValues'] = true;

      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 0, maxValue: 30 });
    });

    it('getDomainValues: should apply maxValue with the min and max values of `options` but apply zero to minValue', () => {
      component.options = { minRange: -10, maxRange: 50 };
      component['acceptNegativeValues'] = true;

      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 0, maxValue: 50 });
    });

    it('getDomainValues: should apply minValue with zero if `acceptNegativeValues` is false and `options` is undefined', () => {
      component.options = undefined;
      component['acceptNegativeValues'] = false;

      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 0, maxValue: 30 });
    });

    it('getDomainValues: should apply minValue with zero if `minValue` is negative and `acceptNegativeValues` is false', () => {
      component.options = { minRange: -10, maxRange: 50 };
      component['acceptNegativeValues'] = false;

      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 0, maxValue: 50 });
    });

    it('getDomainValues: should apply minValue with the min values of `series` if `minValue` isn`t negative and `acceptNegativeValues` is false', () => {
      component.options = { minRange: 10, maxRange: 50 };
      component['acceptNegativeValues'] = false;

      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 1, maxValue: 50 });
    });

    describe('calculateSeriesPathsCoordinates', () => {
      it('should call `verifyIfFloatOrInteger`, `barCoordinates`, `serieCategory` and `serieLabel`', () => {
        const minMaxSeriesValues = { minValue: 1, maxValue: 30 };

        const spyVerifyIfFloatOrInteger = spyOn(component['mathsService'], 'verifyIfFloatOrInteger').and.callThrough();
        const spyBarCoordinates = spyOn(component, <any>'barCoordinates');
        const spySerieCategory = spyOn(component, <any>'serieCategory');
        const spySerieLabel = spyOn(component, <any>'serieLabel');

        component['calculateSeriesPathsCoordinates'](component.containerSize, component.series, minMaxSeriesValues);

        expect(spyVerifyIfFloatOrInteger).toHaveBeenCalled();
        expect(spyBarCoordinates).toHaveBeenCalled();
        expect(spySerieCategory).toHaveBeenCalled();
        expect(spySerieLabel).toHaveBeenCalled();
      });

      it('should apply apply value to `seriesPathsCoordinates`', () => {
        component.series = [{ label: 'Vancouver', data: [5, 10] }];
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        const expectedResult = [
          [
            {
              category: undefined,
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              coordinates: 'M96 28 L116 8'
            },
            {
              category: undefined,
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              coordinates: 'M96 28 L116 8'
            }
          ]
        ];

        spyOn(component, 'barCoordinates').and.returnValue('M96 28 L116 8');

        component['calculateSeriesPathsCoordinates'](component.containerSize, component.series, minMaxSeriesValues);

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });
    });

    it('should apply apply only data to tooltipLabel if label is undefined', () => {
      component.series = [{ label: undefined, data: [5, 10] }];
      const minMaxSeriesValues = { minValue: 5, maxValue: 10 };

      const expectedResult = [
        [
          {
            category: undefined,
            label: undefined,
            tooltipLabel: '5',
            data: 5,
            coordinates: 'M96 28 L116 8'
          },
          {
            category: undefined,
            label: undefined,
            tooltipLabel: '10',
            data: 10,
            coordinates: 'M96 28 L116 8'
          }
        ]
      ];

      spyOn(component, 'barCoordinates').and.returnValue('M96 28 L116 8');

      component['calculateSeriesPathsCoordinates'](component.containerSize, component.series, minMaxSeriesValues);

      expect(component.seriesPathsCoordinates).toEqual(expectedResult);
      expect(component.seriesPathsCoordinates.length).toBe(1);
      expect(component.seriesPathsCoordinates[0].length).toBe(2);
    });

    it('should apply `categories` values at seriesPathsCoordinates', () => {
      component.series = [{ label: 'Vancouver', data: [5, 10] }];
      component.categories = ['janeiro', 'fevereiro'];
      const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
      const expectedResult = [
        [
          {
            category: 'janeiro',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 5',
            data: 5,
            coordinates: 'M96 28 L116 8'
          },
          {
            category: 'fevereiro',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 10',
            data: 10,
            coordinates: 'M96 28 L116 8'
          }
        ]
      ];

      spyOn(component, 'barCoordinates').and.returnValue('M96 28 L116 8');

      component['calculateSeriesPathsCoordinates'](component.containerSize, component.series, minMaxSeriesValues);

      expect(component.seriesPathsCoordinates).toEqual(expectedResult);
      expect(component.seriesPathsCoordinates.length).toBe(1);
      expect(component.seriesPathsCoordinates[0].length).toBe(2);
    });

    it('should ignore to coordinates the serie.data which it`s value is null', () => {
      component.categories = ['janeiro', 'fevereiro', 'março'];
      const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
      const chartSeries = [{ label: 'Vancouver', data: [10, null, 12] }];
      const expectedResult = [
        [
          {
            category: 'janeiro',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 10',
            data: 10,
            coordinates: 'M96 28 L116 8'
          },
          {
            category: 'março',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 12',
            data: 12,
            coordinates: 'M96 28 L116 8'
          }
        ]
      ];

      spyOn(component, 'barCoordinates').and.returnValue('M96 28 L116 8');

      component['calculateSeriesPathsCoordinates'](component.containerSize, <any>chartSeries, minMaxSeriesValues);

      expect(component.seriesPathsCoordinates).toEqual(expectedResult);
    });

    it('shouldn`t apply values to`seriesPathsCoordinates` if series.data isn`t an array', () => {
      const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
      const chartSeries = [{ label: 'Vancouver', data: 12 }];

      component['calculateSeriesPathsCoordinates'](component.containerSize, <any>chartSeries, minMaxSeriesValues);

      expect(component.seriesPathsCoordinates).toEqual([undefined]);
    });
  });

  describe('Properties:', () => {
    it('p-container-size: should call `getDomainValues` and `calculateSeriesPathsCoordinates`', () => {
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spyCalculateSeriesPathsCoordinates = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.containerSize = containerSize;

      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spyCalculateSeriesPathsCoordinates).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it('p-series: should call `getDomainValues`, `calculateSeriesPathsCoordinates`, `seriesGreaterLength` and `getSeriesColor`', () => {
      const type = PoChartType.Column;
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.series = series;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyGetSeriesColor).toHaveBeenCalledWith(component.series, type);
      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spyCalculateSeriesPathsCoordinatesn).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it(`p-series: should call 'getDomainValues', 'calculateSeriesPathsCoordinates', 'seriesGreaterLength' and 'getSeriesColor' if 'serie.data'
    is an empty array`, () => {
      const type = PoChartType.Column;
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.series = <any>[{ label: 'category', data: [] }];

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyGetSeriesColor).toHaveBeenCalledWith(component.series, type);
      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spyCalculateSeriesPathsCoordinatesn).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it('p-series: shouldn`t bind any function if `serie.data` isn`t an array', () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.series = <any>[
        { label: 'category', data: 1 },
        { label: 'category B', data: 2 }
      ];

      expect(spySeriesGreaterLength).not.toHaveBeenCalled();
      expect(spyGetSeriesColor).not.toHaveBeenCalled();
      expect(spyGetDomainValues).not.toHaveBeenCalled();
      expect(spyCalculateSeriesPathsCoordinatesn).not.toHaveBeenCalled();
    });

    it('p-options: should update property if valid values', () => {
      const validValues = [{}, { gridLines: 5 }];

      expectPropertiesValues(component, 'options', validValues, validValues);
    });

    it('p-options: shouldn`t update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, ['1'], [{ key: 'value' }]];

      expectPropertiesValues(component, 'options', invalidValues, undefined);
    });

    it('p-options: should call `getDomainValues` and `calculateSeriesPathsCoordinates`', () => {
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.options = { gridLines: 5, maxRange: 100, minRange: 0 };

      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spyCalculateSeriesPathsCoordinatesn).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });
  });
});

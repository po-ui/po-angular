import { PoChartBarBaseComponent } from './po-chart-bar-base.component';

import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartType } from '../../enums/po-chart-type.enum';
import { expectPropertiesValues } from 'projects/ui/src/lib/util-test/util-expect.spec';

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
    axisXLabelWidth: 72,
    svgPlottingAreaHeight: 20
  };
  const range = { minValue: 0, maxValue: 30 };

  const mathsService: PoChartMathsService = new PoChartMathsService();

  beforeEach(() => {
    component = new PoChartColumnComponent(mathsService);
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

    describe('calculateSeriesPathsCoordinates', () => {
      it('should call `verifyIfFloatOrInteger`, `barCoordinates`, `serieCategory` and `getTooltipLabel`', () => {
        const minMaxSeriesValues = { minValue: 1, maxValue: 30 };

        const spyVerifyIfFloatOrInteger = spyOn(component['mathsService'], 'verifyIfFloatOrInteger').and.callThrough();
        const spyBarCoordinates = spyOn(component, <any>'barCoordinates');
        const spySerieCategory = spyOn(component, <any>'serieCategory');
        const spyGetTooltipLabel = spyOn(component, <any>'getTooltipLabel');

        component['calculateSeriesPathsCoordinates'](component.containerSize, component.series, minMaxSeriesValues);

        expect(spyVerifyIfFloatOrInteger).toHaveBeenCalled();
        expect(spyBarCoordinates).toHaveBeenCalled();
        expect(spySerieCategory).toHaveBeenCalled();
        expect(spyGetTooltipLabel).toHaveBeenCalled();
      });

      it('should apply apply value to `seriesPathsCoordinates`', () => {
        component.series = [{ label: 'Vancouver', data: [5, 10], type: PoChartType.Column, color: '#94DAE2' }];

        const minMaxSeriesValues = { minValue: 0, maxValue: 10 };
        const expectedResult = [
          [
            {
              category: undefined,
              color: '#94DAE2',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              coordinates: 'M96 28 L116 8'
            },
            {
              category: undefined,
              color: '#94DAE2',
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
      component.series = [{ label: undefined, data: [5, 10], color: '#94DAE2' }];
      const minMaxSeriesValues = { minValue: 5, maxValue: 10 };

      const expectedResult = [
        [
          {
            category: undefined,
            color: '#94DAE2',
            label: undefined,
            tooltipLabel: '5',
            data: 5,
            coordinates: 'M96 28 L116 8'
          },
          {
            category: undefined,
            color: '#94DAE2',
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
      component.series = [{ label: 'Vancouver', data: [5, 10], color: '#94DAE2' }];
      component.categories = ['janeiro', 'fevereiro'];
      const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
      const expectedResult = [
        [
          {
            category: 'janeiro',
            color: '#94DAE2',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 5',
            data: 5,
            coordinates: 'M96 28 L116 8'
          },
          {
            category: 'fevereiro',
            color: '#94DAE2',
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
      const chartSeries = [{ label: 'Vancouver', data: [10, null, 12], color: '#94DAE2' }];
      const expectedResult = [
        [
          {
            category: 'janeiro',
            color: '#94DAE2',
            label: 'Vancouver',
            tooltipLabel: 'Vancouver: 10',
            data: 10,
            coordinates: 'M96 28 L116 8'
          },
          {
            category: 'março',
            color: '#94DAE2',
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
    it('p-container-size: should call `calculateSeriesPathsCoordinates`', () => {
      const spyCalculateSeriesPathsCoordinates = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.containerSize = containerSize;
      component.range = range;

      expect(spyCalculateSeriesPathsCoordinates).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component.range
      );
    });

    it('p-series: should call`calculateSeriesPathsCoordinates`, and `seriesGreaterLength`', () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.series = series;
      component.range = range;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyCalculateSeriesPathsCoordinatesn).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component.range
      );
    });

    it(`p-series: should call 'calculateSeriesPathsCoordinates' and 'seriesGreaterLength' if 'serie.data'
    is an empty array`, () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.series = <any>[{ label: 'category', data: [] }];
      component.range = range;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyCalculateSeriesPathsCoordinatesn).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component.range
      );
    });

    it('p-series: shouldn`t bind any function if `serie.data` isn`t an array', () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyCalculateSeriesPathsCoordinatesn = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.series = <any>[
        { label: 'category', data: 1 },
        { label: 'category B', data: 2 }
      ];

      expect(spySeriesGreaterLength).not.toHaveBeenCalled();
      expect(spyCalculateSeriesPathsCoordinatesn).not.toHaveBeenCalled();
    });

    it('p-range: should update property with valid values', () => {
      const validValues = [{ minValue: 1, maxValue: 30 }, {}];

      expectPropertiesValues(component, 'range', validValues, validValues);
    });

    it('p-range: should update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, [], 'value'];

      expectPropertiesValues(component, 'range', invalidValues, {});
    });

    it('p-range: should call `calculateSeriesPathsCoordinates` if range is an object', () => {
      const spyCalculateSeriesPathsCoordinates = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.range = { minValue: 1, maxValue: 30 };

      expect(spyCalculateSeriesPathsCoordinates).toHaveBeenCalled();
    });

    it('p-range: shouldn`t call `calculateSeriesPathsCoordinates` if range isn`t an object', () => {
      const spyCalculateSeriesPathsCoordinates = spyOn(component, <any>'calculateSeriesPathsCoordinates');

      component.range = <any>false;

      expect(spyCalculateSeriesPathsCoordinates).not.toHaveBeenCalled();
    });
  });
});

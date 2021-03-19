import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2 } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoChartModule } from '../../po-chart.module';

import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartLineBaseComponent } from './po-chart-line-base.component';
import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartType } from '../../enums/po-chart-type.enum';
import { expectPropertiesValues } from 'projects/ui/src/lib/util-test/util-expect.spec';

@Component({
  selector: 'po-chart-line-test',
  template: ` <svg:path></svg:path> `
})
class PoChartLineComponent extends PoChartLineBaseComponent {
  constructor(mathsService: PoChartMathsService, renderer: Renderer2, elementRef: ElementRef) {
    super(mathsService, renderer, elementRef);
  }
}

describe('PoChartLineBaseComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

  const series = [
    { label: 'category', data: [1, 2, 3], type: PoChartType.Line, color: '#0C6C94' },
    { label: 'category B', data: [10, 20, 30], type: PoChartType.Line, color: '#29B6C5' }
  ];

  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    axisXLabelWidth: 72,
    svgPlottingAreaHeight: 20
  };

  const range = { minValue: 0, maxValue: 30 };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoChartModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLineComponent);

    component = fixture.componentInstance;

    component.containerSize = containerSize;
    component.series = series;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component instanceof PoChartLineComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSeriePointClick: should emit `pointClick`', () => {
      const selectedItem = { label: 'cat', data: 200 };

      const spyPointClick = spyOn(component.pointClick, 'emit');

      component.onSeriePointClick(selectedItem);

      expect(spyPointClick).toHaveBeenCalledWith(selectedItem);
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    describe('seriePathPointsDefinition: ', () => {
      it('should call `svgPathCommand`, `xCoordinate`, `yCoordinate`, `serieCategory`, `verifyIfClosePath` and `getTooltipLabel`', () => {
        const minMaxSeriesValues = { minValue: 0, maxValue: 30 };

        const spySvgPathCommand = spyOn(component, <any>'svgPathCommand');
        const spyXCoordinate = spyOn(component, <any>'xCoordinate');
        const spyYCoordinate = spyOn(component, <any>'yCoordinate');
        const spySerieCategory = spyOn(component, <any>'serieCategory');
        const spyGetTooltipLabel = spyOn(component, <any>'getTooltipLabel');
        const spyVerifyIfClosePath = spyOn(component, <any>'verifyIfClosePath');

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        expect(spySvgPathCommand).toHaveBeenCalled();
        expect(spyXCoordinate).toHaveBeenCalled();
        expect(spyYCoordinate).toHaveBeenCalled();
        expect(spySerieCategory).toHaveBeenCalled();
        expect(spyGetTooltipLabel).toHaveBeenCalled();
        expect(spyVerifyIfClosePath).toHaveBeenCalled();
      });

      it('should apply apply value to `seriesPathsCoordinates`', () => {
        component['seriePathPointsDefinition'](component.containerSize, component.series, range);

        const expectedResult = [
          { coordinates: ' M93 27 L136 26 L178 26', color: '#0C6C94', isActive: true },
          { coordinates: ' M93 21 L136 14 L178 8', color: '#29B6C5', isActive: true }
        ];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(2);
      });

      it('should apply apply value to `seriesPointsCoordinates`', () => {
        component.series = [{ label: 'Vancouver', data: [5, 10], type: PoChartType.Line, color: 'blue' }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, range);

        const expectedResult = [
          [
            {
              category: undefined,
              color: 'blue',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              xCoordinate: 104,
              yCoordinate: 24,
              isActive: true
            },
            {
              category: undefined,
              color: 'blue',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 168,
              yCoordinate: 21,
              isActive: true
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should apply apply only data to tooltipLabel if label is undefined', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: undefined, data: [5, 10], type: PoChartType.Line, color: 'blue' }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              category: undefined,
              color: 'blue',
              label: undefined,
              tooltipLabel: '5',
              data: 5,
              xCoordinate: 104,
              yCoordinate: 28,
              isActive: true
            },
            {
              category: undefined,
              color: 'blue',
              label: undefined,
              tooltipLabel: '10',
              data: 10,
              xCoordinate: 168,
              yCoordinate: 8,
              isActive: true
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should apply apply value to `seriesPointsCoordinates` passing `categories` value of each one', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [5, 10], type: PoChartType.Line, color: 'blue' }];
        component.categories = ['janeiro', 'fevereiro'];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              category: 'janeiro',
              color: 'blue',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              xCoordinate: 104,
              yCoordinate: 28,
              isActive: true
            },
            {
              category: 'fevereiro',
              color: 'blue',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 168,
              yCoordinate: 8,
              isActive: true
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should ignore to coordinates the serie.data which it`s value is null', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [10, null, 12], type: PoChartType.Line, color: '#29B6C5' }];
        component.categories = ['janeiro', 'fevereiro', 'março'];

        const expectedPointsResult = [
          [
            {
              category: 'janeiro',
              color: '#29B6C5',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 93,
              yCoordinate: 8,
              isActive: true
            },
            {
              category: 'março',
              color: '#29B6C5',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 12',
              data: 12,
              xCoordinate: 178,
              yCoordinate: 0,
              isActive: true
            }
          ]
        ];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual(expectedPointsResult);
        expect(component.seriesPathsCoordinates).toEqual([
          { coordinates: ' M93 8 L178 0', color: '#29B6C5', isActive: true }
        ]);
      });

      it('shouldn`t apply values to `seriesPointsCoordinates` neither to `seriesPathsCoordinates` if series.data isn`t an array', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        const chartSeries = [{ label: 'Vancouver', data: 12, type: PoChartType.Line }];

        component['seriePathPointsDefinition'](component.containerSize, <any>chartSeries, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual([]);
        expect(component.seriesPointsCoordinates.length).toBe(0);
        expect(component.seriesPathsCoordinates).toEqual([undefined]);
      });

      it('shouldn`t apply only `M` coordenate at `seriesPathsCoordinates.coordinates` `seriesPathsCoordinates` if series.data has only one item', () => {
        const minMaxSeriesValues = { minValue: 10, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [10], type: PoChartType.Line, color: '#29B6C5' }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [{ coordinates: ' M136 28', color: '#29B6C5', isActive: true }];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });
    });

    it('verifyIfClosePath: should append coordinates to close the current path', () => {
      const pathCoordinates = 'M93 8 L178 0';
      const lastIndex = 3;
      const data = 0;
      component.chartType = PoChartType.Area;

      const expectedResult = 'M93 8 L178 0 221 28 L93 28 Z';

      expect(component['verifyIfClosePath'](pathCoordinates, lastIndex, range, data, containerSize)).toBe(
        expectedResult
      );
    });

    it('verifyIfClosePath: should append coordinates to close the current path considering that `alignByTheCorners` is true', () => {
      const pathCoordinates = 'M93 8 L178 0';
      const lastIndex = 3;
      const data = 0;
      component.chartType = PoChartType.Area;
      component.alignByTheCorners = true;

      const expectedResult = 'M93 8 L178 0 264 28 L72 28 Z';

      expect(component['verifyIfClosePath'](pathCoordinates, lastIndex, range, data, containerSize)).toBe(
        expectedResult
      );
    });

    it('verifyIfClosePath: should return the param pathCoordinate if chartType is `Line`', () => {
      const pathCoordinates = 'M93 8 L178 0';
      const lastIndex = 3;
      const data = 0;
      component.chartType = PoChartType.Line;

      expect(component['verifyIfClosePath'](pathCoordinates, lastIndex, range, data, containerSize)).toBe(
        pathCoordinates
      );
    });

    it('xCoordinate: should return `Infinity` if xRatio returns` isNan', () => {
      component['seriesLength'] = 0;

      expect(component['xCoordinate'](0, containerSize)).toBe(Infinity);
    });

    it('xCoordinate: should return x coordinates considering that `alignByTheCorners` is true', () => {
      component.alignByTheCorners = true;
      component.series = [{ label: 'Vancouver', data: [10, null, 12], type: PoChartType.Line, color: '#29B6C5' }];

      expect(component['xCoordinate'](0, containerSize)).toBe(72);
    });
  });

  describe('Properties:', () => {
    it('p-container-size: should call `seriePathPointsDefinition`', () => {
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.containerSize = containerSize;
      component.range = range;

      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component.range
      );
    });

    it('p-series: should call `calculateMinAndMaxValues`, `seriePathPointsDefinition` and `seriesGreaterLength`', () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = series;
      component.range = range;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component.range
      );
    });

    it(`p-series: should call 'calculateMinAndMaxValues', 'seriePathPointsDefinition' and 'seriesGreaterLength' if 'serie.data'
    is an empty array`, () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = <any>[{ label: 'category', data: [] }];
      component.range = range;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component.range
      );
    });

    it('p-series: shouldn`t bind any function if `serie.data` isn`t an array', () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = <any>[
        { label: 'category', data: 1 },
        { label: 'category B', data: 2 }
      ];

      expect(spySeriesGreaterLength).not.toHaveBeenCalled();
      expect(spySeriePathPointsDefinition).not.toHaveBeenCalled();
    });

    it('p-range: should update property with valid values', () => {
      const validValues = [{ minValue: 1, maxValue: 30 }, {}];

      expectPropertiesValues(component, 'range', validValues, validValues);
    });

    it('p-range: should update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, [], 'value'];

      expectPropertiesValues(component, 'range', invalidValues, {});
    });

    it('p-range: should call `seriePathPointsDefinition` if range is an object', () => {
      const spyseriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.range = { minValue: 1, maxValue: 30 };

      expect(spyseriePathPointsDefinition).toHaveBeenCalled();
    });

    it('p-range: shouldn`t call `calculateSeriesPathsCoordinates` if range isn`t an object', () => {
      const spyseriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.range = <any>false;

      expect(spyseriePathPointsDefinition).not.toHaveBeenCalled();
    });
  });
});

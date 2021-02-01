import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectPropertiesValues } from 'projects/ui/src/lib/util-test/util-expect.spec';

import { PoChartLineComponent } from './po-chart-line.component';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartModule } from '../../po-chart.module';

describe('PoChartLineComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

  const series = [
    { label: 'category', data: [1, 2, 3], color: '#94DAE2' },
    { label: 'category B', data: [10, 20, 30], color: '#29B6C5' }
  ];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    svgPlottingAreaWidth: 20,
    svgPlottingAreaHeight: 20
  };

  const range = { minValue: 1, maxValue: 30 };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoChartModule],
      declarations: [PoChartLineComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartLineComponent);
    component = fixture.componentInstance;
    component.series = series;
    component.containerSize = containerSize;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSeriePointClick: should emit `pointClick`', () => {
      const selectedItem = { label: 'cat', data: 200 };

      const spyPointClick = spyOn(component.pointClick, 'emit');

      component.onSeriePointClick(selectedItem);

      expect(spyPointClick).toHaveBeenCalledWith(selectedItem);
    });

    it('onSeriePointHover: should emit `pointHover` and call `reorderSVGGroup`', () => {
      const selectedItem = { relativeTo: 'po-chart-path-1', label: 'Vancouver', data: 200 };

      const spyReorderSVGGroup = spyOn(component, <any>'reorderSVGGroup');
      const spyPointHover = spyOn(component.pointHover, 'emit');

      component.onSeriePointHover(selectedItem);

      expect(spyPointHover).toHaveBeenCalledWith({ label: 'Vancouver', data: 200 });
      expect(spyReorderSVGGroup).toHaveBeenCalledWith('po-chart-path-1');
    });

    it('trackBy: should return index param', () => {
      const index = 1;
      const expectedValue = index;

      expect(component.trackBy(index)).toBe(expectedValue);
    });

    describe('seriePathPointsDefinition: ', () => {
      it('should call `svgPathCommand`, `xCoordinate`, `yCoordinate`, `serieCategory` and `getTooltipLabel`', () => {
        const minMaxSeriesValues = { minValue: 0, maxValue: 30 };

        const spySvgPathCommand = spyOn(component, <any>'svgPathCommand');
        const spyXCoordinate = spyOn(component, <any>'xCoordinate');
        const spyYCoordinate = spyOn(component, <any>'yCoordinate');
        const spySerieCategory = spyOn(component, <any>'serieCategory');
        const spyGetTooltipLabel = spyOn(component, <any>'getTooltipLabel');

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        expect(spySvgPathCommand).toHaveBeenCalled();
        expect(spyXCoordinate).toHaveBeenCalled();
        expect(spyYCoordinate).toHaveBeenCalled();
        expect(spySerieCategory).toHaveBeenCalled();
        expect(spyGetTooltipLabel).toHaveBeenCalled();
      });

      it('should apply apply value to `seriesPathsCoordinates`', () => {
        component.series = [{ label: 'Vancouver', data: [5, 10], color: '#94DAE2' }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, range);

        const expectedResult = [{ coordinates: ' M104 25 L114 21', color: '#94DAE2' }];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });

      it('should apply apply value to `seriesPointsCoordinates`', () => {
        component.series = [{ label: 'Vancouver', data: [5, 10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, range);

        const expectedResult = [
          [
            {
              category: undefined,
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              xCoordinate: 104,
              yCoordinate: 25
            },
            {
              category: undefined,
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 114,
              yCoordinate: 21
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should apply apply only data to tooltipLabel if label is undefined', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: undefined, data: [5, 10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              category: undefined,
              label: undefined,
              tooltipLabel: '5',
              data: 5,
              xCoordinate: 104,
              yCoordinate: 28
            },
            {
              category: undefined,
              label: undefined,
              tooltipLabel: '10',
              data: 10,
              xCoordinate: 114,
              yCoordinate: 8
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should apply apply value to `seriesPointsCoordinates` passing `categories` value of each one', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [5, 10] }];
        component.categories = ['janeiro', 'fevereiro'];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              category: 'janeiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              xCoordinate: 104,
              yCoordinate: 28
            },
            {
              category: 'fevereiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 114,
              yCoordinate: 8
            }
          ]
        ];

        expect(component.seriesPointsCoordinates).toEqual(expectedResult);
        expect(component.seriesPointsCoordinates.length).toBe(1);
        expect(component.seriesPointsCoordinates[0].length).toBe(2);
      });

      it('should ignore to coordinates the serie.data which it`s value is null', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        const chartSeries = [{ label: 'Vancouver', data: [10, null, 12], color: '#29B6C5' }];
        component.categories = ['janeiro', 'fevereiro', 'março'];

        const expectedPointsResult = [
          [
            {
              category: 'janeiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 93.33333333333333,
              yCoordinate: 8
            },
            {
              category: 'março',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 12',
              data: 12,
              xCoordinate: 106.66666666666666,
              yCoordinate: 0
            }
          ]
        ];

        component['seriePathPointsDefinition'](component.containerSize, <any>chartSeries, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual(expectedPointsResult);
        expect(component.seriesPathsCoordinates).toEqual([
          { coordinates: ' M93.33333333333333 8 L106.66666666666666 0', color: '#29B6C5' }
        ]);
      });

      it('shouldn`t apply values to `seriesPointsCoordinates` neither to `seriesPathsCoordinates` if series.data isn`t an array', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        const chartSeries = [{ label: 'Vancouver', data: 12 }];

        component['seriePathPointsDefinition'](component.containerSize, <any>chartSeries, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual([]);
        expect(component.seriesPointsCoordinates.length).toBe(0);
        expect(component.seriesPathsCoordinates).toEqual([undefined]);
      });

      it('shouldn`t apply only `M` coordenate at `seriesPathsCoordinates.coordinates` `seriesPathsCoordinates` if series.data has only one item', () => {
        const minMaxSeriesValues = { minValue: 10, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [10], color: '#29B6C5' }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [{ coordinates: ' M136 28', color: '#29B6C5' }];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });

      it('should convert series values to zero if allowNegativeData is false and serie.data has negative value', () => {
        component.allowNegativeData = false;
        component.categories = ['janeiro', 'fevereiro', 'março'];

        const chartSeries = [{ label: 'Vancouver', data: [-10, -15], color: '#29B6C5' }];
        const expectedPointsResult = [
          [
            {
              category: 'janeiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 0',
              data: 0,
              xCoordinate: 93.33333333333333,
              yCoordinate: 28
            },
            {
              category: 'fevereiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 0',
              data: 0,
              xCoordinate: 100,
              yCoordinate: 28
            }
          ]
        ];

        component['seriePathPointsDefinition'](component.containerSize, <any>chartSeries, range);

        expect(component.seriesPointsCoordinates).toEqual(expectedPointsResult);
      });
    });

    it('reorderSVGGroup: should apply false to `animate` and call `renderer.appendChild` and `querySelectorAll`', () => {
      const pathGroup = 'po-chart-line-path-group-0';

      const spyAppendChild = spyOn(component['renderer'], 'appendChild');

      component['reorderSVGGroup'](pathGroup);

      expect(component.animate).toBeFalsy();
      expect(spyAppendChild).toHaveBeenCalled();
    });

    it('xCoordinate: should return `Infinity` if xRatio returns` isNan', () => {
      component['seriesLength'] = 0;

      expect(component['xCoordinate'](0, containerSize)).toBe(Infinity);
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

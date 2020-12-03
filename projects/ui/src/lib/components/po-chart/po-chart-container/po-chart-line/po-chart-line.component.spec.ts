import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expectPropertiesValues } from '../../../../util-test/util-expect.spec';

import { PoChartLineComponent } from './po-chart-line.component';
import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartModule } from '../../po-chart.module';

describe('PoChartLineComponent', () => {
  let component: PoChartLineComponent;
  let fixture: ComponentFixture<PoChartLineComponent>;

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

    it('getDomainValues: should apply value to `minMaxSeriesValues` with the min and max series values', () => {
      component.options = undefined;
      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: 1, maxValue: 30 });
    });

    it('getDomainValues: should apply value to `minMaxSeriesValues` with the min and max values of `options`', () => {
      component.options = { minRange: -10, maxRange: 50 };
      component['getDomainValues'](component.options);

      expect(component['minMaxSeriesValues']).toEqual({ minValue: -10, maxValue: 50 });
    });

    describe('seriePathPointsDefinition: ', () => {
      it('should call `svgPathCommand`, `xCoordinate`, `yCoordinate`, `serieCategory` and `serieLabel`', () => {
        const minMaxSeriesValues = { minValue: 0, maxValue: 30 };

        const spySvgPathCommand = spyOn(component, <any>'svgPathCommand');
        const spyXCoordinate = spyOn(component, <any>'xCoordinate');
        const spyYCoordinate = spyOn(component, <any>'yCoordinate');
        const spySerieCategory = spyOn(component, <any>'serieCategory');
        const spySerieLabel = spyOn(component, <any>'serieLabel');

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        expect(spySvgPathCommand).toHaveBeenCalled();
        expect(spyXCoordinate).toHaveBeenCalled();
        expect(spyYCoordinate).toHaveBeenCalled();
        expect(spySerieCategory).toHaveBeenCalled();
        expect(spySerieLabel).toHaveBeenCalled();
      });

      it('should apply apply value to `seriesPathsCoordinates`', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [5, 10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [{ coordinates: ' M96 28 L116 8' }];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });

      it('should apply apply value to `seriesPointsCoordinates`', () => {
        const minMaxSeriesValues = { minValue: 5, maxValue: 10 };
        component.series = [{ label: 'Vancouver', data: [5, 10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [
          [
            {
              category: undefined,
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 5',
              data: 5,
              xCoordinate: 96,
              yCoordinate: 28
            },
            {
              category: undefined,
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 116,
              yCoordinate: 8
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
              xCoordinate: 96,
              yCoordinate: 28
            },
            {
              category: undefined,
              label: undefined,
              tooltipLabel: '10',
              data: 10,
              xCoordinate: 116,
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
              xCoordinate: 96,
              yCoordinate: 28
            },
            {
              category: 'fevereiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 116,
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
        const chartSeries = [{ label: 'Vancouver', data: [10, null, 12] }];
        component.categories = ['janeiro', 'fevereiro', 'março'];

        const expectedPointsResult = [
          [
            {
              category: 'janeiro',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 10',
              data: 10,
              xCoordinate: 93,
              yCoordinate: 8
            },
            {
              category: 'março',
              label: 'Vancouver',
              tooltipLabel: 'Vancouver: 12',
              data: 12,
              xCoordinate: 113,
              yCoordinate: 0
            }
          ]
        ];

        component['seriePathPointsDefinition'](component.containerSize, <any>chartSeries, minMaxSeriesValues);

        expect(component.seriesPointsCoordinates).toEqual(expectedPointsResult);
        expect(component.seriesPathsCoordinates).toEqual([{ coordinates: ' M93 8 L113 0' }]);
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
        component.series = [{ label: 'Vancouver', data: [10] }];

        component['seriePathPointsDefinition'](component.containerSize, component.series, minMaxSeriesValues);

        const expectedResult = [{ coordinates: ' M96 28' }];

        expect(component.seriesPathsCoordinates).toEqual(expectedResult);
        expect(component.seriesPathsCoordinates.length).toBe(1);
      });
    });

    it('reorderSVGGroup: should apply false to `animate` and call `renderer.appendChild` and `querySelectorAll`', () => {
      const pathGroup = 'po-chart-line-path-group-0';

      const spyAppendChild = spyOn(component['renderer'], 'appendChild');

      component['reorderSVGGroup'](pathGroup);

      expect(component.animate).toBeFalsy();
      expect(spyAppendChild).toHaveBeenCalled();
    });
  });

  describe('Properties:', () => {
    it('p-container-size: should call `getDomainValues` and `seriePathPointsDefinition`', () => {
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.containerSize = containerSize;

      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it('p-series: should call `calculateMinAndMaxValues`, `getDomainValues`, `seriePathPointsDefinition`, `seriesGreaterLength` and `getSeriesColor`', () => {
      const type = PoChartType.Line;
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = series;

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyGetSeriesColor).toHaveBeenCalledWith(component.series, type);
      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it(`p-series: should call 'calculateMinAndMaxValues', 'getDomainValues', 'seriePathPointsDefinition', 'seriesGreaterLength' and 'getSeriesColor' if 'serie.data'
    is an empty array`, () => {
      const type = PoChartType.Line;
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = <any>[{ label: 'category', data: [] }];

      expect(spySeriesGreaterLength).toHaveBeenCalledWith(component.series);
      expect(spyGetSeriesColor).toHaveBeenCalledWith(component.series, type);
      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });

    it('p-series: shouldn`t bind any function if `serie.data` isn`t an array', () => {
      const spySeriesGreaterLength = spyOn(component['mathsService'], <any>'seriesGreaterLength');
      const spyGetSeriesColor = spyOn(component['colorService'], 'getSeriesColor');
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.series = <any>[
        { label: 'category', data: 1 },
        { label: 'category B', data: 2 }
      ];

      expect(spySeriesGreaterLength).not.toHaveBeenCalled();
      expect(spyGetSeriesColor).not.toHaveBeenCalled();
      expect(spyGetDomainValues).not.toHaveBeenCalled();
      expect(spySeriePathPointsDefinition).not.toHaveBeenCalled();
    });

    it('p-options: should update property if valid values', () => {
      const validValues = [{}, { gridLines: 5 }];

      expectPropertiesValues(component, 'options', validValues, validValues);
    });

    it('p-options: shouldn`t update property if invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, ['1'], [{ key: 'value' }]];

      expectPropertiesValues(component, 'options', invalidValues, undefined);
    });

    it('p-options: should call `getDomainValues` and `seriePathPointsDefinition`', () => {
      const spyGetDomainValues = spyOn(component, <any>'getDomainValues');
      const spySeriePathPointsDefinition = spyOn(component, <any>'seriePathPointsDefinition');

      component.options = { gridLines: 5, maxRange: 100, minRange: 0 };

      expect(spyGetDomainValues).toHaveBeenCalledWith(component.options);
      expect(spySeriePathPointsDefinition).toHaveBeenCalledWith(
        component.containerSize,
        component.series,
        component['minMaxSeriesValues']
      );
    });
  });
});

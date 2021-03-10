import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartContainerSize } from '../../../interfaces/po-chart-container-size.interface';
import { PoChartDonutComponent } from './po-chart-donut.component';
import { PoChartSerie } from '../../../interfaces/po-chart-serie.interface';

describe('PoChartDonutComponent', () => {
  let component: PoChartDonutComponent;
  let fixture: ComponentFixture<PoChartDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartDonutComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartDonutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnChanges: should call `drawSeries` and `applySeriesLabels` if `changes.series`', () => {
      const series: Array<PoChartSerie> = [{ label: 'teste', data: 30 }];
      const containerSize: PoChartContainerSize = { svgHeight: 300 };
      const seriesList = [];
      const changes: SimpleChanges = {
        series: {
          previousValue: '2',
          currentValue: '3',
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.series = series;
      component.containerSize = containerSize;
      component.seriesList = seriesList;

      spyOn(component, <any>'drawSeries');
      spyOn(component, <any>'applySeriesLabels');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).toHaveBeenCalledWith(series, containerSize.svgHeight);
      expect(component['applySeriesLabels']).toHaveBeenCalledWith(seriesList, containerSize.svgHeight);
    });

    it('ngOnChanges: should call `drawSeries` and `applySeriesLabels` if `changes.containerSize`', () => {
      const series: Array<PoChartSerie> = [{ label: 'teste', data: 30 }];
      const containerSize: PoChartContainerSize = { svgHeight: 300 };
      const seriesList = [];
      const changes: SimpleChanges = {
        containerSize: {
          previousValue: '2',
          currentValue: '3',
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.series = series;
      component.containerSize = containerSize;
      component.seriesList = seriesList;

      spyOn(component, <any>'drawSeries');
      spyOn(component, <any>'applySeriesLabels');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).toHaveBeenCalledWith(series, containerSize.svgHeight);
      expect(component['applySeriesLabels']).toHaveBeenCalledWith(seriesList, containerSize.svgHeight);
    });

    it('ngOnChanges: should call `drawSeries` and `applySeriesLabels` if `changes.options`', () => {
      const series: Array<PoChartSerie> = [{ label: 'teste', data: 30 }];
      const containerSize: PoChartContainerSize = { svgHeight: 300 };
      const seriesList = [];
      const changes: SimpleChanges = {
        options: {
          previousValue: 20,
          currentValue: 30,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.series = series;
      component.containerSize = containerSize;
      component.seriesList = seriesList;

      spyOn(component, <any>'drawSeries');
      spyOn(component, <any>'applySeriesLabels');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).toHaveBeenCalledWith(series, containerSize.svgHeight);
      expect(component['applySeriesLabels']).toHaveBeenCalledWith(seriesList, containerSize.svgHeight);
    });

    it('ngOnChanges: should`t call `drawSeries` and `applySeriesLabels`', () => {
      const series: Array<PoChartSerie> = [{ label: 'teste', data: 30 }];
      const containerSize: PoChartContainerSize = { svgHeight: 300 };
      const seriesList = [];
      const changes: SimpleChanges = {};

      component.series = series;
      component.containerSize = containerSize;
      component.seriesList = seriesList;

      spyOn(component, <any>'drawSeries');
      spyOn(component, <any>'applySeriesLabels');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).not.toHaveBeenCalledWith(series, containerSize.svgHeight);
      expect(component['applySeriesLabels']).not.toHaveBeenCalledWith(seriesList, containerSize.svgHeight);
    });

    it('calculateCoordinates: should return coordinates', () => {
      const height = 50;
      const startRadianAngle = 30;
      const endRadianAngle = 80;
      const expectedResult =
        'M 28.8562862471896 0.2992093976784531 A 25 25 0 1,1 22.24031890402381 0.1527836519156196 L 26.655808657585712 39.908329808850624 A -15 -15 0 1,0 22.686228251686238 39.820474361392925 Z';

      spyOn(component, <any>'drawSeries');

      const result = component['calculateCoordinates'](height, startRadianAngle, endRadianAngle);

      expect(result).toBe(expectedResult);
    });

    it('calculateCoordinates: should return coordinates if largeArc is false', () => {
      const height = 50;
      const startRadianAngle = 79;
      const endRadianAngle = 80;
      const expectedResult =
        'M 2.600726330225921 13.897183282312291 A 25 25 0 0,1 22.24031890402381 0.1527836519156196 L 26.655808657585712 39.908329808850624 A -15 -15 0 0,0 38.43956420186444 31.661690030612625 Z';

      spyOn(component, <any>'drawSeries');

      const result = component['calculateCoordinates'](height, startRadianAngle, endRadianAngle);

      expect(result).toBe(expectedResult);
    });

    it('getTooltipLabel: should return tooltipLabel', () => {
      const data = 30;
      const label = 'teste';
      const tooltipLabel = 'teste 1';
      const expectedResult = tooltipLabel;

      spyOn(component, <any>'getPercentValue');

      const result = component['getTooltipLabel'](data, label, tooltipLabel);

      expect(result).toEqual(expectedResult);
      expect(component['getPercentValue']).toHaveBeenCalled();
    });

    it('getTooltipLabel: should return dataLabel:dataValue if tooltipLabel is undefied', () => {
      const dataValue = '30';
      const data = 30;
      const label = 'teste';
      const expectedResult = `${label}: 30%`;

      component['totalValue'] = 100;

      spyOn(component, <any>'getPercentValue').and.returnValue(dataValue);

      const result = component['getTooltipLabel'](data, label);

      expect(result).toEqual(expectedResult);
      expect(component['getPercentValue']).toHaveBeenCalled();
    });

    it('getTooltipLabel: should return dataLabel:dataValue if tooltipLabel and label are undefied ', () => {
      const dataValue = '30';
      const data = 30;
      const expectedResult = `30%`;

      component['totalValue'] = 100;

      spyOn(component, <any>'getPercentValue').and.returnValue(dataValue);

      const result = component['getTooltipLabel'](data);

      expect(result).toEqual(expectedResult);
      expect(component['getPercentValue']).toHaveBeenCalled();
    });

    it('applySeriesLabels: should apply seriesLabels', () => {
      const height = 300;
      const expectedResult = [{ xCoordinate: 28, yCoordinate: 0.29, label: '30% ', color: '#fff' }];
      const seriesList = [
        {
          coordinates:
            'M 28.8562862471896 0.2992093976784531 A 25 25 0 1,1 22.24031890402381 0.1527836519156196 L 26.655808657585712 39.908329808850624 A -15 -15 0 1,0 22.686228251686238 39.820474361392925 Z',
          label: 'teste',
          color: '#fff',
          data: 30
        }
      ];

      component['totalValue'] = 100;
      component.seriesList = seriesList;

      spyOn(component, <any>'calculateAngle');
      spyOn(component, <any>'getPercentValue').and.returnValue('30');
      spyOn(component, <any>'getTextColor').and.returnValue('#fff');
      spyOn(component, <any>'calculateLabelCoordinates').and.returnValue({ xCoordinate: 28, yCoordinate: 0.29 });

      component['applySeriesLabels'](seriesList, height);

      expect(component.seriesLabels).toEqual(expectedResult);
      expect(component['getPercentValue']).toHaveBeenCalled();
    });

    it('calculateLabelCoordinates: should return coordinates', () => {
      const startRadianAngle = 0;
      const endRadianAngle = 15;
      const height = 300;
      const expectedResult = { xCoordinate: 195.06259131855336, yCoordinate: 271.93999698071605 };

      const result = component['calculateLabelCoordinates'](height, startRadianAngle, endRadianAngle);

      expect(result).toEqual(expectedResult);
    });

    it('getPercentValue: should return pencent value', () => {
      const value = 30;
      const totalValue = 100;
      const expectedResult = '30';

      const result = component['getPercentValue'](value, totalValue);

      expect(result).toEqual(expectedResult);
    });

    it('getPercentValue: should return float pencent value', () => {
      const value = 30.4;
      const totalValue = 100;
      const expectedResult = '30,4';

      const result = component['getPercentValue'](value, totalValue);

      expect(result).toEqual(expectedResult);
    });

    it('getTextColor: should return poChartBlackColor', () => {
      const color = '#94DAE2';
      const expectedResult = '#000000';

      const result = component['getTextColor'](color);

      expect(result).toEqual(expectedResult);
    });

    it('getTextColor: should return poChartWhiteColor', () => {
      const color = '#23789F';
      const expectedResult = '#ffffff';

      const result = component['getTextColor'](color);

      expect(result).toEqual(expectedResult);
    });

    it('getInnerRadius: should return innerRadius value based on `innerRadius` value', () => {
      const radius = 200;
      component.options = { innerRadius: 50 };

      expect(component['getInnerRadius'](radius)).toBe(100);
    });

    it('getInnerRadius: should return the innerRadius default value ia `innerRadius` is undefined', () => {
      const radius = 200;

      expect(component['getInnerRadius'](radius)).toBe(160);
    });

    it('verifyDisplayLabels: should apply false to `canDisplayLabels` if `innerRadius` value exceeds the maximum allowed chart thickness', () => {
      component['verifyDisplayLabels'](200, 180);

      expect(component.canDisplayLabels).toBe(false);
    });

    it('verifyDisplayLabels: should apply trie to `canDisplayLabels` if `innerRadius` value respects the chart thickness maximun width', () => {
      component['verifyDisplayLabels'](200, 120);

      expect(component.canDisplayLabels).toBe(true);
    });
  });
});

import { SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoChartPieComponent } from './po-chart-pie.component';

describe('PoChartPieComponent', () => {
  let component: PoChartPieComponent;
  let fixture: ComponentFixture<PoChartPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoChartPieComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {
    it('ngOnChanges: should call drawSeries if changes.series', () => {
      const series = [{ label: 'teste', data: 30 }];
      const containerSize = { svgHeight: 300 };
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

      spyOn(component, <any>'drawSeries');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).toHaveBeenCalledWith(series, containerSize.svgHeight);
    });
    it('ngOnChanges: should call drawSeries if changes.containerSize', () => {
      const series = [{ label: 'teste', data: 30 }];
      const containerSize = { svgHeight: 300 };
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

      spyOn(component, <any>'drawSeries');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).toHaveBeenCalledWith(series, containerSize.svgHeight);
    });

    it('ngOnChanges: shouldn`t call drawSeries', () => {
      const series = [{ label: 'teste', data: 30 }];
      const containerSize = { svgHeight: 300 };
      const changes: SimpleChanges = {};

      component.series = series;
      component.containerSize = containerSize;

      spyOn(component, <any>'drawSeries');

      component.ngOnChanges(changes);

      expect(component['drawSeries']).not.toHaveBeenCalledWith(series, containerSize.svgHeight);
    });

    it('calculateCoordinates: should return coordinates', () => {
      const height = 50;
      const startRadianAngle = 30;
      const endRadianAngle = 80;
      const expectedResult =
        'M 28.8562862471896 0.2992093976784531 A 25 25 0 1,1 22.24031890402381 0.1527836519156196 L 25 25 Z';

      spyOn(component, <any>'drawSeries');

      const result = component['calculateCoordinates'](height, startRadianAngle, endRadianAngle);

      expect(result).toBe(expectedResult);
    });

    it('calculateCoordinates: should return coordinates considering largeArc as false', () => {
      const height = 50;
      const startRadianAngle = 0.5;
      const endRadianAngle = 1;
      const expectedResult =
        'M 46.93956404725932 36.985638465105076 A 25 25 0 0,1 38.507557646703496 46.03677462019741 L 25 25 Z';

      spyOn(component, <any>'drawSeries');

      const result = component['calculateCoordinates'](height, startRadianAngle, endRadianAngle);

      expect(result).toBe(expectedResult);
    });

    it('getTooltipLabel: should return tooltipLabel', () => {
      const data = 30;
      const label = 'teste';
      const tooltipLabel = 'teste 1';
      const expectedResult = tooltipLabel;

      const result = component['getTooltipLabel'](data, label, tooltipLabel);

      expect(result).toEqual(expectedResult);
    });

    it('getTooltipLabel: should return only `data` if `label` is undefined', () => {
      const data = 30;
      const label = undefined;
      const result = component['getTooltipLabel'](data, label);

      expect(result).toBe(data.toString());
    });

    it('getTooltipLabel: should return dataLabel:dataValue if tooltipLabel is undefied', () => {
      const data = 30;
      const label = 'teste';
      const tooltipLabel = undefined;
      const expectedResult = `${label}: ${data.toString()}`;

      const result = component['getTooltipLabel'](data, label, tooltipLabel);

      expect(result).toEqual(expectedResult);
    });
  });
});

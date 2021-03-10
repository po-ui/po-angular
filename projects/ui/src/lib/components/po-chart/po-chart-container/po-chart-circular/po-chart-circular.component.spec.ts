import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, NgZone } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PoChartCompleteCircle } from '../../helpers/po-chart-default-values.constant';

import { PoChartCircularComponent } from './po-chart-circular.component';
import { PoChartCircularLabelComponent } from './po-chart-circular-label/po-chart-circular-label.component';
import { PoChartCircularPathComponent } from './po-chart-circular-path/po-chart-circular-path.component';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartModule } from '../../po-chart.module';
import { expectPropertiesValues } from 'projects/templates/src/lib/util-test/util-expect.spec';

@Component({
  selector: 'po-chart-circular-test',
  template: ` <svg:path #svgPaths></svg:path> `
})
class PoChartPieComponent extends PoChartCircularComponent {
  constructor(ngZone: NgZone, changeDetector: ChangeDetectorRef) {
    super(ngZone, changeDetector);
  }

  getTooltipLabel() {}
  calculateCoordinates() {}
}

describe('PoChartCircularComponent', () => {
  let component: PoChartPieComponent;
  let componentPath: PoChartCircularPathComponent;
  let componentLabel: PoChartCircularLabelComponent;

  let fixture: ComponentFixture<PoChartPieComponent>;
  let fixturePath: ComponentFixture<PoChartCircularPathComponent>;
  let fixtureLabel: ComponentFixture<PoChartCircularLabelComponent>;

  const series = [
    { label: 'category A', data: 10, color: '#0C6C94' },
    { label: 'category B', data: 20, color: '#29B6C5' }
  ];

  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    axisXLabelWidth: 72,
    svgPlottingAreaHeight: 20
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [PoChartModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartPieComponent);
    fixturePath = TestBed.createComponent(PoChartCircularPathComponent);
    fixtureLabel = TestBed.createComponent(PoChartCircularLabelComponent);

    component = fixture.componentInstance;
    componentPath = fixturePath.componentInstance;
    componentLabel = fixtureLabel.componentInstance;

    component.containerSize = containerSize;
    spyOn(component, <any>'getTooltipLabel').and.returnValue('label');

    fixture.detectChanges();
    fixturePath.detectChanges();
  });

  it('should be created', () => {
    expect(component instanceof PoChartPieComponent).toBeTruthy();
    expect(component instanceof PoChartCircularComponent).toBeTruthy();
  });

  describe('Methods:', () => {
    it('onSerieClick: should emit `circularClick`', () => {
      const selectedItem = { label: 'cat', data: 200 };

      const spyCircularClick = spyOn(component.circularClick, 'emit');

      component.onSerieClick(selectedItem);

      expect(spyCircularClick).toHaveBeenCalledWith(selectedItem);
    });

    it('onSerieHover: should emit `circularHover`', () => {
      const selectedItem = { label: 'cat', data: 200 };

      const spyCircularHover = spyOn(component.circularHover, 'emit');

      component.onSerieHover(selectedItem);

      expect(spyCircularHover).toHaveBeenCalledWith(selectedItem);
    });

    it('drawSeries: should call `calculateTotalValue`, `validateSeries`, `detectChanges` and `initDrawPaths` if totalValue is greater than zero', () => {
      const spyCalculateTotalValue = spyOn(component, <any>'calculateTotalValue').and.callThrough();
      const spyValidateSeries = spyOn(component, <any>'validateSeries').and.callThrough();
      const spyChangeDetector = spyOn(component['changeDetector'], <any>'detectChanges');
      const spyInitDrawPaths = spyOn(component, <any>'initDrawPaths');

      component['drawSeries'](series, containerSize.svgHeight);

      expect(spyCalculateTotalValue).toHaveBeenCalledWith(series);
      expect(spyValidateSeries).toHaveBeenCalledWith(series);
      expect(spyChangeDetector).toHaveBeenCalled();
      expect(spyInitDrawPaths).toHaveBeenCalledWith(
        component.seriesList,
        component['totalValue'],
        containerSize.svgHeight
      );
    });

    it('calculateTotalValue: should get serie.data for sum of values', () => {
      const data = [
        { label: 'category A', data: 10 },
        { label: 'category B', data: 20 }
      ];

      expect(component['calculateTotalValue'](data)).toBe(30);
    });

    it('calculateTotalValue: should get serie.value for sum of values', () => {
      const data = [
        { label: 'category A', value: 10 },
        { label: 'category B', value: 20 }
      ];

      expect(component['calculateTotalValue'](data)).toBe(30);
    });

    it('drawSeries: shouldn`t call `validateSeries`, `detectChanges` neither `initDrawPaths` if totalValue is  zero', () => {
      const mockSeries = [{ label: 'category A', data: -10 }];

      const spyValidateSeries = spyOn(component, <any>'validateSeries');
      const spyChangeDetector = spyOn(component['changeDetector'], <any>'detectChanges');
      const spyInitDrawPaths = spyOn(component, <any>'initDrawPaths');

      component['drawSeries'](mockSeries, containerSize.svgHeight);

      expect(spyValidateSeries).not.toHaveBeenCalled();
      expect(spyChangeDetector).not.toHaveBeenCalled();
      expect(spyInitDrawPaths).not.toHaveBeenCalled();
    });

    it('drawSeries: shouldn`t call `initDrawPaths` if seriesList doesn`t have length', () => {
      const mockSeries = [{ label: 'category A', data: 10 }];

      spyOn(component, <any>'validateSeries').and.returnValue([]);
      spyOn(component['changeDetector'], <any>'detectChanges');
      const spyInitDrawPaths = spyOn(component, <any>'initDrawPaths');

      component['drawSeries'](mockSeries, containerSize.svgHeight);

      expect(spyInitDrawPaths).not.toHaveBeenCalled();
    });

    it('drawSeries: shouldn`t call `initDrawPaths` if seriesList doesn`t have length', () => {
      spyOn(component, <any>'validateSeries').and.returnValue([]);
      spyOn(component['changeDetector'], <any>'detectChanges');
      const spyInitDrawPaths = spyOn(component, <any>'initDrawPaths');

      component['drawSeries'](undefined, containerSize.svgHeight);

      expect(spyInitDrawPaths).not.toHaveBeenCalled();
    });

    it('calculateSerieCoordinates: should call `calculateAngle`, `calculateCoordinates`, `svgPaths.toArray`, `applyCoordinates`, and set value to `showLabels`:', () => {
      const serie = [{ label: 'category A', data: 30 }];
      const expectedStartAngle = -1.5707963267948966;
      const expectedEndAngle = 4.71228898038469;
      const height = 200;

      component.canDisplayLabels = true;
      component['totalValue'] = 30;

      const spyApplyCoordinates = spyOn(componentPath, 'applyCoordinates');
      const spySvgPathsToArray = spyOn(component['svgPaths'], 'toArray').and.returnValue([componentPath]);
      const spyCalculateAngle = spyOn(component, <any>'calculateAngle').and.callThrough();
      const spyCalculateCoordinates = spyOn(component, <any>'calculateCoordinates');

      component['calculateSerieCoordinates'](serie, component['totalValue'], height);

      expect(spyApplyCoordinates).toHaveBeenCalled();
      expect(spySvgPathsToArray).toHaveBeenCalled();
      expect(spyCalculateAngle).toHaveBeenCalledWith(serie[0].data, serie[0].data);
      expect(spyCalculateCoordinates).toHaveBeenCalledWith(height, expectedStartAngle, expectedEndAngle);
      expect(component.showLabels).toBeTruthy();
    });

    describe('calculateSerieCoordinatesWithAnimation', () => {
      it('should apply false to `animate` if seriesIndex and series.length are equal and shouldn`t call `requestAnimationFrame`', () => {
        const totalValue = 10;
        const height = 200;
        const data = [{ label: 'category A', data: 10 }];
        const startRadianAngle = 0;
        const endRadianAngle = 1;
        const currentRadianAngle = 0.5;
        const seriesIndex = 1;

        const spyRequestAnimationFrame = spyOn(window, 'requestAnimationFrame');

        component['calculateCoordinatesWithAnimation'](
          data,
          totalValue,
          height,
          startRadianAngle,
          endRadianAngle,
          currentRadianAngle,
          seriesIndex
        );

        expect(component['animate']).toBe(false);
        expect(spyRequestAnimationFrame).not.toHaveBeenCalled();
      });

      it('should call `setSerieLabelCoordinates`, `requestAnimationFrame`, and `calculateCurrentEndAngle` if currentRadianAngle is greater than endRadianAngle', () => {
        const totalValue = 10;
        const height = 200;
        const data = [{ label: 'category A', data: 10 }];
        const startRadianAngle = 0;
        const endRadianAngle = 1;
        const currentRadianAngle = 2;
        const seriesIndex = -1;

        const spyRequestAnimationFrame = spyOn(window, 'requestAnimationFrame');
        const spySetSerieLabelCoordinates = spyOn(component, <any>'setSerieLabelCoordinates');
        const spyCalculateAngle = spyOn(component, <any>'calculateAngle');

        component['calculateCoordinatesWithAnimation'](
          data,
          totalValue,
          height,
          startRadianAngle,
          endRadianAngle,
          currentRadianAngle,
          seriesIndex
        );

        expect(spyRequestAnimationFrame).toHaveBeenCalled();
        expect(spySetSerieLabelCoordinates).toHaveBeenCalled();
        expect(spyCalculateAngle).toHaveBeenCalled();
      });

      it('shouldn`t call `calculateAngle` if seriesIndex is greater than series.length', () => {
        const totalValue = 10;
        const height = 200;
        const data = [
          { label: 'category A', data: 10 },
          { label: 'category B', data: 20 }
        ];
        const startRadianAngle = 0;
        const endRadianAngle = 1;
        const currentRadianAngle = 2;
        const seriesIndex = 3;

        const spyCalculateAngle = spyOn(component, <any>'calculateAngle');
        const spyRequestAnimationFrame = spyOn(window, 'requestAnimationFrame');

        component['calculateCoordinatesWithAnimation'](
          data,
          totalValue,
          height,
          startRadianAngle,
          endRadianAngle,
          currentRadianAngle,
          seriesIndex
        );

        expect(spyCalculateAngle).not.toHaveBeenCalled();
        expect(spyRequestAnimationFrame).toHaveBeenCalled();
      });

      it('should call `calculateCurrentEndAngle`, `calculateCoordinates` `applyCoordinates` and `requestAnimationFrame` if currentRadianAngle is lower than endRadianAngle', () => {
        const totalValue = 10;
        const height = 200;
        const data = [
          { label: 'category A', data: 10 },
          { label: 'category B', data: 20 }
        ];
        const startRadianAngle = 0;
        const endRadianAngle = 1;

        const spyCalculateCurrentEndAngle = spyOn(component, <any>'calculateCurrentEndAngle');
        const spyCalculateCoordinates = spyOn(component, <any>'calculateCoordinates');
        const spyRequestAnimationFrame = spyOn(window, 'requestAnimationFrame');
        const spyApplyCoordinates = spyOn(componentPath, 'applyCoordinates');
        spyOn(component['svgPaths'], 'toArray').and.returnValue([componentPath, componentPath]);

        component['calculateCoordinatesWithAnimation'](data, totalValue, height, startRadianAngle, endRadianAngle);

        expect(spyCalculateCurrentEndAngle).toHaveBeenCalled();
        expect(spyCalculateCoordinates).toHaveBeenCalled();
        expect(spyApplyCoordinates).toHaveBeenCalled();
        expect(spyRequestAnimationFrame).toHaveBeenCalled();
      });
    });

    it('setSerieLabelCoordinates: should call `applyCoordinates` if `svgLabels` has length', () => {
      const index = 0;
      spyOn(component['svgLabels'], 'toArray').and.returnValue([componentLabel]);
      const spyApplyCoordinates = spyOn(componentLabel, 'applyCoordinates');

      component['setSerieLabelCoordinates'](index);

      expect(spyApplyCoordinates).toHaveBeenCalled();
    });

    it('setSerieLabelCoordinates: shouldn`t call `applyCoordinates` if `svgLabels` does not have length', () => {
      const index = 0;
      spyOn(component['svgLabels'], 'toArray').and.returnValue([]);
      const spyApplyCoordinates = spyOn(componentLabel, 'applyCoordinates');

      component['setSerieLabelCoordinates'](index);

      expect(spyApplyCoordinates).not.toHaveBeenCalled();
    });

    it('initDrawPaths: should call `calculateSerieCoordinates` if animate is false', () => {
      component['animate'] = false;

      const spyCalculateSerieCoordinates = spyOn(component, <any>'calculateSerieCoordinates');
      const spyCalculateCoordinatesWithAnimation = spyOn(component, <any>'calculateCoordinatesWithAnimation');

      component['initDrawPaths'](series, component['totalValue'], containerSize.svgHeight);

      expect(spyCalculateSerieCoordinates).toHaveBeenCalled();
      expect(spyCalculateCoordinatesWithAnimation).not.toHaveBeenCalled();
    });

    it('initDrawPaths: should call `calculateCoordinatesWithAnimation` if animate is true', () => {
      component['animate'] = true;

      const spyCalculateSerieCoordinates = spyOn(component, <any>'calculateSerieCoordinates');
      const spyCalculateCoordinatesWithAnimation = spyOn(component, <any>'calculateCoordinatesWithAnimation');

      component['initDrawPaths'](series, component['totalValue'], containerSize.svgHeight);

      expect(spyCalculateSerieCoordinates).not.toHaveBeenCalled();
      expect(spyCalculateCoordinatesWithAnimation).toHaveBeenCalled();
    });

    it('validateSeries: should call `getTooltipLabel` and return an array with valid series', () => {
      const result = [
        { data: 10, color: '#0C6C94', label: 'category A', tooltipLabel: 'label' },
        { data: 20, color: '#29B6C5', label: 'category B', tooltipLabel: 'label' }
      ];

      const expectedResult = component['validateSeries'](series);

      expect(component['getTooltipLabel']).toHaveBeenCalled();
      expect(expectedResult).toEqual(result);
    });

    it('validateSeries: shouldn`t call `getTooltipLabel` if data is lower than 0', () => {
      const seriesList = [{ label: 'category', value: -10 }];

      const expectedResult = component['validateSeries'](seriesList);

      expect(component['getTooltipLabel']).not.toHaveBeenCalled();
      expect(expectedResult).toEqual([]);
    });

    it('calculateCurrentEndAngle: should return value of end angle if the series drawing is completed', () => {
      const angleCurrentPosition = 22;

      const chartItemStartAngle = 10;
      const chartItemEndAngle = 20;
      const endAngleValue = chartItemStartAngle + chartItemEndAngle - PoChartCompleteCircle;

      const result = component['calculateCurrentEndAngle'](
        angleCurrentPosition,
        chartItemStartAngle,
        chartItemEndAngle
      );

      expect(result).toBe(endAngleValue);
    });

    it('calculateCurrentEndAngle: should return value of next angle if the series drawing is not completed', () => {
      const angleCurrentPosition = 15;

      const chartItemStartAngle = 10;
      const chartItemEndAngle = 20;
      const endAngleValue = chartItemStartAngle + angleCurrentPosition;

      const result = component['calculateCurrentEndAngle'](
        angleCurrentPosition,
        chartItemStartAngle,
        chartItemEndAngle
      );

      expect(result).toBe(endAngleValue);
    });
  });

  describe('Properties:', () => {
    it('p-series: should apply value to `animate`', () => {
      component.series = series;

      expect(component['animate']).toBe(true);
    });

    it('p-options: should update property with valid values', () => {
      const validValue = [{ innerRadius: 30 }];

      expectPropertiesValues(component, 'options', validValue, validValue);
      expect(component['innerRadius']).toBe(30);
    });

    it('p-options: shouldn`t update property if receives invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, ['1'], [{ key: 'value' }]];

      expectPropertiesValues(component, 'options', invalidValues, undefined);
      expect(component['innerRadius']).toBeUndefined();
    });
  });
});

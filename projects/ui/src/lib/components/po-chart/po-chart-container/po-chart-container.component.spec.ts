import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoChartModule } from '../po-chart.module';

import { PoChartContainerComponent } from './po-chart-container.component';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';
import { PoChartType } from '../enums/po-chart-type.enum';

describe('PoChartContainerComponent', () => {
  let component: PoChartContainerComponent;
  let fixture: ComponentFixture<PoChartContainerComponent>;
  let nativeElement;

  const series = [{ label: 'category', data: [1, 2, 3], color: 'red' }];
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
        declarations: [PoChartContainerComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartContainerComponent);
    component = fixture.componentInstance;
    component.series = series;
    component.containerSize = containerSize;

    fixture.detectChanges();

    nativeElement = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods', () => {
    it('ngOnChanges: should call `setViewBox` if type has new value and apply value to `viewBox`', () => {
      const changes = { type: { firstChange: true } };

      const spySetViewBox = spyOn(component, <any>'setViewBox').and.callThrough();
      const spySetSvgSpace = spyOn(component, <any>'setSvgSpace').and.callThrough();
      component.type = PoChartType.Donut;

      component.ngOnChanges(<any>changes);

      const expectedResult = `1 -1 ${containerSize.svgWidth} ${containerSize.svgHeight}`;

      expect(spySetViewBox).toHaveBeenCalled();
      expect(spySetSvgSpace).toHaveBeenCalled();
      expect(component.viewBox).toEqual(expectedResult);
    });

    it('ngOnChanges: should call `setViewBox` if containerSize has new value and apply value to `viewBox`', () => {
      const changes = { containerSize: { firstChange: true } };

      const expectedResult = `1 -1 ${containerSize.svgWidth} ${containerSize.svgHeight}`;

      const spySetViewBox = spyOn(component, <any>'setViewBox').and.callThrough();

      component.ngOnChanges(<any>changes);

      expect(spySetViewBox).toHaveBeenCalled();
      expect(component.viewBox).toEqual(expectedResult);
    });

    it('ngOnChanges: shouldn`t call `setViewBox` and `setSvgSpace^', () => {
      const changes = { type: undefined, containerSize: undefined };

      const spySetViewBox = spyOn(component, <any>'setViewBox');
      const spySetSvgSpace = spyOn(component, <any>'setSvgSpace');

      component.ngOnChanges(<any>changes);

      expect(spySetViewBox).not.toHaveBeenCalled();
      expect(spySetSvgSpace).not.toHaveBeenCalled();
    });

    it('onSerieClick: should emit `serieClick`', () => {
      const spySerieClick = spyOn(component.serieClick, 'emit');

      component.onSerieClick('event');

      expect(spySerieClick).toHaveBeenCalledWith('event');
    });

    it('onSerieHover: should emit `serieHover`', () => {
      const spySerieHover = spyOn(component.serieHover, 'emit');

      component.onSerieHover('event');

      expect(spySerieHover).toHaveBeenCalledWith('event');
    });

    describe('getRange:', () => {
      it('should return the lowest value to `minValue`', () => {
        const chartSeries = [
          { data: [-70, 2, 3], label: 'Vancouver', type: PoChartType.Line },
          { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Column }
        ];
        const expectedResult = { minValue: -70, maxValue: 4 };

        expect(component['getRange'](chartSeries)).toEqual(expectedResult);
      });

      it('should return `minValue` and `maxValue` according with `options` values', () => {
        const chartSeries = [
          { data: [10, 2, 3], label: 'Vancouver', type: PoChartType.Line },
          { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Column }
        ];
        const options = { axis: { minRange: 0, maxRange: 100 } };
        const expectedResult = { minValue: 0, maxValue: 100 };

        expect(component['getRange'](chartSeries, options)).toEqual(expectedResult);
      });

      it('should return `minValue` of series instead of `options` if it is lower', () => {
        const chartSeries = [
          { data: [-10, 2, 3], label: 'Vancouver', type: PoChartType.Line },
          { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Line }
        ];
        const options = { axis: { minRange: 0, maxRange: 100 } };
        const expectedResult = { minValue: -10, maxValue: 100 };

        expect(component['getRange'](chartSeries, options)).toEqual(expectedResult);
      });

      it('should return `maxValue` of series instead of `options` if it is greater', () => {
        const chartSeries = [
          { data: [10, 2, 300], label: 'Vancouver', type: PoChartType.Line },
          { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Line }
        ];
        const options = { axis: { minRange: 0, maxRange: 100 } };
        const expectedResult = { minValue: 0, maxValue: 300 };

        expect(component['getRange'](chartSeries, options)).toEqual(expectedResult);
      });

      it('should apply `minValue` value from options.axis.minRange if it is lower than data series minValue', () => {
        const chartSeries = [
          { data: [-10, 2, 300], label: 'Vancouver', type: PoChartType.Line },
          { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Line }
        ];
        const options = { axis: { minRange: -30, maxRange: 100 } };
        const expectedResult = { minValue: -30, maxValue: 300 };

        expect(component['getRange'](chartSeries, options)).toEqual(expectedResult);
      });
    });

    it('setRange: should call `getRange` if `isTypeCircular` is true', () => {
      const serie = [{ data: [1, 2, 3], label: 'Vancouver' }];
      const options = {};
      component.type = PoChartType.Bar;

      const spyGetRange = spyOn(component, <any>'getRange');

      component['setRange'](serie, options);

      expect(spyGetRange).toHaveBeenCalled();
    });

    it('setRange: shouldn`t call `getRange` if `isTypeCircular` is true', () => {
      const serie = [{ data: 1, label: 'Vancouver' }];
      component.type = PoChartType.Donut;

      const spyGetRange = spyOn(component, <any>'getRange');

      component['setRange'](serie);

      expect(spyGetRange).not.toHaveBeenCalled();
    });

    it('setRange: shouldn`t call `getRange` if `isTypeCircular` is false', () => {
      const serie = [{ data: 1, label: 'Vancouver' }];
      component.type = PoChartType.Pie;

      const spyGetRange = spyOn(component, <any>'getRange');

      component['setRange'](serie);

      expect(spyGetRange).not.toHaveBeenCalled();
    });

    it('verifyAxisOptions: shouldn`t call `getRange` if `isTypeCircular` is false', () => {
      component.series = [
        { data: [10, 2, 300], label: 'Vancouver', type: PoChartType.Line },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Bar }
      ];
      const spyGetRange = spyOn(component, <any>'getRange');

      component['verifyAxisOptions']({});

      expect(spyGetRange).not.toHaveBeenCalled();
    });

    it('verifyAxisOptions: shouldn`t call `getRange` if `isTypeCircular` is true but options does not have `axis` property', () => {
      component.series = [
        { data: 10, label: 'Vancouver', type: PoChartType.Donut },
        { data: 20, label: 'Toronto', type: PoChartType.Donut }
      ];
      const spyGetRange = spyOn(component, <any>'getRange');

      component['verifyAxisOptions']({});

      expect(spyGetRange).not.toHaveBeenCalled();
    });

    it('setSeriesByType: should set value to `seriesByType`', () => {
      const chartSeries = [
        { data: 1, type: PoChartType.Pie },
        { data: 1, type: PoChartType.Donut },
        { data: [1, 2], type: PoChartType.Line },
        { data: [1, 2], type: PoChartType.Column },
        { data: [1, 2], type: PoChartType.Bar }
      ];

      const expectedResult = {
        [PoChartType.Column]: chartSeries.filter(serie => serie.type === PoChartType.Column),
        [PoChartType.Bar]: chartSeries.filter(serie => serie.type === PoChartType.Bar),
        [PoChartType.Line]: chartSeries.filter(serie => serie.type === PoChartType.Line),
        [PoChartType.Donut]: chartSeries.filter(serie => serie.type === PoChartType.Donut),
        [PoChartType.Pie]: chartSeries.filter(serie => serie.type === PoChartType.Pie),
        [PoChartType.Area]: chartSeries.filter(serie => serie.type === PoChartType.Area)
      };

      component['setSeriesByType'](chartSeries);

      expect(component.seriesByType).toEqual(expectedResult);
    });

    it('getCategoriesCoordinates: should apply param value to `categoriesCoordinates`', () => {
      const value = [0, 1, 2, 3, 4];
      component.getCategoriesCoordinates(value);

      expect(component.categoriesCoordinates).toEqual(value);
    });

    it('setSvgSpace: should set svgSpace with { svgPoint, svgDomMatrix }', () => {
      const inverseMatrix = { a: 1, b: 2, c: 3 };

      const svgPointMock = { x: 0, y: 0 };
      const screenCTMMock = { inverse: () => inverseMatrix };

      component.svgSpace = undefined;

      spyOn(component.svgELement.nativeElement, 'createSVGPoint').and.returnValue(svgPointMock);
      spyOn(component.svgELement.nativeElement, 'getScreenCTM').and.returnValue(screenCTMMock);

      component['setSvgSpace']();

      expect(component.svgSpace).toEqual({ svgPoint: svgPointMock, svgDomMatrix: inverseMatrix });
    });

    it('setSvgSpace: should not throw error if getScreenCTM return null', () => {
      const svgPointMock = { x: 0, y: 0 };
      const screenCTMMock = null;

      component.svgSpace = undefined;

      spyOn(component.svgELement.nativeElement, 'createSVGPoint').and.returnValue(svgPointMock);
      spyOn(component.svgELement.nativeElement, 'getScreenCTM').and.returnValue(null);

      const fnError = () => component['setSvgSpace']();

      expect(fnError).not.toThrow();
    });
  });

  describe('Properties: ', () => {
    it('p-series: should call `setSeriesByType` and `setRange`', () => {
      const spysetSeriesByType = spyOn(component, <any>['setSeriesByType']).and.callThrough();
      const spySetRange = spyOn(component, <any>['setRange']);

      component.series = [
        { data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Line, color: '#0C6C94' },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Column, color: '#29B6C5' }
      ];

      const seriesWithColor = [
        { data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Line, color: '#0C6C94' },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Column, color: '#29B6C5' }
      ];

      expect(spysetSeriesByType).toHaveBeenCalledWith(seriesWithColor);
      expect(spySetRange).toHaveBeenCalledWith(seriesWithColor, component.options);
    });

    it('p-options: should update property with valid values', () => {
      const validValue = [{}, { axis: { minRange: 0 } }];

      expectPropertiesValues(component, 'options', validValue, validValue);
    });

    it('p-options: shouldn`t update property if receives invalid values', () => {
      const invalidValues = [undefined, null, '', false, 0, ['1'], [{ key: 'value' }]];

      expectPropertiesValues(component, 'options', invalidValues, undefined);
    });

    it('p-options: should apply value to `axisOptions` if options has `axis` property', () => {
      component.options = { axis: { minRange: 10 } };

      expect(component.axisOptions).toEqual({ minRange: 10 });
    });

    it('p-options: shouldn`t apply value to `axisOptions` if options doesn`t have `axis` property', () => {
      component.options = {};

      expect(component.axisOptions).toBeUndefined();
    });
  });

  describe('Template:', () => {
    it('should have `po-chart-bar-path` if type is `Column`', () => {
      component.type = PoChartType.Column;
      component.series = [{ data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Column }];

      fixture.detectChanges();

      const chartBarElement = nativeElement.querySelector('.po-chart-bar-path');

      expect(chartBarElement).toBeTruthy();
    });

    it('should have `po-chart-line-path` if type is `Line`', () => {
      component.type = PoChartType.Line;

      component.series = [{ data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Line, color: 'blue' }];

      fixture.detectChanges();

      const chartLineElement = nativeElement.querySelector('.po-chart-line-path');

      expect(chartLineElement).toBeTruthy();
    });

    it('shouldn`t contain any `chartType.Bar` element if type is `Line`', () => {
      component.type = PoChartType.Line;

      component.series = [
        { data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Line, color: 'red' },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Line, color: 'blue' },
        { data: [1, 2, 3], label: 'Montreal', type: PoChartType.Bar, color: 'pink' }
      ];

      fixture.detectChanges();

      const chartLineElementList = nativeElement.querySelectorAll('.po-chart-line-path');
      const chartBarElementList = nativeElement.querySelectorAll('.po-chart-bar-path');

      expect(chartLineElementList[0]).toBeTruthy();
      expect(chartLineElementList.length).toBe(2);
      expect(chartBarElementList[0]).toBeUndefined();
      expect(chartBarElementList.length).toBe(0);
    });

    it('shouldn`t contain any `chartType.Line` element if type is `Bar`', () => {
      component.type = PoChartType.Bar;

      component.series = [
        { data: [1, 2, 3], label: 'Montreal', type: PoChartType.Bar },
        { data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Line },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Line }
      ];

      fixture.detectChanges();

      const chartLineElementList = nativeElement.querySelectorAll('.po-chart-line-path');
      const chartBarElementList = nativeElement.querySelectorAll('.po-chart-bar-path');

      expect(chartLineElementList[0]).toBeFalsy();
      expect(chartBarElementList[0]).toBeTruthy();
      expect(chartBarElementList.length).toBe(3);
    });

    it('should contain six `chartType.Bar` elements referring to `ChartType.column` if type is `Line` and ignore the last one item', () => {
      component.type = PoChartType.Line;

      component.series = [
        { data: [1, 2, 3], label: 'Vancouver', type: PoChartType.Line, color: 'red' },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Column, color: 'green' },
        { data: [4, 2, 2], label: 'Toronto', type: PoChartType.Column, color: 'yellow' },
        { data: [1, 2, 3], label: 'Montreal', type: PoChartType.Bar, color: 'pink' }
      ];

      fixture.detectChanges();

      const chartLineElementList = nativeElement.querySelectorAll('.po-chart-line-path');
      const chartBarElementList = nativeElement.querySelectorAll('.po-chart-bar-path');

      expect(chartLineElementList[0]).toBeTruthy();
      expect(chartLineElementList.length).toBe(1);
      expect(chartBarElementList[0]).toBeTruthy();
      expect(chartBarElementList.length).toBe(6);
    });
  });
});

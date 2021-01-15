import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoChartModule } from '../po-chart.module';

import { PoChartContainerComponent } from './po-chart-container.component';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';
import { PoChartType } from '../enums/po-chart-type.enum';
import { SimpleChange } from '@angular/core';

describe('PoChartContainerComponent', () => {
  let component: PoChartContainerComponent;
  let fixture: ComponentFixture<PoChartContainerComponent>;
  let nativeElement;

  const series = [{ label: 'category', data: [1, 2, 3] }];
  const containerSize: PoChartContainerSize = {
    svgWidth: 200,
    svgHeight: 200,
    svgPlottingAreaWidth: 20,
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
      component.type = PoChartType.Donut;

      component.ngOnChanges(<any>changes);

      const expectedResult = `1 -1 ${containerSize.svgWidth} ${containerSize.svgHeight}`;

      expect(spySetViewBox).toHaveBeenCalled();
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

    it('ngOnChanges: shouldn`t call `setViewBox`', () => {
      const changes = { type: undefined, containerSize: undefined };

      const spySetViewBox = spyOn(component, <any>'setViewBox');

      component.ngOnChanges(<any>changes);

      expect(spySetViewBox).not.toHaveBeenCalled();
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
  });

  describe('Properties: ', () => {
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
    it('should have po-chart-bar-path tag if type is `Line`', () => {
      component.type = PoChartType.Column;

      fixture.detectChanges();

      const chartContainerContent = nativeElement.querySelector('.po-chart-bar-path');

      expect(chartContainerContent).toBeTruthy();
    });

    it('should have po-chart-line-path tag if type is `Line`', () => {
      component.type = PoChartType.Line;

      fixture.detectChanges();

      const chartContainerContent = nativeElement.querySelector('.po-chart-line-path');

      expect(chartContainerContent).toBeTruthy();
    });
  });
});

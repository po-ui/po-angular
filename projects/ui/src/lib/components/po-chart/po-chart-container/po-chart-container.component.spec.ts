import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { expectPropertiesValues } from './../../../util-test/util-expect.spec';

import { PoChartModule } from '../po-chart.module';

import { PoChartContainerComponent } from './po-chart-container.component';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';

describe('PoChartContainerComponent', () => {
  let component: PoChartContainerComponent;
  let fixture: ComponentFixture<PoChartContainerComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods', () => {
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
    it('p-container-size: should call `setViewBox` and apply value to `viewBox`', () => {
      const expectedResult = `1 -1 ${containerSize.svgWidth} ${containerSize.svgHeight}`;

      const spySetViewBox = spyOn(component, <any>'setViewBox').and.callThrough();

      component.containerSize = containerSize;

      expect(spySetViewBox).toHaveBeenCalled();
      expect(component.viewBox).toEqual(expectedResult);
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
});

import { Directive } from '@angular/core';

import { PoChartDynamicTypeComponent } from './po-chart-dynamic-type.component';
import { PoChartType } from '../enums/po-chart-type.enum';

@Directive()
class PoChartDynamicTypeComponentMock extends PoChartDynamicTypeComponent {}

describe('PoChartDynamicTypeComponent:', () => {
  let component: PoChartDynamicTypeComponent;

  beforeEach(() => {
    component = new PoChartDynamicTypeComponentMock();
  });

  describe('Properties:', () => {
    it('isChartGaugeType: should return `true` if type is equal `PoChartType.Gauge`', () => {
      component.type = PoChartType.Gauge;

      expect(component.isChartGaugeType).toBeTruthy();
    });

    it('isChartGaugeType: should return `false` if type is diferent from `PoChartType.Gauge`', () => {
      component.type = PoChartType.Pie;

      expect(component.isChartGaugeType).toBeFalsy();
    });
  });

  describe('Methods:', () => {
    describe('calculateSVGContainerDimensions:', () => {
      it(`should set 'svgHeight' and 'centerX'`, () => {
        component.height = 200;
        const padding = 24;
        const chartWrapperElement = 20;
        const chartHeaderElement = 30;
        const chartLegendElement = 10;
        const svgHeightResult = component.height - chartHeaderElement - chartLegendElement - padding * 2;
        const centerXResult = chartWrapperElement / 2;

        component['calculateSVGContainerDimensions'](chartWrapperElement, chartHeaderElement, chartLegendElement);

        expect(component.svgHeight).toBe(svgHeightResult);
        expect(component.centerX).toBe(centerXResult);
      });

      it(`should set 'svgHeight' with 292 if 'height' is 400,
        'chartHeaderElement' is 20 and 'chartLegendElement' is 40`, () => {
        component.height = 400;
        const chartWrapperElement = 20;
        const chartHeaderElement = 20;
        const chartLegendElement = 40;
        const svgHeightResult = 292;

        component['calculateSVGContainerDimensions'](chartWrapperElement, chartHeaderElement, chartLegendElement);

        expect(component.svgHeight).toBe(svgHeightResult);
      });

      it(`should set 'svgHeight' with 0 if 'height' is 0,
        'chartHeaderElement' is 20 and 'chartLegendElement' is 40`, () => {
        component.height = 0;
        const chartWrapperElement = 20;
        const chartHeaderElement = 20;
        const chartLegendElement = 40;
        const svgHeightResult = 0;

        component['calculateSVGContainerDimensions'](chartWrapperElement, chartHeaderElement, chartLegendElement);

        expect(component.svgHeight).toBe(svgHeightResult);
      });
    });

    describe('calculateTotalValue:', () => {
      it('should return sum of data series', () => {
        component['series'] = [{ data: 1 }, { data: 4 }, { data: 7 }];

        const totalSum = 12;

        component['calculateTotalValue']();

        expect(component['totalValue']).toBe(totalSum);
      });

      it('should return sum of data series and value series', () => {
        component['series'] = [{ data: 2, value: 1 }, { data: 4 }, { value: 7 }];

        const totalSum = 13;

        component['calculateTotalValue']();

        expect(component['totalValue']).toBe(totalSum);
      });

      it('should return sum of value series', () => {
        component['series'] = [{ value: 1 }, { value: 4 }, { value: 7 }];

        const totalSum = 12;

        component['calculateTotalValue']();

        expect(component['totalValue']).toBe(totalSum);
      });

      it('should be 100 if PoChartType is Gauge', () => {
        component['series'] = [{ value: 1 }, { value: 4 }, { value: 7 }];
        component.type = PoChartType.Gauge;

        const totalSum = 100;

        component['calculateTotalValue']();

        expect(component['totalValue']).toBe(totalSum);
      });
    });
  });
});

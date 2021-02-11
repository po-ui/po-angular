import { TestBed } from '@angular/core/testing';

import { PoChartSvgContainerService } from './po-chart-svg-container.service';

describe('PoChartSvgContainerService', () => {
  let service: PoChartSvgContainerService;
  let chartHeight;
  let chartWrapperWidth;
  let chartHeaderHeight;
  let chartLegendHeight;
  let categoriesLength;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoChartSvgContainerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    beforeEach(() => {
      chartHeight = 400;
      chartWrapperWidth = 200;
      chartHeaderHeight = 50;
      chartLegendHeight = 50;
      categoriesLength = 2;
    });

    describe('calculateSVGContainerMeasurements: ', () => {
      it('should call `svgWidth`, `center`, `svgHeight`, svgPlottingAreaHeight`', () => {
        const spySvgWidth = spyOn(service, <any>'svgWidth');
        const spyCenter = spyOn(service, <any>'center');
        const spySvgHeiht = spyOn(service, <any>'svgHeight');
        const spySvgPlottingAreaHeight = spyOn(service, <any>'svgPlottingAreaHeight');

        service.calculateSVGContainerMeasurements(chartHeight, chartWrapperWidth, chartHeaderHeight, chartLegendHeight);

        expect(spySvgWidth).toHaveBeenCalledWith(chartWrapperWidth);
        expect(spyCenter).toHaveBeenCalledTimes(2);
        expect(spySvgHeiht).toHaveBeenCalledWith(chartHeight, chartHeaderHeight, chartLegendHeight);
        expect(spySvgPlottingAreaHeight).toHaveBeenCalled();
      });

      it('should get default param values', () => {
        const spySvgWidth = spyOn(service, <any>'svgWidth');
        const spyCenter = spyOn(service, <any>'center');
        const spySvgHeiht = spyOn(service, <any>'svgHeight');
        const spySvgPlottingAreaHeight = spyOn(service, <any>'svgPlottingAreaHeight');

        service.calculateSVGContainerMeasurements();

        expect(spySvgWidth).toHaveBeenCalled();
        expect(spyCenter).toHaveBeenCalledTimes(2);
        expect(spySvgHeiht).toHaveBeenCalled();
        expect(spySvgPlottingAreaHeight).toHaveBeenCalled();
      });
    });

    it('svgWidth: should calculate and return `svgWidth` value', () => {
      expect(service['svgWidth'](chartWrapperWidth)).toBe(152);
    });

    it('svgWidth: should return zero if `wrapperWidth` is not greater than zero', () => {
      chartWrapperWidth = 20;
      expect(service['svgWidth'](chartWrapperWidth)).toBe(0);
    });

    it('center: should calculate and return `centerX` value', () => {
      expect(service['center'](chartWrapperWidth)).toBe(100);
    });

    it('svgHeight: should return the result of the calculation', () => {
      expect(service['svgHeight'](chartHeight, chartHeaderHeight, chartLegendHeight)).toBe(252);
    });

    it('svgHeight: should return `0` the result of the calculation is lower than 0', () => {
      chartHeight = 50;

      expect(service['svgHeight'](chartHeight, chartHeaderHeight, chartLegendHeight)).toBe(0);
    });

    it('svgPlottingAreaHeight: should return the result of the calculation', () => {
      const svgHeight = 200;

      expect(service['svgPlottingAreaHeight'](svgHeight)).toBe(168);
    });
  });
});

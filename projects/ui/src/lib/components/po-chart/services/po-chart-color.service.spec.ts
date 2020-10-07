import { TestBed } from '@angular/core/testing';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoChartColors } from '../helpers/po-chart-colors.constant';
import { PoChartColorService } from './po-chart-color.service';

describe('PoChartColorService', () => {
  let service: PoChartColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoChartColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Methods:', () => {
    it('getSeriesColor: should return all colors if `series` is undefined', () => {
      const poChartColorsAll = PoChartColors.length - 1;
      const series = undefined;
      const type = PoChartType.Pie;

      expect(service['getSeriesColor'](series, type)).toEqual(PoChartColors[poChartColorsAll]);
    });

    it('getSeriesColor: should return first color if type is `gauge`', () => {
      const series = Array(14);
      const type = PoChartType.Gauge;

      expect(service['getSeriesColor'](series, type)).toEqual(PoChartColors[0]);
    });

    it('getSeriesColor: should return four colors if `series` legth is four', () => {
      const series = Array(4);
      const type = PoChartType.Pie;

      expect(service['getSeriesColor'](series, type)).toEqual(PoChartColors[3]);
    });

    it('getSeriesColor: should return all colors if `series` legth is 11', () => {
      const poChartColorsAll = PoChartColors.length - 1;
      const series = Array(12);
      const type = PoChartType.Pie;

      expect(service['getSeriesColor'](series, type)).toEqual(PoChartColors[poChartColorsAll]);
    });

    it('getSeriesColor: should return duplicate colors if `series` legth is greater 12', () => {
      const series = Array(14);
      const type = PoChartType.Pie;

      expect(service['getSeriesColor'](series, type).length).toEqual(24);
    });
  });
});

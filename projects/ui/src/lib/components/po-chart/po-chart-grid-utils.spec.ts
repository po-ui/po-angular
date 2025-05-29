import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoChartOptions } from '../po-chart/interfaces/po-chart-options.interface';
import { PoChartGridUtils } from './po-chart-grid-utils';

describe('PoChartGridUtils', () => {
  let utils: PoChartGridUtils;
  let mockCtx: any;

  beforeEach(() => {
    mockCtx = {
      boundaryGap: false,
      isTypeBar: false,
      categories: ['A', 'B'],
      options: {
        axis: { rotateLegend: 45, showXAxis: true, showYAxis: true },
        fillPoints: true
      },
      resolvePx: jasmine.createSpy('resolvePx').and.returnValue(10),
      getCSSVariable: jasmine.createSpy('getCSSVariable').and.callFake((key: string) => {
        const vars = {
          '--color-neutral-light-00': '#fff',
          '--color-grid': '#ccc',
          '--font-family-grid': 'Arial',
          '--font-weight-grid': '400'
        };
        return vars[key] ?? '';
      })
    };

    utils = new PoChartGridUtils(mockCtx);
  });

  describe('setSerieTypeLine', () => {
    it('should set properties when type is line', () => {
      const serie: any = { type: 'line' };
      const color = '#00f';

      utils.setSerieTypeLine(serie, 2, color);

      expect(serie.symbolSize).toBe(8);
      expect(serie.symbol).toBe('circle');
      expect(serie.itemStyle.color).toBe('#00f');
      expect(serie.itemStyle.borderColor).toBe('#00f');
      expect(serie.itemStyle.borderWidth).toBe(2);
      expect(serie.lineStyle.color).toBe('#00f');
      expect(serie.lineStyle.width).toBe(2);
    });
  });

  describe('setSerieTypeArea', () => {
    it('should set areaStyle and opacity', () => {
      const serie: any = {
        isTypeArea: true,
        color: 'color-01',
        overlayColor: 'rgba(255,255,255,0.5)'
      };

      utils.setSerieTypeArea(serie, 8);

      expect(serie.areaStyle.opacity).toBe(0.5);
    });
  });

  describe('setSerieTypeBarColumn', () => {
    it('should set itemStyle and emphasis when type is bar', () => {
      const serie: any = { type: 'bar' };
      const color = '#f00';

      utils.setSerieTypeBarColumn(serie, color);

      expect(serie.itemStyle.color).toBe(color);
      expect(serie.emphasis.focus).toBe('series');
      expect(mockCtx.boundaryGap).toBe(true);
    });
  });

  describe('setOptionsAxis', () => {
    it('should define xAxis and yAxis correctly', () => {
      const option: any = {};

      utils.setOptionsAxis(option);

      expect(option.xAxis).toBeDefined();
      expect(option.yAxis).toBeDefined();
      expect(option.xAxis['axisLabel'].rotate).toBe(45);
      expect(option.xAxis['axisLabel'].overflow).toBe('break');
    });
  });

  describe('setListPie', () => {
    const labelProperties = {
      show: false,
      position: 'center',
      formatter: undefined,
      fontFamily: '',
      fontSize: undefined,
      color: '',
      fontWeight: 0
    };

    it('should set pie config with radius 95% and center 50% 50% when legend is false', () => {
      utils['component'].options = { legend: false } as any;

      utils.setListTypeDonutPie(PoChartType.Pie);

      expect(utils['component'].listTypePieDonut).toEqual([
        {
          type: 'pie',
          center: ['50%', '50%'],
          radius: '95%',
          roseType: undefined,
          emphasis: { focus: 'self' },
          data: [],
          label: labelProperties,
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
    });

    it('should set pie config with center 50% 54% when legendVerticalPosition is top', () => {
      utils['component'].options = { legend: true, legendVerticalPosition: 'top' } as any;

      utils.setListTypeDonutPie(PoChartType.Pie);

      expect(utils['component'].listTypePieDonut).toEqual([
        {
          type: 'pie',
          center: ['50%', '54%'],
          radius: '80%',
          roseType: undefined,
          emphasis: { focus: 'self' },
          data: [],
          label: labelProperties,
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
    });

    it('should set pie config with center 50% 46% when legendVerticalPosition is not top', () => {
      utils['component'].options = { legend: true, legendVerticalPosition: 'bottom' } as any;

      utils.setListTypeDonutPie(PoChartType.Pie);

      expect(utils['component'].listTypePieDonut).toEqual([
        {
          type: 'pie',
          center: ['50%', '46%'],
          radius: '80%',
          roseType: undefined,
          emphasis: { focus: 'self' },
          data: [],
          label: labelProperties,
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
    });
  });

  describe('setListDonut', () => {
    const labelProperties = {
      show: true,
      position: 'center',
      formatter: 'test',
      fontFamily: '',
      fontSize: undefined,
      color: '',
      fontWeight: 0
    };

    it('should set donut config if innerRadius is 100 and roseType is true', () => {
      utils['component'].options = {
        innerRadius: 100,
        textCenterGraph: 'test',
        roseType: true
      } as PoChartOptions;

      utils['component'].series = [
        { label: 'Serie 1', data: 10 },
        { label: 'Serie 2', data: 30 }
      ];

      utils.setListTypeDonutPie(PoChartType.Donut);

      expect(utils['component'].listTypePieDonut).toEqual([
        {
          type: 'pie',
          center: ['50%', '46%'],
          radius: ['55%', '80%'],
          roseType: 'area',
          emphasis: { focus: 'self' },
          data: [],
          label: {
            show: true,
            position: 'center',
            formatter: 'test',
            fontFamily: '',
            fontSize: undefined,
            color: '',
            fontWeight: 0
          },
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
    });

    it('should set donut config if innerRadius is 80', () => {
      utils['component'].options = { innerRadius: 80, textCenterGraph: 'test' } as PoChartOptions;
      utils['component'].series = [
        { label: 'Serie 1', data: 10 },
        { label: 'Serie 2', data: 30 }
      ];

      utils.setListTypeDonutPie(PoChartType.Donut);

      expect(utils['component'].listTypePieDonut).toEqual([
        {
          type: 'pie',
          center: ['50%', '46%'],
          radius: ['44%', '80%'],
          roseType: undefined,
          emphasis: { focus: 'self' },
          data: [],
          label: labelProperties,
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
    });
  });
});

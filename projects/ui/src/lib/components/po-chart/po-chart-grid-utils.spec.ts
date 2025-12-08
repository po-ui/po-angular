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

    it('should set areaStyle.color using computedStyle when serie.color is var(...)', () => {
      const spyGetComputed = spyOn(globalThis, 'getComputedStyle').and.returnValue({
        getPropertyValue: () => '#445566'
      } as unknown as CSSStyleDeclaration);

      const serie: any = {
        isTypeArea: true,
        color: 'var(--color-test)',
        overlayColor: 'rgba(255,255,255,0.5)'
      };

      utils.setSerieTypeArea(serie, 1);

      expect(spyGetComputed).toHaveBeenCalledWith(document.documentElement);
      expect(serie.areaStyle.color).toBe('#445566');
    });
  });

  describe('setSerieTypeBarColumn', () => {
    it('should set itemStyle and emphasis when type is bar', () => {
      const serie: any = { type: 'bar', data: [200] };
      const color = '#f00';
      utils['component'].options.stacked = true;

      utils.setSerieTypeBarColumn(serie, color);

      expect(serie.itemStyle.color).toBe(color);
      expect(serie.emphasis.focus).toBe('series');
      expect(serie.stack).toBe('total');
      expect(mockCtx.boundaryGap).toBe(true);
    });

    it('should set itemStyle and emphasis when type is bar', () => {
      const serie: any = { type: 'bar', stackGroupName: 'group1', data: [200] };
      const color = '#f00';

      utils.setSerieTypeBarColumn(serie, color);

      expect(serie.itemStyle.color).toBe(color);
      expect(serie.emphasis.focus).toBe('series');
      expect(serie.stack).toBe('group1');
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
      show: false
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
      type: 'text',
      left: 'center',
      top: '44%',
      style: {
        text: 'test',
        fontSize: undefined,
        fontWeight: 0,
        fontFamily: '',
        fill: ''
      },
      silent: true
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
            show: false
          },
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
      expect(utils.textCenterDonut).toEqual(labelProperties);
    });

    it('should set donut config if innerRadius is 80', () => {
      utils['component'].options = {
        innerRadius: 80,
        textCenterGraph: 'test',
        legendVerticalPosition: 'top'
      } as PoChartOptions;
      utils['component'].series = [
        { label: 'Serie 1', data: 10 },
        { label: 'Serie 2', data: 30 }
      ];
      const labelText = { ...labelProperties, top: '52%' };

      utils.setListTypeDonutPie(PoChartType.Donut);

      expect(utils['component'].listTypePieDonut).toEqual([
        {
          type: 'pie',
          center: ['50%', '54%'],
          radius: ['44%', '80%'],
          roseType: undefined,
          emphasis: { focus: 'self' },
          data: [],
          label: {
            show: false
          },
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ]);
      expect(utils.textCenterDonut).toEqual(labelText);
    });
  });

  describe('isRadarOptions', () => {
    it('should return true when value has indicator property', () => {
      const result = utils['isRadarOptions']({
        indicator: [],
        other: 'x'
      });

      expect(result).toBeTrue();
    });

    it('should return false when value does not have indicator property', () => {
      const result = utils['isRadarOptions']({
        other: 'x'
      });

      expect(result).toBeFalse();
    });
  });

  describe('setListTypeRadar', () => {
    it('should use default values when radar is empty', () => {
      mockCtx.radar = {
        indicator: [{ name: 'A' }]
      };

      mockCtx.getCSSVariable.and.callFake((key: string) => '#test');

      const result = utils.setListTypeRadar();

      expect(result.shape).toBe('polygon');
      expect(result.splitArea.show).toBe(false);
      expect(result.indicator[0]).toEqual({
        name: 'A',
        max: undefined,
        min: 0,
        color: '#test'
      });
    });

    it('should apply fallback values when radar options are not provided', () => {
      utils['component'].categories = ['A', 'B'];
      utils['component'].options = {};

      spyOn(utils as any, 'isRadarOptions').and.returnValue(false);

      spyOn(utils as any, 'convertRadarConfig').and.returnValue({
        shape: undefined,
        splitArea: undefined,
        indicator: []
      });

      (utils['component'].getCSSVariable as jasmine.Spy).and.returnValue('#000000');

      spyOn(utils, 'resolvePx').and.returnValue(1);

      const result = utils.setListTypeRadar();

      expect(result.shape).toBe('polygon');
      expect(result.splitArea.show).toBe(false);
      expect(result.indicator).toEqual([]);
      expect(utils['component'].options.fillPoints).toBeTrue();
    });

    it('should use categories directly when isRadarOptions returns true', () => {
      utils['component'].categories = { indicator: [{ name: 'Test' }] } as any;

      spyOn(utils as any, 'isRadarOptions').and.returnValue(true);

      (utils['component'].getCSSVariable as jasmine.Spy).and.returnValue('#000000');
      spyOn(utils, 'resolvePx').and.returnValue(1);

      const result = utils.setListTypeRadar();

      expect(result.indicator.length).toBe(1);
    });

    it('should fallback to empty indicator array when radar.indicator is missing', () => {
      utils['component'].categories = ['A', 'B'];

      spyOn(utils as any, 'isRadarOptions').and.returnValue(false);

      spyOn(utils as any, 'convertRadarConfig').and.returnValue({
        shape: undefined,
        splitArea: undefined
      });

      (utils['component'].getCSSVariable as jasmine.Spy).and.returnValue('#000000');
      spyOn(utils, 'resolvePx').and.returnValue(1);

      const result = utils.setListTypeRadar();

      expect(result.indicator).toEqual([]);
    });

    it('should set fillPoints to true when any series has areaStyle', () => {
      mockCtx.options = {};
      mockCtx.series = [{ name: 'Serie 1' }, { name: 'Serie 2', areaStyle: {} }];

      mockCtx.radar = { indicator: [] };
      mockCtx.getCSSVariable.and.returnValue('#333');
      spyOn(utils, 'resolvePx').and.returnValue(5);

      utils.setListTypeRadar();

      expect(mockCtx.options.fillPoints).toBeTrue();
    });

    it('should set fillPoints to true when options.areaStyle is true', () => {
      mockCtx.options = { areaStyle: true };
      mockCtx.series = [{ name: 'Serie 1' }];

      mockCtx.radar = { indicator: [] };
      mockCtx.getCSSVariable.and.returnValue('#333');
      spyOn(utils, 'resolvePx').and.returnValue(5);

      utils.setListTypeRadar();

      expect(mockCtx.options.fillPoints).toBeTrue();
    });

    it('should fallback fillPoints when no series has areaStyle and no global areaStyle', () => {
      mockCtx.options = {};
      mockCtx.series = [{ name: 'Serie 1' }, { name: 'Serie 2' }];

      mockCtx.radar = { indicator: [] };
      mockCtx.getCSSVariable.and.returnValue('#333');
      spyOn(utils, 'resolvePx').and.returnValue(5);

      utils.setListTypeRadar();

      expect(mockCtx.options.fillPoints).toBeTrue();
    });

    it('should fallback to empty object when component.options is undefined (cover ?? {})', () => {
      mockCtx.options = undefined as any;

      mockCtx.radar = { indicator: [] };
      mockCtx.getCSSVariable.and.returnValue('#333');
      spyOn(utils, 'resolvePx').and.returnValue(5);

      utils.setListTypeRadar();

      expect(mockCtx.options).toBeDefined();
      expect(mockCtx.options.fillPoints).toBeTrue();
      expect(mockCtx.options.radar).toBeDefined();
    });
  });

  describe('setSerieTypeRadar', () => {
    const mockColor = '#ff0000';
    const mockTokenBorderWidthMd = 3;
    const mockFillColor = '#00ff00';

    beforeEach(() => {
      mockCtx.options = {};
      mockCtx.dataLabel = undefined;
      mockCtx.getCSSVariable.calls.reset();

      mockCtx.getCSSVariable.and.callFake((key: string, selector?: string) => {
        if (key === '--color-chart-line-point-fill') {
          return mockFillColor;
        }
        return '#000000';
      });
    });

    it('should return undefined when serie type is not radar', () => {
      const serie = { type: 'line', name: 'Test Serie' };

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result).toBeUndefined();
    });

    it('should configure radar serie with default properties', () => {
      const serie = { type: 'radar', name: 'Test Radar' };

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result).toEqual(serie);
      expect(result.type).toBe('radar');
      expect(result.symbol).toBe('circle');
      expect(result.symbolSize).toBe(6);
      expect(result.label).toBeUndefined();
      expect(result.itemStyle).toEqual({
        color: mockColor,
        borderColor: mockColor,
        borderWidth: mockTokenBorderWidthMd
      });
      expect(result.lineStyle).toEqual({
        color: mockColor,
        width: mockTokenBorderWidthMd
      });
    });

    it('should show label when dataLabel.fixed is true', () => {
      const serie = { type: 'radar', name: 'Test Radar' };
      mockCtx.dataLabel = { fixed: true };

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result.label).toEqual({ show: true });
    });

    it('should use CSS variable color when fillPoints is false', () => {
      const serie = { type: 'radar', name: 'Test Radar' };
      mockCtx.options.fillPoints = false;

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result.itemStyle.color).toBe(mockFillColor);
      expect(mockCtx.getCSSVariable).toHaveBeenCalledWith('--color-chart-line-point-fill', 'po-chart .po-chart');
    });

    it('should use provided color when fillPoints is true', () => {
      const serie = { type: 'radar', name: 'Test Radar' };
      mockCtx.options.fillPoints = true;

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result.itemStyle.color).toBe(mockColor);
    });

    it('should use provided color when options.fillPoints is undefined (default true)', () => {
      const serie = { type: 'radar', name: 'Test Radar' };
      mockCtx.options.fillPoints = undefined;

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result.itemStyle.color).toBe(mockColor);
    });

    it('should not modify original serie when type is not radar', () => {
      const originalSerie = {
        type: 'line',
        name: 'Line Serie',
        symbol: 'rect',
        symbolSize: 10
      };
      const serieCopy = { ...originalSerie };

      const result = utils.setSerieTypeRadar(serieCopy, mockTokenBorderWidthMd, mockColor);

      expect(result).toBeUndefined();
      expect(serieCopy).toEqual(originalSerie);
    });

    it('should modify the same serie object when type is radar', () => {
      const serie = { type: 'radar', name: 'Radar Serie', symbol: 'circle' };

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result).toBe(serie);
      expect(serie.type).toBe('radar');
      expect(serie.symbol).toBe('circle');
    });

    it('should work when dataLabel exists but fixed is false', () => {
      const serie = { type: 'radar', name: 'Test Radar' };
      mockCtx.dataLabel = { fixed: false };

      const result = utils.setSerieTypeRadar(serie, mockTokenBorderWidthMd, mockColor);

      expect(result.label).toBeUndefined();
    });
  });

  describe('setTooltipRadar', () => {
    it('should process radar tooltip data correctly for various scenarios', () => {
      mockCtx.options = {
        radar: {
          indicator: [
            { name: 'Velocidade', max: 100 },
            { name: 'Precisão', max: 50 },
            { name: 'Qualidade', max: 80 }
          ]
        }
      };

      const params1 = {
        value: [85, 40, 75],
        name: 'Série A'
      };

      utils.setTooltipRadar(params1);

      mockCtx.options = {};
      const params2 = {
        value: [10, 20],
        name: 'Série B'
      };

      utils.setTooltipRadar(params2);

      const params3 = {
        value: null,
        name: 'Série C'
      };

      utils.setTooltipRadar(params3);

      mockCtx.options = {
        radar: {
          indicator: [{ name: 'Teste', max: 100 }]
        }
      };
      const params4 = {
        value: [50, 60, 70],
        name: 'Série D'
      };

      utils.setTooltipRadar(params4);

      const params5 = {
        name: 'Série E'
      };

      utils.setTooltipRadar(params5);
    });
  });

  describe('buildRadarTooltip', () => {
    it('should build complete radar tooltip HTML string for all scenarios', () => {
      mockCtx.options = {
        radar: {
          indicator: [
            { name: 'Performance', max: 100 },
            { name: 'Custo', max: 50 },
            { name: 'Tempo', max: 80 }
          ]
        }
      };

      const params1 = { value: [90, 30, 65], name: 'Produto X' };
      const result1 = utils.buildRadarTooltip(params1);

      expect(result1).toBe(
        '<b>Produto X</b><br>' + 'Performance: <b>90</b><br>' + 'Custo: <b>30</b><br>' + 'Tempo: <b>65</b><br>'
      );

      mockCtx.options = {};

      const params2 = { value: [25, 50, 75], name: 'Produto Y' };
      const result2 = utils.buildRadarTooltip(params2);

      expect(result2).toBe(
        '<b>Produto Y</b><br>' +
          'Indicator 1: <b>25</b><br>' +
          'Indicator 2: <b>50</b><br>' +
          'Indicator 3: <b>75</b><br>'
      );

      const params3 = { value: null, name: 'Produto Z' };
      const result3 = utils.buildRadarTooltip(params3);

      expect(result3).toBe('<b>Produto Z</b><br>');

      const params4 = { name: 'Produto W' };
      const result4 = utils.buildRadarTooltip(params4);

      expect(result4).toBe('<b>Produto W</b><br>');

      mockCtx.options = {
        radar: {
          indicator: [{ name: 'Único', max: 100 }]
        }
      };

      const params5 = { value: [40, 60, 80], name: 'Produto V' };
      const result5 = utils.buildRadarTooltip(params5);

      expect(result5).toBe(
        '<b>Produto V</b><br>' + 'Único: <b>40</b><br>' + 'Indicator 2: <b>60</b><br>' + 'Indicator 3: <b>80</b><br>'
      );

      mockCtx.options = { radar: {} };

      const params6 = { value: [100], name: 'Produto U' };
      const result6 = utils.buildRadarTooltip(params6);

      expect(result6).toBe('<b>Produto U</b><br>' + 'Indicator 1: <b>100</b><br>');

      const params7 = { value: [], name: 'Produto T' };
      const result7 = utils.buildRadarTooltip(params7);

      expect(result7).toBe('<b>Produto T</b><br>');
    });
  });

  describe('finalizeSerieTypeRadar', () => {
    const mockItemStyle = { color: '#ff0000', borderWidth: 2 };
    const mockLineStyle = { color: '#ff0000', width: 2 };

    beforeEach(() => {
      mockCtx.options = {};
    });

    it('should finalize radar series configuration for all scenarios', () => {
      const series1 = [
        {
          name: 'Série A',
          data: [10, 20, 30],
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        }
      ];

      const result1 = utils.finalizeSerieTypeRadar(series1);

      expect(result1).toEqual([
        {
          type: 'radar',
          data: [
            {
              name: 'Série A',
              value: [10, 20, 30],
              areaStyle: undefined,
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: mockItemStyle,
              lineStyle: mockLineStyle,
              label: { show: true }
            }
          ]
        }
      ]);

      mockCtx.options.areaStyle = true;
      const series2 = [
        {
          name: 'Série B',
          data: [40, 50],
          symbol: 'diamond',
          symbolSize: 8,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: false }
        }
      ];

      const result2 = utils.finalizeSerieTypeRadar(series2);

      expect(result2[0].data[0].areaStyle).toEqual({ opacity: 0.5 });

      mockCtx.options.areaStyle = false;
      const series3 = [
        {
          name: 'Série C',
          data: [60, 70, 80],
          areaStyle: true,
          symbol: 'rect',
          symbolSize: 10,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        }
      ];

      const result3 = utils.finalizeSerieTypeRadar(series3);

      expect(result3[0].data[0].areaStyle).toEqual({ opacity: 0.5 });

      const series4 = [
        {
          name: 'Série 1',
          data: [1, 2, 3],
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        },
        {
          name: 'Série 2',
          data: [4, 5, 6],
          areaStyle: true,
          symbol: 'triangle',
          symbolSize: 7,
          itemStyle: { color: '#00ff00' },
          lineStyle: { color: '#00ff00' },
          label: { show: false }
        }
      ];

      const result4 = utils.finalizeSerieTypeRadar(series4);

      expect(result4[0].data.length).toBe(2);
      expect(result4[0].data[0].areaStyle).toBeUndefined();
      expect(result4[0].data[1].areaStyle).toEqual({ opacity: 0.5 });
      expect(result4[0].data[0].name).toBe('Série 1');
      expect(result4[0].data[1].name).toBe('Série 2');

      const series5 = [
        {
          name: 'Série D',
          data: 'not an array',
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        },
        {
          name: 'Série E',
          data: null,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        },
        {
          name: 'Série F',
          data: 123,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        }
      ];

      const result5 = utils.finalizeSerieTypeRadar(series5);

      expect(result5[0].data[0].value).toEqual([]);
      expect(result5[0].data[1].value).toEqual([]);
      expect(result5[0].data[2].value).toEqual([]);

      const series6 = [
        {
          data: [100, 200],
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle
        }
      ];

      const result6 = utils.finalizeSerieTypeRadar(series6);

      expect(result6[0].data[0].name).toBe('');
      expect(result6[0].data[0].label).toEqual({ show: undefined });

      const series7 = [];

      const result7 = utils.finalizeSerieTypeRadar(series7);

      expect(result7[0].data).toEqual([]);

      mockCtx.options.areaStyle = true;
      const series8 = [
        {
          name: 'Série G',
          data: [90, 100],
          areaStyle: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        }
      ];

      const result8 = utils.finalizeSerieTypeRadar(series8);

      expect(result8[0].data[0].areaStyle).toEqual({ opacity: 0.5 });

      mockCtx.options.areaStyle = false;
      const series9 = [
        {
          name: 'Série H',
          data: [110, 120],
          areaStyle: false,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: mockItemStyle,
          lineStyle: mockLineStyle,
          label: { show: true }
        }
      ];

      const result9 = utils.finalizeSerieTypeRadar(series9);

      expect(result9[0].data[0].areaStyle).toBeUndefined();

      const series10 = [{}];

      const result10 = utils.finalizeSerieTypeRadar(series10);

      expect(result10[0].data[0]).toEqual({
        name: '',
        value: [],
        areaStyle: undefined,
        symbol: undefined,
        symbolSize: undefined,
        itemStyle: undefined,
        lineStyle: undefined,
        label: { show: undefined }
      });
    });
  });
});

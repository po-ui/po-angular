import { ElementRef } from '@angular/core';

import { PoChartGaugeUtils } from './po-chart-gauge-utils';
import { PoChartComponent } from './po-chart.component';

describe('PoChartGaugeUtils', () => {
  let gaugeUtils: PoChartGaugeUtils;
  let componentMock: jasmine.SpyObj<PoChartComponent>;

  beforeEach(() => {
    componentMock = jasmine.createSpyObj<PoChartComponent>('PoChartComponent', ['getCSSVariable']);

    const mockNativeElement = {
      querySelector: jasmine.createSpy().and.returnValue({ clientWidth: 600 })
    };

    componentMock.el = new ElementRef(mockNativeElement);
    componentMock.series = [];
    componentMock.options = {};
    componentMock.isGaugeSingle = false;
    componentMock.itemsTypeGauge = [];
    componentMock.itemsColorTypeGauge = [];
    componentMock.valueGaugeMultiple = 75;
    componentMock.height = 500;

    gaugeUtils = new PoChartGaugeUtils(componentMock);
  });

  it('should be created', () => {
    expect(gaugeUtils).toBeTruthy();
  });

  describe('setGaugeOptions', () => {
    let utils: PoChartGaugeUtils;
    let componentMock: jasmine.SpyObj<PoChartComponent>;
    let nativeElementMock: any;

    beforeEach(() => {
      nativeElementMock = {
        querySelector: jasmine.createSpy().and.returnValue({ clientWidth: 300 })
      };

      componentMock = jasmine.createSpyObj<PoChartComponent>('PoChartComponent', ['getCSSVariable'], ['el']);

      Object.defineProperty(componentMock, 'el', {
        get: () => ({ nativeElement: nativeElementMock })
      });

      componentMock.getCSSVariable.and.returnValue('mock-css-var');

      componentMock.itemsTypeGauge = [];
      componentMock.itemsColorTypeGauge = [];

      utils = new PoChartGaugeUtils(componentMock);
    });

    it('should return if isGaugeSingle is true', () => {
      componentMock.isGaugeSingle = true;
      const options = {};

      utils.setGaugeOptions(options, 12);

      expect(options).toEqual({});
    });

    it('should return if options.legend is false', () => {
      componentMock.isGaugeSingle = false;
      componentMock.options = { legend: false };
      const options = {};

      utils.setGaugeOptions(options, 12);

      expect(options).toEqual({});
    });

    it('should return if series do not contain any item with label', () => {
      componentMock.isGaugeSingle = false;
      componentMock.options = { legend: true };
      componentMock.series = [{ label: undefined }];
      const options = {};

      utils.setGaugeOptions(options, 12);

      expect(options).toEqual({});
    });

    it('should set options.graphic with gauge legend items when valid conditions', () => {
      componentMock.isGaugeSingle = false;
      componentMock.options = {
        legend: true,
        showFromToLegend: true
      };

      componentMock.series = [{ label: 'A' }];
      componentMock.itemsTypeGauge = [{ label: 'A', from: 0, to: 10 }];
      componentMock.itemsColorTypeGauge = ['#ff0000'];
      const options = {} as { graphic?: any };
      utils.setGaugeOptions(options, 12);

      expect(options.graphic).toBeDefined();
      expect(Array.isArray(options.graphic)).toBeTrue();
      expect(options.graphic[0].type).toBe('group');
      expect(options.graphic[0].children.length).toBe(2);
    });

    it('should wrap to next line when itemWidth exceeds chartWidth', () => {
      componentMock.isGaugeSingle = false;
      componentMock.options = {
        legend: true,
        showFromToLegend: false
      };

      nativeElementMock.querySelector.and.returnValue({ clientWidth: 100 });

      componentMock.series = [{ label: 'A' }];
      componentMock.itemsTypeGauge = [{ label: 'A', from: 0, to: 10 }];
      componentMock.itemsColorTypeGauge = ['#00ff00'];

      const options = {} as { graphic?: any };
      utils.setGaugeOptions(options, 20);

      expect(options.graphic[0].children[0].top).toBe(0);
    });

    it('should handle undefined, long, and short labels and wrap items correctly', () => {
      componentMock.isGaugeSingle = false;
      componentMock.options = {
        legend: true,
        showFromToLegend: false
      };

      const chartElement = document.createElement('div');
      chartElement.id = 'chart-id';
      Object.defineProperty(chartElement, 'clientWidth', { value: 100 });
      componentMock.el.nativeElement.querySelector = () => chartElement;

      componentMock.series = [{ label: 'Serie A' }];
      componentMock.itemsTypeGauge = [{ label: 'Short' }, { label: 'A very very long label' }, { label: undefined }];
      componentMock.itemsColorTypeGauge = ['#FF0000', '#00FF00', '#0000FF'];

      const options: any = {};
      utils.setGaugeOptions(options, 12);

      expect(options.graphic).toBeDefined();
      expect(options.graphic[0].type).toBe('group');

      const textItems = options.graphic[0].children.filter(child => child.type === 'text');
      expect(textItems.some(t => t.style.text === '')).toBeTrue();
      expect(options.graphic[0].children.some(c => c.top > 0)).toBeTrue();
    });
  });

  describe('setListTypeGauge', () => {
    let componentMock: Partial<PoChartComponent>;
    let utils: PoChartGaugeUtils;
    let serie: any;
    const fontSizes = { fontSizeMd: 10, fontSizeLg: 20, fontSizeSubtitle: 12 };

    beforeEach(() => {
      componentMock = {
        series: [],
        isGaugeSingle: false,
        itemsTypeGauge: [],
        itemsColorTypeGauge: ['#111', '#222'],
        el: {
          nativeElement: {
            querySelector: jasmine.createSpy('querySelector').and.returnValue({ clientWidth: 500 })
          }
        },
        height: 500,
        options: {
          pointer: true,
          descriptionChart: 'descGauge',
          subtitleGauge: 'subtitleGauge'
        },
        valueGaugeMultiple: 42,
        getCSSVariable: jasmine.createSpy('getCSSVariable').and.callFake(name => {
          const map = {
            '--color-gauge-pointer-color': '#000',
            '--font-weight-hightlight-value': '700',
            '--font-family-hightlight-value': 'Arial',
            '--color-hightlight-value': '#333',
            '--font-weight-description-chart': '600',
            '--font-family-description-chart': 'Verdana',
            '--color-description-chart': '#666'
          };
          return map[name];
        })
      };

      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);
      serie = {};
    });

    it('should configure serie correctly for single gauge', () => {
      componentMock.series = [{ label: 'label1', data: 80 }];
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      const result = utils.setListTypeGauge(serie, fontSizes);

      expect(componentMock.isGaugeSingle).toBeTrue();
      expect(componentMock.itemsTypeGauge.length).toBe(1);
      expect(componentMock.itemsTypeGauge[0].label).toBe('label1');
      expect(componentMock.itemsTypeGauge[0].from).toBe(0);
      expect(componentMock.itemsTypeGauge[0].to).toBe(80);
      expect(result.type).toBe('gauge');
      expect(result.startAngle).toBe(180);
      expect(result.endAngle).toBe(0);
      expect(result.center).toBeDefined();
      expect(result.radius).toBeDefined();
      expect(result.axisTick.show).toBeFalse();
      expect(result.pointer.show).toBeFalse();
      expect(result.detail.show).toBeTrue();
      expect(result.detail.formatter({})).toBe('80%');
      expect(result.title.fontSize).toBe(fontSizes.fontSizeSubtitle);
      expect(result.data[0].value).toBe(80);
      expect(result.data[0].name).toBe('subtitleGauge');
    });

    it('should configure serie correctly for multiple gauges', () => {
      componentMock.series = [
        { label: 'label1', from: 0, to: 30 },
        { label: 'label2', from: 31, to: 60 },
        { label: 'label3', from: 61, to: 90 }
      ];
      componentMock.valueGaugeMultiple = 55;
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      spyOn(utils as any, 'normalizeToRelativePercentage').and.callThrough();
      spyOn(utils as any, 'setPropertiesGauge').and.callThrough();

      const result = utils.setListTypeGauge(serie, fontSizes);

      expect(componentMock.isGaugeSingle).toBeFalse();
      expect(utils['normalizeToRelativePercentage']).toHaveBeenCalledWith(componentMock.series);
      expect(componentMock.itemsTypeGauge.length).toBeGreaterThan(0);
      expect(result.type).toBe('gauge');
      expect(result.pointer.show).toBeTrue();
      expect(result.detail.formatter({})).toBe('55%');
      expect(result.data[0].value).toBe(55);
      expect(result.data[0].name).toBe('subtitleGauge');
    });

    it('should use fontSizeMd for small width or height', () => {
      componentMock.series = [{ label: 'label1', data: 100 }];
      componentMock.el.nativeElement.querySelector = jasmine.createSpy().and.returnValue({ clientWidth: 400 });
      componentMock.height = 300;
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      const result = utils.setListTypeGauge(serie, fontSizes);

      expect(result.detail.fontSize).toBe(fontSizes.fontSizeMd);
    });

    it('should use fontSizeLg for large width and height', () => {
      componentMock.series = [{ label: 'label1', data: 100 }];
      componentMock.el.nativeElement.querySelector = jasmine.createSpy().and.returnValue({ clientWidth: 500 });
      componentMock.height = 600;
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      const result = utils.setListTypeGauge(serie, fontSizes);

      expect(result.detail.fontSize).toBe(fontSizes.fontSizeLg);
    });

    it('should set divWidth to 0 when querySelector returns null', () => {
      componentMock.series = [{ label: 'label1', data: 80 }];
      componentMock.el.nativeElement.querySelector = jasmine.createSpy().and.returnValue(null);
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      const result = utils.setListTypeGauge(serie, fontSizes);

      expect(result).toBeDefined();
      expect(componentMock.isGaugeSingle).toBeTrue();
    });

    it('should formatter return empty string when not single gauge and valueGaugeMultiple is falsy', () => {
      componentMock.series = [
        { label: 'label1', data: 80 },
        { label: 'label2', data: 90 }
      ];
      componentMock.valueGaugeMultiple = 0;
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      const result = utils.setListTypeGauge(serie, fontSizes);
      const formatterFn = result.detail.formatter;

      expect(formatterFn({})).toBe('');
    });

    it('should use data.label as name if descriptionChart is undefined for single gauge', () => {
      componentMock.series = [{ label: 'label1', data: 80 }];
      componentMock.options.subtitleGauge = undefined;
      utils = new PoChartGaugeUtils(componentMock as PoChartComponent);

      const result = utils.setListTypeGauge(serie, fontSizes);

      expect(result.data[0].name).toBe('label1');
    });
  });

  describe('setPropertiesGauge', () => {
    it('should apply default height and not is gaugeSingle', () => {
      componentMock.options.subtitleGauge = 'test';
      componentMock.isGaugeSingle = false;
      const result = gaugeUtils['setPropertiesGauge'](700, 300);
      expect(result).toEqual({
        radius: '140%',
        lengthPointer: '30%',
        center: ['50%', '80%'],
        widthSubtitle: 210
      });
    });

    it('should apply isMediumScreen rules without changing widthSubtitle when 499 < 500', () => {
      const result = gaugeUtils['setPropertiesGauge'](700, 450);
      expect(result).toEqual({
        radius: '120%',
        lengthPointer: '35%',
        center: ['50%', '80%'],
        widthSubtitle: 320
      });
    });

    it('should apply isLargeScreen rules without changing radius when height <= 750', () => {
      const result = gaugeUtils['setPropertiesGauge'](1000, 700);
      expect(result).toEqual({
        radius: '140%',
        lengthPointer: '40%',
        center: ['50%', '80%'],
        widthSubtitle: 500
      });
    });

    it('should apply isLargeScreen and height > 750 rules, setting radius to 100%', () => {
      const result = gaugeUtils['setPropertiesGauge'](1000, 800);
      expect(result).toEqual({
        radius: '100%',
        lengthPointer: '40%',
        center: ['50%', '80%'],
        widthSubtitle: 500
      });
    });
  });

  describe('setSerieTypeGauge ', () => {
    it('should add color to itemsColorTypeGauge if serie type is gauge', () => {
      gaugeUtils['component'].itemsColorTypeGauge = ['#111111'];

      const serie = { type: 'gauge' };
      const color = '#123456';

      gaugeUtils['setSerieTypeGauge'](serie, color);

      expect(gaugeUtils['component'].itemsColorTypeGauge).toEqual(['#111111', '#123456']);
    });

    it('should not add color if serie type is not gauge', () => {
      gaugeUtils['component'].itemsColorTypeGauge = ['#111111'];

      const serie = { type: 'bar' };
      const color = '#123456';

      gaugeUtils['setSerieTypeGauge'](serie, color);

      expect(gaugeUtils['component'].itemsColorTypeGauge).toEqual(['#111111']);
    });
  });

  describe('normalizeToRelativePercentage', () => {
    const callPrivateMethod = (series: Array<any>) => gaugeUtils['normalizeToRelativePercentage'](series);

    it('should return empty array when no numeric series are provided', () => {
      const series = [
        { label: 'A', to: 'not a number' },
        { label: 'B', to: null }
      ];

      const result = callPrivateMethod(series);
      expect(result).toEqual([]);
    });

    it('should return 100% for all items when max value is 0', () => {
      const series = [
        { label: 'A', from: 0, to: 0 },
        { label: 'B', from: 0, to: 0 }
      ];

      const result = callPrivateMethod(series);
      expect(result).toEqual([
        { label: 'A', from: 0, to: 0, valuePercentage: 100 },
        { label: 'B', from: 0, to: 0, valuePercentage: 100 }
      ]);
    });

    it('should correctly calculate relative percentages for mixed values', () => {
      const series = [
        { label: 'Small', from: 0, to: 10 },
        { label: 'Medium', from: 10, to: 50 },
        { label: 'Large', from: 50, to: 100 }
      ];

      const result = callPrivateMethod(series);

      expect(result[0].label).toBe('Small');
      expect(result[1].label).toBe('Medium');
      expect(result[2].label).toBe('Large');
      expect(result[0].valuePercentage).toBe(10);
      expect(result[1].valuePercentage).toBe(50);
      expect(result[2].valuePercentage).toBe(100);
    });

    it('should handle decimal values and round to 2 decimal places', () => {
      const series = [
        { label: 'A', from: 0, to: 33.333 },
        { label: 'B', from: 33.333, to: 66.666 },
        { label: 'C', from: 66.666, to: 100 }
      ];

      const result = callPrivateMethod(series);

      expect(result[0].valuePercentage).toBe(33.33);
      expect(result[1].valuePercentage).toBe(66.67);
      expect(result[2].valuePercentage).toBe(100);
    });

    it('should preserve original labels and from/to values', () => {
      const series = [
        { label: 'Test', from: 5, to: 25 },
        { label: undefined, from: undefined, to: 50 }
      ];

      const result = callPrivateMethod(series);

      expect(result[0].label).toBe('Test');
      expect(result[0].from).toBe(5);
      expect(result[0].to).toBe(25);

      expect(result[1].label).toBeUndefined();
      expect(result[1].from).toBeUndefined();
      expect(result[1].to).toBe(50);
    });
  });

  describe('finalizeSerieTypeGauge', () => {
    beforeEach(() => {
      componentMock.getCSSVariable.and.returnValue('#cccccc');
    });

    it('should handle single gauge with correct colors', () => {
      componentMock.isGaugeSingle = true;
      componentMock.itemsTypeGauge = [{ label: 'Single', from: 0, to: 75, valuePercentage: 75 }];
      componentMock.itemsColorTypeGauge = ['#ff0000'];

      const mockSerie = { type: 'gauge', name: 'Test' };
      const result = gaugeUtils.finalizeSerieTypeGauge(mockSerie);

      expect(result).toEqual([
        {
          ...mockSerie,
          axisLine: {
            lineStyle: {
              width: 40,
              color: [
                [0.75, '#ff0000'],
                [1, '#cccccc']
              ]
            }
          }
        }
      ]);
    });

    it('should handle multiple gauges using buildGaugeAxisLineColorsWithGaps', () => {
      componentMock.isGaugeSingle = false;
      componentMock.itemsTypeGauge = [
        { label: 'A', from: 0, to: 25 },
        { label: 'B', from: 25, to: 50 },
        { label: 'C', from: 50, to: 100 }
      ];
      componentMock.itemsColorTypeGauge = ['#ff0000', '#00ff00', '#0000ff'];

      spyOn<any>(gaugeUtils, 'buildGaugeAxisLineColorsWithGaps').and.returnValue([
        [0.25, '#ff0000'],
        [0.5, '#00ff00'],
        [1, '#0000ff']
      ]);

      const mockSerie = { type: 'gauge', name: 'Multiple' };
      const result = gaugeUtils.finalizeSerieTypeGauge(mockSerie);

      expect(gaugeUtils['buildGaugeAxisLineColorsWithGaps']).toHaveBeenCalledWith(
        componentMock.itemsTypeGauge,
        componentMock.itemsColorTypeGauge,
        '#cccccc'
      );

      expect(result).toEqual([
        {
          ...mockSerie,
          axisLine: {
            lineStyle: {
              width: 40,
              color: [
                [0.25, '#ff0000'],
                [0.5, '#00ff00'],
                [1, '#0000ff']
              ]
            }
          }
        }
      ]);
    });

    it('should maintain all original serie properties', () => {
      componentMock.isGaugeSingle = true;
      componentMock.itemsTypeGauge = [{ label: 'Single', from: 0, to: 50, valuePercentage: 50 }];
      componentMock.itemsColorTypeGauge = ['#123456'];

      const complexSerie = {
        type: 'gauge',
        name: 'Complex',
        extraProp: 'value',
        nested: { a: 1, b: 2 }
      };

      const result = gaugeUtils.finalizeSerieTypeGauge(complexSerie);

      expect(result[0].type).toBe('gauge');
      expect(result[0].name).toBe('Complex');
      expect(result[0].extraProp).toBe('value');
      expect(result[0].nested).toEqual({ a: 1, b: 2 });
      expect(result[0].axisLine).toBeDefined();
    });

    it('should handle empty itemsTypeGauge for single gauge', () => {
      componentMock.isGaugeSingle = true;
      componentMock.itemsTypeGauge = [{ valuePercentage: 100 }];
      componentMock.itemsColorTypeGauge = ['#ffffff'];

      const mockSerie = { type: 'gauge' };
      const result = gaugeUtils.finalizeSerieTypeGauge(mockSerie);

      expect(result[0].axisLine.lineStyle.color).toBeDefined();
    });
  });

  describe('buildGaugeAxisLineColorsWithGaps', () => {
    const callPrivateMethod = (series: Array<any>, colorPalette: Array<string>, gapColor: string) =>
      gaugeUtils['buildGaugeAxisLineColorsWithGaps'](series, colorPalette, gapColor);

    it('should return empty array when no series are provided', () => {
      const result = callPrivateMethod([], ['#ff0000'], '#cccccc');
      expect(result).toEqual([]);
    });

    it('should handle single segment without gaps', () => {
      const series = [{ label: 'A', from: 0, to: 100 }];
      const colors = ['#ff0000'];
      const gapColor = '#cccccc';

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result).toEqual([[1, '#ff0000']]);
    });

    it('should handle multiple contiguous segments', () => {
      const series = [
        { label: 'A', from: 0, to: 30 },
        { label: 'B', from: 30, to: 60 },
        { label: 'C', from: 60, to: 100 }
      ];
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const gapColor = '#cccccc';

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result).toEqual([
        [0.3, '#ff0000'],
        [0.6, '#00ff00'],
        [1, '#0000ff']
      ]);
    });

    it('should add final gap when lastTo < maxTo', () => {
      const series = [
        { label: 'A', from: 0, to: 20 },
        { label: 'B', from: 30, to: 50 }
      ];
      const colors = ['#ff0000', '#00ff00'];
      const gapColor = '#eeeeee';

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result).toEqual([
        [0.4, '#ff0000'],
        [0.6, '#eeeeee'],
        [1, '#00ff00']
      ]);
    });

    it('should add final gap segment at the end when lastTo < maxTo', () => {
      const series = [
        { label: 'A', from: 0, to: 50 },
        { label: 'B', from: 60, to: 70 }
      ];
      const colors = ['#ff0000', '#00ff00'];
      const gapColor = '#eeeeee';

      spyOn(Math, 'max').and.returnValue(100);

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result).toEqual([
        [0.5, '#ff0000'],
        [0.6, '#eeeeee'],
        [0.7, '#00ff00'],
        [1, '#eeeeee']
      ]);

      (Math.max as jasmine.Spy).and.callThrough();
    });

    it('should handle color palette cycling', () => {
      const series = [
        { label: 'A', from: 0, to: 25 },
        { label: 'B', from: 25, to: 50 },
        { label: 'C', from: 50, to: 75 },
        { label: 'D', from: 75, to: 100 }
      ];
      const colors = ['#ff0000', '#00ff00'];
      const gapColor = '#cccccc';

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result).toEqual([
        [0.25, '#ff0000'],
        [0.5, '#00ff00'],
        [0.75, '#ff0000'],
        [1, '#00ff00']
      ]);
    });

    it('should properly handle decimal values and rounding', () => {
      const series = [
        { label: 'A', from: 0, to: 33.333 },
        { label: 'B', from: 33.333, to: 66.666 },
        { label: 'C', from: 66.666, to: 99.999 }
      ];
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const gapColor = '#cccccc';

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result[0][0]).toBe(0.3333);
      expect(result[1][0]).toBe(0.6667);
      expect(result[2][0]).toBe(1);
    });

    it('should sort segments by from value and maintain color order', () => {
      const series = [
        { label: 'B', from: 30, to: 60 },
        { label: 'A', from: 0, to: 30 },
        { label: 'C', from: 60, to: 100 }
      ];
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      const gapColor = '#cccccc';

      const result = callPrivateMethod(series, colors, gapColor);

      expect(result).toEqual([
        [0.3, '#ff0000'],
        [0.6, '#00ff00'],
        [1, '#0000ff']
      ]);
    });
  });
});

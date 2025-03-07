import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { PoChartNewBaseComponent } from './po-chart-new-base.component';
import { PoChartNewComponent } from './po-chart-new.component';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoColorService } from '../../services/po-color/po-color.service';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoChartOptions } from '../po-chart/interfaces/po-chart-options.interface';
import { PoTooltipDirective } from '../../directives';
import { PoModalComponent } from '../po-modal';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { PoChartLabelFormat } from '../po-chart/enums/po-chart-label-format.enum';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';

class EChartsMock {
  setOption = jasmine.createSpy('setOption');
  resize = jasmine.createSpy('resize');
  dispose = jasmine.createSpy('dispose');
  clear = jasmine.createSpy('clear');
  getDataURL = jasmine.createSpy('getDataURL').and.returnValue('data:image/png;base64,mock');
  getOption = jasmine.createSpy('getOption').and.returnValue({
    xAxis: [{ data: ['Jan', 'Fev', 'Mar'] }],
    series: [{ name: 'Serie 1', data: [1, 2, 3] }]
  });
  on = jasmine.createSpy('on');
}
describe('PoChartNewComponent', () => {
  let component: PoChartNewComponent;
  let fixture: ComponentFixture<PoChartNewComponent>;
  let colorService: PoColorService;
  let languageService: PoLanguageService;

  const mockSeries: Array<PoChartSerie> = [
    { label: 'Serie 1', data: [1, 2, 3], type: PoChartType.Column },
    { label: 'Serie 2', data: [4, 5, 6], type: PoChartType.Line }
  ];
  const mockCategories = ['Jan', 'Fev', 'Mar'];
  const mockOptions: PoChartOptions = {
    axis: {
      minRange: 0,
      maxRange: 100,
      gridLines: 5,
      showXAxis: true,
      showYAxis: true,
      paddingLeft: 48,
      labelType: PoChartLabelFormat.Number
    },
    legend: true,
    dataZoom: true
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PoChartNewComponent, PoTooltipDirective, PoModalComponent],
      providers: [
        CurrencyPipe,
        DecimalPipe,
        PoColorService,
        PoLanguageService,
        { provide: PoChartNewBaseComponent, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    window['echarts'] = {
      init: () => new EChartsMock()
    };

    window.getComputedStyle = () =>
      ({
        getPropertyValue: (prop: string) => {
          const values: { [key: string]: string } = {
            '--border-width-sm': '1px',
            '--font-size-grid': '12px',
            '--background-color-grid': '#ffffff',
            '--color-grid': '#dadedf',
            '--font-family-grid': 'Roboto',
            '--font-weight-grid': '400',
            '--color-legend': '#4a5c60',
            '--border-width-md': '2px',
            '--color-neutral-light-00': '#ffffff'
          };
          return values[prop] || '';
        },
        fontSize: '16px'
      }) as CSSStyleDeclaration;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartNewComponent);
    component = fixture.componentInstance;
    colorService = TestBed.inject(PoColorService);
    languageService = TestBed.inject(PoLanguageService);

    component.series = mockSeries;
    component.categories = mockCategories;
    component.options = mockOptions;
    component.height = 400;

    const headerElement = document.createElement('div');
    headerElement.style.height = '50px';
    const chartDiv = document.createElement('div');
    chartDiv.style.width = '200px';
    chartDiv.style.height = '200px';
    spyOn(component['el'].nativeElement, 'querySelector').and.callFake((selector: string) => {
      if (selector === '#chart-id') {
        return chartDiv;
      }
      if (selector === '.po-chart-header') return headerElement;
      return null;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Lifecycle hooks:', () => {
    it('ngAfterViewInit: should initialize echarts', () => {
      spyOn(component, <any>'initECharts');
      component.ngAfterViewInit();
      expect(component['initECharts']).toHaveBeenCalled();
    });

    it('should call required methods for CSV export', () => {
      const csvExport = component['popupActions'][0];

      spyOn(component as any, 'setTableProperties');
      spyOn(component as any, 'downloadCsv');

      csvExport.action();

      expect((component as any).setTableProperties).toHaveBeenCalled();
      expect((component as any).downloadCsv).toHaveBeenCalled();
    });

    describe('onResize', () => {
      it('should call resize on chartInstance when it exists', () => {
        const mockChartInstance = {
          resize: jasmine.createSpy('resize')
        };
        component['chartInstance'] = mockChartInstance as any;
        component.onResize();

        expect(mockChartInstance.resize).toHaveBeenCalled();
      });

      it('should not throw errors when chartInstance is undefined', () => {
        component['chartInstance'] = undefined;

        expect(() => component.onResize()).not.toThrow();
      });
    });
    it('ngOnChanges: should handle series changes', () => {
      const newSeries = [...mockSeries, { label: 'New Serie', data: [7, 8, 9], type: PoChartType.Line }];
      spyOn(component, <any>'setChartsProperties');

      component.series = newSeries;
      component.ngOnChanges({ series: { currentValue: newSeries } } as any);

      expect(component['setChartsProperties']).toHaveBeenCalled();
    });

    it('should call setPopupActions when customActions changes', () => {
      const setPopupActionsSpy = spyOn(component as any, 'setPopupActions');

      const changes: SimpleChanges = {
        customActions: {
          currentValue: [{ label: 'New Action' }],
          previousValue: undefined,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(setPopupActionsSpy).toHaveBeenCalled();
    });

    it('should return early when series change is firstChange', () => {
      const initEChartsSpy = spyOn(component as any, 'initECharts');

      const changes: SimpleChanges = {
        series: {
          currentValue: mockSeries,
          previousValue: undefined,
          firstChange: true,
          isFirstChange: () => true
        }
      };

      component.ngOnChanges(changes);

      expect(initEChartsSpy).not.toHaveBeenCalled();
    });

    it('should call resize after timeout when height changes', fakeAsync(() => {
      component['chartInstance'] = {
        resize: jasmine.createSpy('resize')
      } as any;

      const changes: SimpleChanges = {
        height: {
          currentValue: 500,
          previousValue: 400,
          firstChange: false,
          isFirstChange: () => false
        }
      };

      component.ngOnChanges(changes);

      expect(component['chartInstance'].resize).not.toHaveBeenCalled();
      tick();

      expect(component['chartInstance'].resize).toHaveBeenCalled();
    }));

    it('ngOnChanges: should reinitialize chart when renderer option changes', () => {
      const newOptions = {
        ...mockOptions,
        rendererOption: 'svg' as const
      };

      spyOn(component['chartInstance'], 'dispose');

      component.options = newOptions;
      component.ngOnChanges({
        options: {
          currentValue: newOptions,
          previousValue: mockOptions,
          firstChange: false
        }
      } as any);

      expect(component['chartInstance'].dispose).toHaveBeenCalled();
    });
  });

  describe('openModal', () => {
    let mockModal: any;

    beforeEach(() => {
      mockModal = {
        open: jasmine.createSpy('open')
      };
      component.modal = mockModal as PoModalComponent;
    });

    it('should call setTableProperties when chartInstance exists', () => {
      const setTablePropertiesSpy = spyOn(component as any, 'setTableProperties');

      component['chartInstance'] = new EChartsMock();
      component.openModal();

      expect(setTablePropertiesSpy).toHaveBeenCalled();
    });

    it('should return immediately when chartInstance is undefined', () => {
      const mockModal = {
        open: jasmine.createSpy('open')
      };
      component.modal = mockModal as unknown as PoModalComponent;

      component['chartInstance'] = undefined;
      component.openModal();

      expect(mockModal.open).not.toHaveBeenCalled();
    });
  });

  describe('toggleExpand', () => {
    beforeEach(() => {
      component['chartInstance'] = new EChartsMock();
      component['headerHeight'] = 50;
      component.height = 400;
    });

    it('should expand the chart and set properties correctly', fakeAsync(() => {
      const mockChart = {
        resize: jasmine.createSpy('resize'),
        dispose: jasmine.createSpy('dispose')
      };

      component['chartInstance'] = mockChart;
      component.height = 400;
      component['headerHeight'] = 50;
      component['isExpanded'] = false;

      const windowInnerHeight = 800;
      spyOnProperty(window, 'innerHeight').and.returnValue(windowInnerHeight);

      component.toggleExpand();

      expect(component['originalHeight']).withContext('should save original height').toBe(400);
      expect(component.height).withContext('should set to window height').toBe(windowInnerHeight);
      expect(component['chartMarginTop']).withContext('should add header margin').toBe('50px');
      expect(component['isExpanded']).withContext('should toggle expanded state').toBeTrue();

      flush();
      expect(mockChart.resize).withContext('should trigger chart resize').toHaveBeenCalled();
    }));

    it('should collapse the chart and restore original properties', fakeAsync(() => {
      const mockChartInstance = {
        resize: jasmine.createSpy('resize'),
        dispose: jasmine.createSpy('dispose'),
        clear: jasmine.createSpy('clear'),
        getDataURL: jasmine.createSpy('getDataURL'),
        on: jasmine.createSpy('on')
      };
      component['chartInstance'] = mockChartInstance;
      component['isExpanded'] = true;
      component['originalHeight'] = 400;
      component.height = 800;
      component['headerHeight'] = 50;
      component.toggleExpand();

      expect(component.height).withContext('Deveria restaurar a altura original').toBe(400);
      expect(component['chartMarginTop']).withContext('Deveria resetar a margem superior').toBe('0px');
      expect(component['isExpanded']).withContext('Deveria alternar o estado expandido').toBeFalse();

      flush();
      expect(mockChartInstance.resize).withContext('Deveria chamar resize após colapso').toHaveBeenCalled();
    }));

    it('should handle resize when chartInstance is not defined', () => {
      component['chartInstance'] = undefined;
      component['isExpanded'] = true;
      component['originalHeight'] = 400;

      expect(() => component.toggleExpand()).not.toThrow();
      expect(component.height).toBe(400);
      expect(component['isExpanded']).toBeFalse();
    });

    it('should not modify originalHeight when collapsing', () => {
      const originalHeight = 300;
      component['originalHeight'] = originalHeight;
      component['isExpanded'] = true;

      component.toggleExpand();

      expect(component['originalHeight']).toBe(originalHeight);
    });
  });

  describe('initECHarts:', () => {
    it('should not initialize the chart if #chart-id is not found', () => {
      const originalQuerySelector = component['el'].nativeElement.querySelector;
      component['el'].nativeElement.querySelector = jasmine.createSpy('querySelector').and.returnValue(null);

      spyOn(component as any, 'initEChartsEvents');
      spyOn(component as any, 'setChartsProperties');

      component['initECharts']();

      expect(component['initEChartsEvents']).not.toHaveBeenCalled();
      expect(component['setChartsProperties']).not.toHaveBeenCalled();

      component['el'].nativeElement.querySelector = originalQuerySelector;
    });

    it('should emit seriesClick event when clicking on the chart', () => {
      component['chartInstance'] = {
        on: jasmine.createSpy('on')
      } as any;

      spyOn(component.seriesClick, 'emit');
      spyOn(component.seriesHover, 'emit');

      component['initEChartsEvents']();

      expect(component['chartInstance'].on).toHaveBeenCalledWith('click', jasmine.any(Function));

      const clickCallback = component['chartInstance'].on.calls.argsFor(0)[1];

      const mockParams = { seriesName: 'Exemplo', value: 100, name: 'Categoria X' };
      clickCallback(mockParams);

      const mouseoverCallback = component['chartInstance'].on.calls.argsFor(1)[1];

      const mockParamsMouse = {};
      mouseoverCallback(mockParamsMouse);

      expect(component.seriesClick.emit).toHaveBeenCalledWith({
        label: 'Exemplo',
        data: 100,
        category: 'Categoria X'
      });
      expect(component.seriesHover.emit).not.toHaveBeenCalled();
    });

    it('should emit seriesHover event when hovering over a series', () => {
      const tooltipElement = document.createElement('div');
      tooltipElement.id = 'custom-tooltip';
      document.body.appendChild(tooltipElement);
      const chartElement = document.createElement('div');
      chartElement.id = 'chart-id';
      document.body.appendChild(chartElement);
      component['el'] = {
        nativeElement: document
      };

      component['chartInstance'] = {
        on: jasmine.createSpy('on')
      } as any;

      spyOn(component.seriesHover, 'emit');
      spyOn(component.seriesClick, 'emit');

      component.series = [{ tooltip: 'test', label: 'Brazil', data: [35, 32, 25, 29, 33, 33], color: 'color-10' }];

      component['initEChartsEvents']();

      expect(component['chartInstance'].on).toHaveBeenCalledWith('mouseover', jasmine.any(Function));

      const mouseoverCallback = component['chartInstance'].on.calls.argsFor(1)[1];

      const mockParams = {
        seriesName: 'Exemplo',
        value: 150,
        name: 'Categoria Y',
        seriesType: 'line',
        seriesIndex: 0,
        event: { offsetX: 10, offsetY: 20 }
      };
      mouseoverCallback(mockParams);
      const clickCallback = component['chartInstance'].on.calls.argsFor(0)[1];

      const mockParamsClick = {};
      clickCallback(mockParamsClick);

      expect(component.seriesHover.emit).toHaveBeenCalledWith({
        label: 'Exemplo',
        data: 150,
        category: 'Categoria Y'
      });
      expect(component.seriesClick.emit).not.toHaveBeenCalled();
    });

    it('should hide the tooltip when leaving the chart (mouseout)', () => {
      component['chartInstance'] = {
        on: jasmine.createSpy('on')
      } as any;

      spyOn(component.poTooltip, 'toggleTooltipVisibility');

      component['initEChartsEvents']();

      expect(component['chartInstance'].on).toHaveBeenCalledWith('mouseout', jasmine.any(Function));

      const mouseoutCallback = component['chartInstance'].on.calls.argsFor(2)[1];

      mouseoutCallback();

      expect(component.poTooltip.toggleTooltipVisibility).toHaveBeenCalledWith(false);
    });

    it('should set tooltipText as "seriesName: value" when tooltip is not defined', () => {
      const tooltipElement = document.createElement('div');
      tooltipElement.id = 'custom-tooltip';
      document.body.appendChild(tooltipElement);

      const chartElement = document.createElement('div');
      chartElement.id = 'chart-id';
      document.body.appendChild(chartElement);

      component['el'] = { nativeElement: document };

      component['chartInstance'] = {
        on: jasmine.createSpy('on')
      } as any;

      component.series = [{ label: 'Brazil', data: [35, 32, 25, 29, 33, 33], color: 'color-10' }];

      component['initEChartsEvents']();

      const mouseoverCallback = component['chartInstance'].on.calls.argsFor(1)[1];

      const mockParams = {
        seriesName: 'Exemplo',
        value: 150,
        name: 'Categoria Y',
        seriesType: 'line',
        seriesIndex: 0,
        event: { offsetX: 10, offsetY: 20 }
      };

      mouseoverCallback(mockParams);

      expect(component.tooltipText).toBe('Exemplo: 150');
    });
  });

  describe('getCSSVariable: ', () => {
    it('should return an empty string when element is not found or CSS variable is not set', () => {
      spyOn(document, 'querySelector').and.returnValue(null);

      spyOn(window, 'getComputedStyle').and.returnValue({
        getPropertyValue: () => ''
      } as unknown as CSSStyleDeclaration);

      const result = (component as any).getCSSVariable('--non-existent-variable', '.invalid-selector');

      expect(result).toBe('');
    });
  });

  describe('setOptionLine:', () => {
    it('should return line chart options with correct default structure', () => {
      component.options = {};

      const result = component['setOptionLine']();

      expect(result).toBeDefined();
      expect(result.backgroundColor).toBe('#ffffff');
      expect(result.grid.top).toBe(8);
      expect(result.xAxis.type).toBe('category');
      expect(result.yAxis.type).toBe('value');
    });

    it('should apply dataZoom configuration when enabled', () => {
      component.options.dataZoom = true;

      const result = component['setOptionLine']();
      expect(result.grid.top).toBe(20);
    });

    it('should apply correct axis configurations', () => {
      component.options.axis = {
        minRange: 10,
        maxRange: 100,
        gridLines: 7,
        showXAxis: false,
        showYAxis: true,
        paddingLeft: 60
      };

      const result = component['setOptionLine']();
      expect(result.yAxis.min).toBe(10);
      expect(result.yAxis.max).toBe(100);
      expect(result.yAxis.splitNumber).toBe(7);
      expect(result.grid.left).toBe(60);
      expect(result.xAxis.splitLine.show).toBeFalse();
      expect(result.yAxis.splitLine.show).toBeTrue();
    });

    it('should apply number formatting when labelType is Number', () => {
      component.options.axis = {
        labelType: PoChartLabelFormat.Number
      };

      const result = component['setOptionLine']();
      expect(result.yAxis.axisLabel.formatter(100)).toBe('100.00');
    });

    it('should apply currency formatting when labelType is Currency', () => {
      component.options.axis = {
        labelType: PoChartLabelFormat.Currency
      };

      const result = component['setOptionLine']();
      expect(result.yAxis.axisLabel.formatter(100)).toBe('$100.00');
    });

    it('should rotate xAxis labels when rotateLegend is true', () => {
      component.options.axis = {
        rotateLegend: 45
      };

      const result = component['setOptionLine']();
      expect(result.xAxis.axisLabel.rotate).toBe(45);
    });

    it('should adjust grid top when dataLabel.fixed is true', () => {
      component.dataLabel = { fixed: true };
      component.options = { axis: {} };

      const result = component['setOptionLine']();
      expect(result.grid.top).toBe(20);
    });

    it('should not adjust grid top when dataLabel.fixed is true but maxRange is set', () => {
      component.dataLabel = { fixed: true };
      component.options = { axis: { maxRange: 100 } };

      const result = component['setOptionLine']();
      expect(result.grid.top).toBe(8);
    });

    it('should set fontSize to 12 when --font-size-grid is not defined', () => {
      spyOn<any>(component, 'resolvePx').and.callFake(variable => (variable === '--font-size-grid' ? undefined : 10));

      spyOn<any>(component, 'getCSSVariable').and.returnValue('');

      const options = (component as any).setOptionLine();

      expect(options.xAxis.axisLabel.fontSize).toBe(12);
      expect(options.yAxis.axisLabel.fontSize).toBe(12);
    });
  });

  describe('setSeries:', () => {
    let mockSeriesWithColor: Array<PoChartSerie>;

    beforeEach(() => {
      mockSeriesWithColor = [
        { label: 'Serie 1', data: [1, 2, 3], type: PoChartType.Column, color: 'po-color-01' },
        { label: 'Serie 2', data: [4, 5, 6], type: PoChartType.Line, color: 'po-color-02' },
        { label: 'Serie 3', data: [7, 8, 9], color: '#123456' }
      ];

      spyOn(colorService, 'getColors').and.callFake((series: Array<any>) => series);

      window.getComputedStyle = () =>
        ({
          getPropertyValue: (prop: string) => {
            const values: { [key: string]: string } = {
              '--color-01': '#0000ff',
              '--color-02': '#00ff00',
              '--color-neutral-light-00': '#ffffff',
              '--border-width-md': '2px'
            };
            return values[prop] || '';
          }
        }) as CSSStyleDeclaration;
    });

    it('should transform series correctly with default configurations', () => {
      component.series = mockSeriesWithColor;
      component.type = PoChartType.Column;
      component.options = {};

      const result = component['setSeries']();

      expect(result.length).toBe(3);
      expect(result[0].type).toBe('bar');
      expect(result[0].name).toBe('Serie 1');
      expect(result[0].itemStyle.color).toBe('#0000ff');
      expect(result[1].type).toBe('line');
      expect(result[2].type).toBeUndefined();
    });

    it('should handle color variables and direct color values correctly', () => {
      component.series = mockSeriesWithColor;

      const result = component['setSeries']();
      expect(result[0].itemStyle.color).toBe('#0000ff');
      expect(result[2].itemStyle.color).toBe('#123456');
    });

    it('should set emphasis styles correctly', () => {
      component.series = mockSeriesWithColor;

      const result = component['setSeries']();
      expect(result[0].emphasis.itemStyle.color).toBe('#0000ff');
      expect(result[0].emphasis.itemStyle.borderWidth).toBe(2);
    });

    it('should handle dataLabel.fixed configuration', () => {
      component.series = mockSeriesWithColor;
      component.dataLabel = { fixed: true };

      const result = component['setSeries']();
      expect(result[0].label.show).toBeTrue();
      expect(result[0].emphasis.focus).toBe('series');
    });

    it('should handle line series with fillPoints option', () => {
      component.series = mockSeriesWithColor;
      component.type = PoChartType.Line;
      component.options = { fillPoints: true };

      const result = component['setSeries']();
      expect(result[1].itemStyle.color).toBe('#00ff00');
    });

    it('should handle line series without fillPoints option', () => {
      component.series = mockSeriesWithColor;
      component.type = PoChartType.Line;
      component.options = { fillPoints: false };

      const result = component['setSeries']();
      expect(result[1].itemStyle.color).toBe('#ffffff');
      expect(result[1].lineStyle.color).toBe('#00ff00');
    });
  });

  describe('setTableProperties:', () => {
    beforeEach(() => {
      component['chartInstance'] = {
        getOption: jasmine.createSpy('getOption').and.returnValue({
          xAxis: [{ data: ['Jan', 'Fev', 'Mar'] }],
          series: [
            { name: 'Série 1', data: [10, 20, 30] },
            { name: 'Série 2', data: [40, 50, 60] }
          ]
        })
      } as any;
      spyOn(component as any, 'setTableColumns');
    });
    it('should correctly populate itemsTable with series data', () => {
      component['setTableProperties']();

      expect(component['itemsTable']).toEqual([
        { serie: 'Série 1', Jan: 10, Fev: 20, Mar: 30 },
        { serie: 'Série 2', Jan: 40, Fev: 50, Mar: 60 }
      ]);
      expect((component as any).setTableColumns).toHaveBeenCalledWith(jasmine.any(Object));
    });
  });

  describe('setTableColumns:', () => {
    it('should correctly set columnsTable based on categories and use default label when firstColumnName is undefined', () => {
      const option = { xAxis: [{ data: ['Jan', 'Fev', 'Mar'] }] };
      component.options = {} as any;

      (component as any).setTableColumns(option);

      expect(component['columnsTable']).toEqual([
        { property: 'serie', label: 'Série' },
        { property: 'Jan', label: 'Jan' },
        { property: 'Fev', label: 'Fev' },
        { property: 'Mar', label: 'Mar' }
      ]);
    });
  });

  describe('downloadCsv:', () => {
    beforeEach(() => {
      spyOn(URL, 'createObjectURL').and.returnValue('blob:url');
      spyOn(URL, 'revokeObjectURL');
      spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'a') {
          return {
            click: jasmine.createSpy('click'),
            setAttribute: jasmine.createSpy('setAttribute'),
            href: '',
            download: ''
          } as unknown as HTMLAnchorElement;
        }
        return document.createElement(tag);
      });
      spyOn(document.body, 'appendChild');
      spyOn(document.body, 'removeChild');
    });

    it('should generate and download a CSV file correctly, using default values when necessary', () => {
      component['itemsTable'] = [
        { serie: 'Série 1', valor1: 10, valor2: undefined },
        { serie: 'Série 2', valor1: 30 }
      ];
      component.options = {} as any;

      component['downloadCsv']();

      const expectedCsv = '\ufeffSérie;valor1;valor2\nSérie 1;10;\nSérie 2;30;';

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('exportImage:', () => {
    it('should not execute if chartInstance is undefined', () => {
      spyOn<any>(component, 'exportImage').and.callThrough();

      (component as any)['chartInstance'] = undefined;
      (component as any)['exportImage']('png');

      expect(component['exportImage']).toHaveBeenCalledWith('png');
      expect((component as any)['chartInstance']).toBeUndefined();
    });

    it('should call createImage with correct parameters when chartInstance is defined', () => {
      const mockChartInstance = {
        getDataURL: jasmine.createSpy('getDataURL').and.returnValue('mockImageData')
      };

      const mockImage = new Image();
      spyOn(window, 'Image').and.returnValue(mockImage);
      spyOn<any>(component, 'createImage');

      (component as any).chartInstance = mockChartInstance;
      (component as any).exportImage('jpeg');

      expect(mockChartInstance.getDataURL).toHaveBeenCalledWith({
        type: 'jpeg',
        pixelRatio: 2,
        backgroundColor: 'white'
      });
      expect(component['createImage']).toHaveBeenCalledWith('jpeg', mockImage);
    });
  });

  describe('createImage:', () => {
    it('should stop execution if the canvas context is null', () => {
      const mockImage = new Image();
      const canvas = document.createElement('canvas');
      spyOn(canvas, 'getContext').and.returnValue(null);

      spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'canvas') return canvas;
        return document.createElement(tag);
      });

      spyOn<any>(component, 'setHeaderProperties');

      component['createImage']('png', mockImage);

      mockImage.onload?.(new Event('load'));

      expect(component['setHeaderProperties']).not.toHaveBeenCalled();
    });

    it('should create and download a PNG image correctly', done => {
      const chartElement = document.createElement('div');
      chartElement.style.width = '800px';
      chartElement.style.height = '600px';

      const headerElement = document.createElement('div');
      headerElement.style.height = '50px';

      const mockImage = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      spyOn(canvas, 'getContext').and.returnValue(ctx);

      const link = document.createElement('a');
      spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'canvas') return canvas;
        if (tag === 'a') return link;
        return document.createElement(tag);
      });

      spyOn(canvas, 'toDataURL').and.returnValue('data:image/png;base64,fakeImageData');
      spyOn(link, 'click');

      component['createImage']('png', mockImage);

      setTimeout(() => {
        mockImage.onload?.(new Event('load'));
      }, 0);

      setTimeout(() => {
        try {
          expect(link.href).toBe('data:image/png;base64,fakeImageData');
          expect(link.download).toBe('grafico_com_legenda.png');
          expect(link.click).toHaveBeenCalled();
          done();
        } catch (error) {
          done.fail(error);
        }
      }, 50);
    });
  });

  describe('setHeaderProperties:', () => {
    it('should set header properties correctly with custom title', () => {
      const ctx = jasmine.createSpyObj('CanvasRenderingContext2D', ['fillRect', 'fillText']);
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('po-chart-header');
      const titleElement = document.createElement('strong');
      titleElement.innerText = 'Custom Title';
      headerDiv.appendChild(titleElement);

      spyOn(headerDiv, 'querySelector').and.returnValue(titleElement);

      component['setHeaderProperties'](ctx, headerDiv, 300, 50);

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 300, 50);
      expect(ctx.fillText).toHaveBeenCalledWith('Custom Title', 20, 50 / 2 + 5);
    });

    it('should set header properties correctly with default title', () => {
      const ctx = jasmine.createSpyObj('CanvasRenderingContext2D', ['fillRect', 'fillText']);
      const headerDiv = document.createElement('div');
      headerDiv.classList.add('po-chart-header');

      spyOn(headerDiv, 'querySelector').and.returnValue(null);

      component['setHeaderProperties'](ctx, headerDiv, 300, 50);

      expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 300, 50);
      expect(ctx.fillText).toHaveBeenCalledWith('Gráfico', 20, 50 / 2 + 5);
    });
  });

  describe('resolvePx:', () => {
    it('should return the numeric value when token ends with px', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('20px');

      const result = (component as any).resolvePx('--border-width-sm');

      expect(result).toBe(20);
    });

    it('should convert rem to pixels correctly', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('2rem');

      const result = (component as any).resolvePx('--font-size-grid');

      expect(result).toBe(32);
    });

    it('should use default font size of 16px if parent font size is undefined', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('2em');
      spyOn(document, 'querySelector').and.returnValue(null);
      spyOn(window, 'getComputedStyle').and.returnValue({ fontSize: '16px' } as CSSStyleDeclaration);

      const result = (component as any).resolvePx('2em');

      expect(result).toBe(32);
    });

    it('should convert em to pixels based on parent element font-size', () => {
      const mockParentElement = document.createElement('div');
      mockParentElement.style.fontSize = '18px';

      spyOn<any>(component, 'getCSSVariable').and.returnValue('1.5em');
      spyOn(document, 'querySelector').and.returnValue(mockParentElement);
      spyOn(window, 'getComputedStyle').and.returnValue({ fontSize: '18px' } as CSSStyleDeclaration);

      const result = (component as any).resolvePx('--some-size', '.some-selector');

      expect(result).toBe(27);
    });

    it('should return default 16px when em is used but parent element is not found', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('1.5em');
      spyOn(document, 'querySelector').and.returnValue(null);

      const result = (component as any).resolvePx('--some-size');

      expect(result).toBe(24);
    });

    it('should default to 16px when getComputedStyle does not return fontSize', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('1.5em');
      spyOn(document, 'querySelector').and.returnValue(null);

      const result = (component as any).resolvePx('--some-size', '.some-selector');
      expect(result).toBe(24);
    });
  });

  describe('setPopupActions:', () => {
    let initialPopupActions: Array<any>;

    beforeEach(() => {
      initialPopupActions = [...(component['popupActions'] || [])];
    });

    it('should not modify popupActions if customActions is undefined', () => {
      component['customActions'] = undefined;

      component['setPopupActions']();

      expect(component['popupActions']).toEqual(initialPopupActions);
    });

    it('should not modify popupActions if customActions is null', () => {
      component['customActions'] = null;

      component['setPopupActions']();

      expect(component['popupActions']).toEqual(initialPopupActions);
    });

    it('should add customActions to popupActions', () => {
      const mockActions = [{ label: 'Ação 1', action: jasmine.createSpy('action1') }];
      component['customActions'] = mockActions;

      component['setPopupActions']();

      expect(component['popupActions']).toEqual([...initialPopupActions, ...mockActions]);
    });

    it('should maintain existing popupActions while adding customActions', () => {
      const newActions = [{ label: 'Nova Ação', action: jasmine.createSpy('actionNew') }];
      component['customActions'] = newActions;

      component['setPopupActions']();

      expect(component['popupActions']).toEqual([...initialPopupActions, ...newActions]);
    });
  });
});

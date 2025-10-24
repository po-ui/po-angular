import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ElementRef, NO_ERRORS_SCHEMA, SimpleChanges, ViewContainerRef } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { EChartsType } from 'echarts/core';
import { PoTooltipModule } from '../../directives';
import { PoColorService } from '../../services/po-color/po-color.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoChartLabelFormat } from '../po-chart/enums/po-chart-label-format.enum';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoChartOptions } from '../po-chart/interfaces/po-chart-options.interface';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoChartBaseComponent } from './po-chart-base.component';
import { PoChartComponent } from './po-chart.component';
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
export function createMockElementRef(querySelectorFn?: (selector: string) => any): ElementRef {
  return {
    nativeElement: {
      querySelector: querySelectorFn || (() => null)
    }
  } as ElementRef;
}
describe('PoChartComponent', () => {
  let component: PoChartComponent;
  let fixture: ComponentFixture<PoChartComponent>;
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
      paddingLeft: 16,
      labelType: PoChartLabelFormat.Number
    },
    legend: true,
    dataZoom: true
  };
  let mockVcr: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(waitForAsync(() => {
    mockVcr = jasmine.createSpyObj('ViewContainerRef', ['clear', 'createComponent']);

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, PoTooltipModule],
      declarations: [PoChartComponent],
      providers: [
        CurrencyPipe,
        DecimalPipe,
        PoColorService,
        PoLanguageService,
        { provide: PoChartBaseComponent, useValue: {} },
        { provide: ElementRef, useValue: createMockElementRef },
        { provide: ViewContainerRef, useValue: mockVcr },
        provideHttpClient(),
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    window['echarts'] = {
      init: () => new EChartsMock()
    } as any;

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

  let querySelectorSpy: jasmine.Spy;

  beforeEach(() => {
    fixture = TestBed.createComponent(PoChartComponent);
    component = fixture.componentInstance;
    colorService = TestBed.inject(PoColorService);

    component.series = mockSeries;
    component.categories = mockCategories;
    component.options = mockOptions;
    component.height = 400;

    const headerElement = document.createElement('div');
    headerElement.style.height = '50px';
    const descriptionElement = document.createElement('div');
    descriptionElement.style.height = '50px';
    const chartDiv = document.createElement('div');
    chartDiv.id = 'chart-id';
    Object.defineProperty(chartDiv, 'clientWidth', { value: 800 });
    Object.defineProperty(chartDiv, 'clientHeight', { value: 400 });

    fixture.nativeElement.appendChild(chartDiv);

    querySelectorSpy = spyOn(component['el'].nativeElement, 'querySelector').and.callFake((selector: string) => {
      if (selector === '#chart-id') {
        return chartDiv;
      }
      if (selector === '.po-chart-header') {
        return headerElement;
      }
      if (selector === '.description-chart') {
        return descriptionElement;
      }
      if (selector === '.po-chart-container') {
        return { offsetLeft: 0, offsetTop: 0 };
      }
      return null;
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    if (querySelectorSpy) {
      querySelectorSpy.and.callThrough();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('showTooltipTitle: should show tooltip only when content overflows', () => {
    const event: any = {
      target: document.createElement('div')
    };

    const element = event.target as HTMLElement;

    // Simula overflow
    Object.defineProperty(element, 'scrollWidth', { value: 150, configurable: true });
    Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });

    component.title = 'Long Title';
    component.showTooltipTitle(event);
    expect(component['tooltipTitle']).toBe('Long Title');

    // Simula conteúdo sem overflow
    Object.defineProperty(element, 'scrollWidth', { value: 80 });
    Object.defineProperty(element, 'offsetWidth', { value: 100 });

    component.showTooltipTitle(event);
    expect(component['tooltipTitle']).toBeUndefined();
  });

  it('showTooltipDescription: should show tooltip description text only when content overflows', () => {
    const event: any = {
      target: document.createElement('div')
    };

    const element = event.target as HTMLElement;

    // Simula overflow
    Object.defineProperty(element, 'scrollWidth', { value: 150, configurable: true });
    Object.defineProperty(element, 'offsetWidth', { value: 100, configurable: true });

    component.options = {
      descriptionChart: 'Long Title'
    };
    component.showTooltipDescription(event);
    expect(component['tooltipDescriptionGauge']).toBe('Long Title');

    // Simula conteúdo sem overflow
    Object.defineProperty(element, 'scrollWidth', { value: 80 });
    Object.defineProperty(element, 'offsetWidth', { value: 100 });

    component.showTooltipDescription(event);
    expect(component['tooltipDescriptionGauge']).toBeUndefined();
  });

  it('should update heights and call detectChanges and resize when heights are different', () => {
    const headerEl = { clientHeight: 100 } as HTMLDivElement;
    const descEl = { clientHeight: 50 } as HTMLDivElement;

    querySelectorSpy.and.callFake((selector: string) => (selector === '.po-chart-header' ? headerEl : descEl));

    component['headerHeight'] = 0;
    component['descriptionHeight'] = 0;
    component.options = { descriptionChart: 'test' };

    spyOn(component['cdr'], 'detectChanges');
    component['chartInstance'] = {
      resize: jasmine.createSpy('resize')
    } as any;

    component['setHeightProperties']();

    expect(component['headerHeight']).toBe(100);
    expect(component['descriptionHeight']).toBe(50);
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
    expect(component['chartInstance'].resize).toHaveBeenCalled();
  });

  it('should update heights and call detectChanges and resize when only headerHeight is different', () => {
    const headerEl = { clientHeight: 100 } as HTMLDivElement;
    const descEl = {} as HTMLDivElement;

    component.options = { descriptionChart: 'test' };
    querySelectorSpy.and.callFake((selector: string) => {
      if (selector === '.po-chart-header') return headerEl;
      if (selector === '.description-chart') return descEl;
      return null;
    });

    component['headerHeight'] = 0;
    component['descriptionHeight'] = 40;

    spyOn(component['cdr'], 'detectChanges');
    component['chartInstance'] = {
      resize: jasmine.createSpy('resize')
    } as any;

    component['setHeightProperties']();

    expect(component['headerHeight']).toBe(100);
    expect(component['descriptionHeight']).toBe(0);
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
    expect(component['chartInstance'].resize).toHaveBeenCalled();
  });

  it('should update heights and call detectChanges and resize when only descriptionHeight is different', () => {
    const headerEl = {} as HTMLDivElement;
    const descEl = { clientHeight: 50 } as HTMLDivElement;

    querySelectorSpy.and.callFake((selector: string) => {
      if (selector === '.po-chart-header') return headerEl;
      if (selector === '.description-chart') return descEl;
      return null;
    });
    component.options = { descriptionChart: 'test' };

    component['headerHeight'] = undefined;
    component['descriptionHeight'] = 0;

    spyOn(component['cdr'], 'detectChanges');
    component['chartInstance'] = {
      resize: jasmine.createSpy('resize')
    } as any;

    component['setHeightProperties']();

    expect(component['headerHeight']).toBe(0);
    expect(component['descriptionHeight']).toBe(50);
    expect(component['cdr'].detectChanges).toHaveBeenCalled();
    expect(component['chartInstance'].resize).toHaveBeenCalled();
  });

  describe('showHeader', () => {
    const testCases = [
      {
        title: 'Título definido',
        input: {
          title: 'Meu título',
          options: { header: { hideTableDetails: true, hideExpand: true } },
          showPopup: false
        },
        expected: true
      },
      {
        title: 'hideTableDetails = false',
        input: {
          title: undefined,
          options: { header: { hideTableDetails: false, hideExpand: true } },
          showPopup: false
        },
        expected: true
      },
      {
        title: 'hideExpand = false',
        input: {
          title: undefined,
          options: { header: { hideTableDetails: true, hideExpand: false } },
          showPopup: false
        },
        expected: true
      },
      {
        title: 'showPopup = true',
        input: {
          title: undefined,
          options: { header: { hideTableDetails: true, hideExpand: true } },
          showPopup: true
        },
        expected: true
      },
      {
        title: 'Todos falsos',
        input: {
          title: undefined,
          options: { header: { hideTableDetails: true, hideExpand: true } },
          showPopup: false
        },
        expected: false
      }
    ];

    testCases.forEach(({ title, input, expected }) => {
      it(`should return ${expected} when ${title}`, () => {
        component.title = input.title;
        component.options = input.options;
        component.showPopup = input.showPopup;

        expect(!!component.showHeader).toBe(expected);
      });
    });
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

    describe('observeContainerResize', () => {
      it('resized function is called when element is resized', () => {
        spyOn(component, <any>'setChartsProperties');

        component['resizeObserver'] = {
          disconnect: jasmine.createSpy('disconnect'),
          observe: jasmine.createSpy('observe')
        } as any;
        component['series'] = [{}];
        component['observeContainerResize']();

        expect(component['setChartsProperties']).not.toHaveBeenCalled();
      });

      it('not call resize if not have series', () => {
        const chartMock = new EChartsMock();
        component['chartInstance'] = chartMock as any;
        component['series'] = undefined;
        component['observeContainerResize']();

        expect(component['chartInstance'].resize).not.toHaveBeenCalled();
      });
    });

    it('should handle PoUiThemeChange event by disposing and reinitializing the chart', () => {
      const disposeSpy = jasmine.createSpy('dispose');
      const initEChartsSpy = spyOn(component as any, 'initECharts');
      const checkShowCEchartsSpy = spyOn(component as any, 'checkShowCEcharts');

      component['chartInstance'] = { dispose: disposeSpy } as any;

      window.dispatchEvent(new CustomEvent('PoUiThemeChange'));

      expect(disposeSpy).toHaveBeenCalled();
      expect(component['chartInstance']).toBeUndefined();
      expect(initEChartsSpy).toHaveBeenCalled();
      expect(checkShowCEchartsSpy).toHaveBeenCalled();
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

      const disposeSpy = jasmine.createSpy('dispose');
      component['chartInstance'] = { dispose: disposeSpy } as any;

      component.options = newOptions;
      component.ngOnChanges({
        options: {
          currentValue: newOptions,
          previousValue: mockOptions,
          firstChange: false
        }
      } as any);

      expect(disposeSpy).toHaveBeenCalled();
    });
  });

  describe('openModal', () => {
    it('should call createComponent and open modal', async () => {
      const setTablePropertiesSpy = spyOn(component as any, 'setTableProperties');
      component['chartInstance'] = undefined;
      await component.openModal();

      expect(setTablePropertiesSpy).not.toHaveBeenCalled();
    });

    it('should call createComponent and open modal', async () => {
      const setTablePropertiesSpy = spyOn(component as any, 'setTableProperties');
      (component as any).vcr = mockVcr;
      component['chartInstance'] = {} as any;

      component['title'] = 'Título';
      component['columnsTable'] = [];
      component['itemsTable'] = [];

      const mockModalInstance = {
        modalComponent: { open: jasmine.createSpy('open') }
      };

      const mockComponentRef = {
        setInput: jasmine.createSpy('setInput'),
        instance: mockModalInstance
      };

      mockVcr.createComponent.and.returnValue(mockComponentRef as any);

      await component.openModal();

      expect(mockVcr.clear).toHaveBeenCalled();
      expect(mockVcr.createComponent).toHaveBeenCalled();
      expect(setTablePropertiesSpy).toHaveBeenCalled();
      expect(mockComponentRef.setInput).toHaveBeenCalledWith('title', 'Título');
      expect(mockModalInstance.modalComponent.open).toHaveBeenCalled();
    });
  });

  describe('toggleExpand', () => {
    beforeEach(() => {
      component['chartInstance'] = new EChartsMock() as Partial<EChartsType> as EChartsType;
      component['headerHeight'] = 50;
      component.height = 400;
    });

    it('should expand the chart with 100% radius when isTypeGauge is true and innerWidth < 1366', fakeAsync(() => {
      const mockChart = {
        resize: jasmine.createSpy('resize'),
        getOption: jasmine.createSpy('getOption').and.returnValue({
          series: [{ radius: '80%' }]
        }),
        setOption: jasmine.createSpy('setOption')
      };

      component['chartInstance'] = mockChart as Partial<EChartsType> as EChartsType;
      component.height = 400;
      component['headerHeight'] = 50;
      component['isExpanded'] = false;
      component['isTypeGauge'] = true;

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 800
      });

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      });

      component.toggleExpand();

      expect(component['originalRadiusGauge']).toBe('80%');
      expect(mockChart.setOption).toHaveBeenCalledWith({
        series: [{ radius: '100%' }]
      });

      flush();
      expect(mockChart.resize).toHaveBeenCalled();
    }));

    it('should collapse the chart and restore original gauge radius when isTypeGauge is true and innerWidth < 1366', fakeAsync(() => {
      const originalRadius = '75%';
      const mockChart = {
        resize: jasmine.createSpy('resize'),
        getOption: jasmine.createSpy('getOption').and.returnValue({ series: [{ radius: originalRadius }] }),
        setOption: jasmine.createSpy('setOption')
      };

      component['chartInstance'] = mockChart as Partial<EChartsType> as EChartsType;
      component['isExpanded'] = true;
      component['isTypeGauge'] = true;
      component['originalHeight'] = 400;
      component.height = 800;
      component['originalRadiusGauge'] = originalRadius;

      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200
      });

      component.toggleExpand();

      expect(mockChart.setOption).toHaveBeenCalledWith({
        series: [{ radius: originalRadius }]
      });

      flush();
      expect(mockChart.resize).toHaveBeenCalled();
    }));

    it('should collapse the chart and restore original properties', fakeAsync(() => {
      const mockChartInstance = {
        resize: jasmine.createSpy('resize'),
        dispose: jasmine.createSpy('dispose'),
        clear: jasmine.createSpy('clear'),
        getDataURL: jasmine.createSpy('getDataURL'),
        on: jasmine.createSpy('on')
      };
      component['chartInstance'] = mockChartInstance as Partial<EChartsType> as EChartsType;
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

  describe('checkShowCEcharts', () => {
    it('should call initECharts and disconnect observer when element is visible and hideDomEchartsDiv is true', () => {
      const chartElement = document.createElement('div');
      chartElement.id = 'chart-id';

      (component['el'].nativeElement.querySelector as jasmine.Spy).and.returnValue(chartElement);
      component['hideDomEchartsDiv'] = true;

      spyOn(component as any, 'initECharts');

      const observeSpy = jasmine.createSpy('observe');
      const disconnectSpy = jasmine.createSpy('disconnect');

      let callback: (entries: Array<IntersectionObserverEntry>) => void;

      (window as any).IntersectionObserver = function (cb: any) {
        callback = cb;
        return {
          observe: observeSpy,
          disconnect: disconnectSpy
        };
      };

      (component as any).checkShowCEcharts();

      callback([{ isIntersecting: true }] as any);

      expect((component as any).initECharts).toHaveBeenCalled();
      expect(observeSpy).toHaveBeenCalledWith(chartElement);
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  it('should set showPopup to false when hideExportCsv, hideExportImage are true and there are no customActions', () => {
    component['options'] = {
      header: {
        hideExportCsv: true,
        hideExportImage: true
      },
      showContainerGauge: true
    };

    component['customActions'] = [];

    (component as any).setInitialPopupActions();

    expect(component['showPopup']).toBeFalse();
    expect(component['paddingContainerGauge']).toBe(16);
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

    it('should set categories to undefined when it is an empty array', () => {
      component['categories'] = [];
      component['series'] = [{ label: 'Série 1', data: [1, 2, 3] }];
      component['chartInstance'] = {
        setOption: jasmine.createSpy('setOption')
      } as any;

      spyOn(component as any, 'setOptions').and.returnValue({});
      spyOn(component['cdr'], 'detectChanges');

      (component as any).setChartsProperties();

      expect(component['categories']).toBeUndefined();
    });

    it('should dispose chartInstance and return early when series is empty', () => {
      const disposeSpy = jasmine.createSpy('dispose');

      component['categories'] = ['A', 'B'];
      component['series'] = [];
      component['chartInstance'] = {
        dispose: disposeSpy
      } as any;

      (component as any).setChartsProperties();

      expect(disposeSpy).toHaveBeenCalled();
      expect(component['chartInstance']).toBeUndefined();
    });

    it('should emit seriesClick event when clicking on the chart', () => {
      const onSpy = jasmine.createSpy('on');

      component['chartInstance'] = {
        on: onSpy
      } as any;

      spyOn(component.seriesClick, 'emit');
      spyOn(component.seriesHover, 'emit');

      component['initEChartsEvents']();

      expect(onSpy).toHaveBeenCalledWith('click', jasmine.any(Function));

      const clickCallback = onSpy.calls.argsFor(0)[1];

      const mockParams = { seriesName: 'Exemplo', value: 100, name: 'Categoria X' };
      clickCallback(mockParams);

      const mouseoverCallback = onSpy.calls.argsFor(1)[1];
      const mockParamsMouse = {};
      mouseoverCallback(mockParamsMouse);

      expect(component.seriesClick.emit).toHaveBeenCalledWith({
        label: 'Exemplo',
        data: 100,
        category: 'Categoria X'
      });

      expect(component.seriesHover.emit).not.toHaveBeenCalled();
    });

    it('should call setTooltipProperties and emit seriesHover with name as label when seriesName is not present or contains \\u00000', () => {
      const tooltipElement = document.createElement('div');
      tooltipElement.id = 'custom-tooltip';
      document.body.appendChild(tooltipElement);

      (component['el'].nativeElement.querySelector as jasmine.Spy).and.callFake(selector =>
        selector === '#custom-tooltip' ? tooltipElement : null
      );

      const setTooltipSpy = spyOn<any>(component, 'setTooltipProperties');

      const seriesHoverSpy = spyOn(component.seriesHover, 'emit');

      const chartMock = new EChartsMock();
      component['chartInstance'] = chartMock as any;

      component['initEChartsEvents']();

      const mouseoverCallback = chartMock.on.calls.allArgs().find(([event]) => event === 'mouseover')[1];

      const params = {
        value: 123,
        name: 'Categoria Y',
        seriesType: 'line',
        seriesName: '\u00000 Serie inválida',
        event: { offsetX: 0, offsetY: 0 }
      };

      mouseoverCallback(params);

      expect(setTooltipSpy).toHaveBeenCalledWith(tooltipElement, params);
      expect(seriesHoverSpy).toHaveBeenCalledWith({ label: 'Categoria Y', data: 123 });
    });

    it('should emit seriesClick event when clicking on the chart', () => {
      const onSpy = jasmine.createSpy('on');
      component['chartInstance'] = { on: onSpy } as Partial<EChartsType> as EChartsType;

      spyOn(component.seriesClick, 'emit');
      spyOn(component.seriesHover, 'emit');

      component['initEChartsEvents']();

      expect(onSpy).toHaveBeenCalledWith('click', jasmine.any(Function));

      const clickCallback = onSpy.calls.argsFor(0)[1];
      const mockParams = { seriesName: 'Exemplo', value: 100, name: 'Categoria X' };
      clickCallback(mockParams);

      const mouseoverCallback = onSpy.calls.argsFor(1)[1];
      const mockParamsMouse = {};
      mouseoverCallback(mockParamsMouse);

      expect(component.seriesClick.emit).toHaveBeenCalledWith({
        label: 'Exemplo',
        data: 100,
        category: 'Categoria X'
      });
      expect(component.seriesHover.emit).not.toHaveBeenCalled();
    });

    it('should emit seriesClick event when clicking on the chart if params.seriesName is undefined', () => {
      const onSpy = jasmine.createSpy('on');
      component['chartInstance'] = { on: onSpy } as Partial<EChartsType> as EChartsType;

      spyOn(component.seriesClick, 'emit');
      spyOn(component.seriesHover, 'emit');

      component['initEChartsEvents']();

      expect(onSpy).toHaveBeenCalledWith('click', jasmine.any(Function));

      const clickCallback = onSpy.calls.argsFor(0)[1];
      const mockParams = { value: 100, name: 'Name X' };
      clickCallback(mockParams);

      const mouseoverCallback = onSpy.calls.argsFor(1)[1];
      const mockParamsMouse = {};
      mouseoverCallback(mockParamsMouse);

      expect(component.seriesClick.emit).toHaveBeenCalledWith({
        label: 'Name X',
        data: 100
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

      const onSpy = jasmine.createSpy('on');
      component['chartInstance'] = { on: onSpy } as Partial<EChartsType> as EChartsType;

      spyOn(component.seriesHover, 'emit');
      spyOn(component.seriesClick, 'emit');

      component.series = [{ tooltip: 'test', label: 'Brazil', data: [35, 32, 25, 29, 33, 33], color: 'color-10' }];

      component['initEChartsEvents']();

      expect(onSpy).toHaveBeenCalledWith('mouseover', jasmine.any(Function));

      const mouseoverCallback = onSpy.calls.argsFor(1)[1];

      const mockParams = {
        seriesName: 'Exemplo',
        value: 150,
        name: 'Categoria Y',
        seriesType: 'line',
        seriesIndex: 0,
        event: { offsetX: 10, offsetY: 20 }
      };
      mouseoverCallback(mockParams);

      const mockParamsBar = {
        seriesName: 'Exemplo',
        value: 100,
        name: 'Categoria X',
        seriesType: 'bar',
        seriesIndex: 0,
        event: { offsetX: 10, offsetY: 20 }
      };
      mouseoverCallback(mockParamsBar);

      expect(component['positionTooltip']).toBe('top');

      const clickCallback = onSpy.calls.argsFor(0)[1];
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
      const onSpy = jasmine.createSpy('on');
      component['chartInstance'] = { on: onSpy } as Partial<EChartsType> as EChartsType;

      spyOn(component.poTooltip.last, 'toggleTooltipVisibility');

      component['initEChartsEvents']();

      expect(onSpy).toHaveBeenCalledWith('mouseout', jasmine.any(Function));

      const mouseoutCallback = onSpy.calls.argsFor(2)[1];
      mouseoutCallback();

      expect(component.poTooltip.last.toggleTooltipVisibility).toHaveBeenCalledWith(false);
    });
  });

  describe('parseTooltipText', () => {
    it('should return the same value when text is undefined', () => {
      const result = (component as any).parseTooltipText(undefined);
      expect(result).toBeUndefined();
    });

    it('should return the same value when text is null', () => {
      const result = (component as any).parseTooltipText(null);
      expect(result).toBeNull();
    });

    it('should return the same value when text is empty string', () => {
      const result = (component as any).parseTooltipText('');
      expect(result).toBe('');
    });

    it('should parse \\n into <br>', () => {
      const result = (component as any).parseTooltipText('linha1\nlinha2');
      expect(result).toBe('linha1<br>linha2');
    });

    it('should parse ** into <b>', () => {
      const result = (component as any).parseTooltipText('valor **negrito** aqui');
      expect(result).toBe('valor <b>negrito</b> aqui');
    });

    it('should parse __ into <i>', () => {
      const result = (component as any).parseTooltipText('um __itálico__ aqui');
      expect(result).toBe('um <i>itálico</i> aqui');
    });
  });

  describe('resolveCustomTooltip', () => {
    it('should call tooltip function when serie.tooltip is a function', () => {
      const params = {
        name: 'Jan',
        seriesName: 'Serie 1',
        value: 100,
        seriesIndex: 0,
        dataIndex: 0,
        seriesType: 'line'
      };

      const tooltipFn = jasmine.createSpy().and.returnValue('Custom **tooltip**\nValue: __100__');

      component.series = [{ label: 'Serie 1', data: [100], tooltip: tooltipFn }];

      const result = (component as any).resolveCustomTooltip(params, params.name, params.seriesName, params.value);

      expect(tooltipFn).toHaveBeenCalledWith(params);

      expect(result).toBe('Custom <b>tooltip</b><br>Value: <i>100</i>');
    });
  });

  describe('setTooltipProperties', () => {
    const divTooltipElement = document.createElement('div');

    it('should handle donut chart and custom tooltip cases', () => {
      component.series = [{}];

      component['itemsTypeDonut'] = [{ label: 'Jan', data: 1, valuePercentage: 20 }];

      const params = {
        value: 1,
        name: 'Jan',
        seriesName: 'Serie 1',
        seriesIndex: 0,
        dataIndex: 0,
        seriesType: 'pie',
        event: { offsetX: 150, offsetY: 250 }
      };

      component['setTooltipProperties'](divTooltipElement, params);
      expect(component['tooltipText']).toBe('<b>Jan</b><br>Serie 1: <b>20%</b>');

      component.series[0].tooltip = 'Custom tooltip';
      component['itemsTypeDonut'] = undefined;
      component['setTooltipProperties'](divTooltipElement, params);
      expect(component['tooltipText']).toBe('Custom tooltip');
    });

    it('should handle edge cases correctly', () => {
      component.series = [{}];

      component['setTooltipProperties'](divTooltipElement, {
        value: 2,
        name: ' ',
        seriesName: 'Serie\u00000',
        seriesIndex: 0,
        seriesType: 'bar',
        event: { offsetX: 50, offsetY: 75 }
      });
      expect(component['tooltipText'].replace(/\s+/g, '')).toBe(`${component.literals.item}:<b>2</b>`);

      component['setTooltipProperties'](divTooltipElement, {
        value: 3,
        name: 'Mar',
        seriesName: undefined,
        seriesIndex: 0,
        seriesType: 'bar',
        event: { offsetX: 80, offsetY: 90 }
      });
      expect(component['tooltipText'].replace(/\s+/g, '')).toBe('Mar:<b>3</b>');

      component['setTooltipProperties'](divTooltipElement, {
        value: 4,
        name: '2',
        seriesName: ' ',
        seriesIndex: 0,
        seriesType: 'bar',
        event: { offsetX: 120, offsetY: 180 }
      });
      expect(component['tooltipText'].replace(/\s+/g, '')).toBe(`<b>2</b><br>${component.literals.item}:<b>4</b>`);

      component['itemsTypeDonut'] = [{ label: 'Other', data: 99, valuePercentage: 50 }];
      component['setTooltipProperties'](divTooltipElement, {
        value: 4,
        name: 'Jan',
        seriesName: 'Serie 1',
        seriesIndex: 0,
        seriesType: 'bar',
        event: { offsetX: 120, offsetY: 180 }
      });
      expect(component['tooltipText'].replace(/\s+/g, '')).toBe('<b>Jan</b><br>Serie1:<b>0%</b>');

      component.series[0].tooltip = 'Custom tooltip para bar';
      component['setTooltipProperties'](divTooltipElement, {
        value: 10,
        name: 'Abr',
        seriesName: 'Serie 2',
        seriesIndex: 0,
        seriesType: 'bar',
        event: { offsetX: 100, offsetY: 100 }
      });
      expect(component['tooltipText']).toBe('Custom tooltip para bar');
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

  describe('setOptions:', () => {
    it('should return line chart options with correct default structure', () => {
      component.options = {};

      const result = component['setOptions']();

      expect(result).toBeDefined();
      expect(result.grid.top).toBe(16);
      expect(result.xAxis.type).toBe('category');
      expect(result.yAxis.type).toBe('value');
    });

    it('should apply dataZoom configuration when enabled', () => {
      component.options = { dataZoom: true };

      const result = component['setOptions']();
      expect(result.grid.top).toBe(56);
    });

    it('should apply text center in donut type when enabled', () => {
      component.listTypePieDonut = [
        {
          type: 'pie',
          center: ['50%', '46%'],
          radius: ['50%'],
          roseType: undefined,
          label: { show: false },
          emphasis: { focus: 'self' },
          data: [],
          blur: { itemStyle: { opacity: 0.4 } }
        }
      ];
      component['isTypeGauge'] = false;
      component['chartGridUtils'].textCenterDonut = {
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
      component['chartGridUtils'].isTypeDonut = true;
      component.options.textCenterGraph = 'test';

      const result = component['setOptions']();
      expect(result.graphic).toEqual(component['chartGridUtils'].textCenterDonut);
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

      const result = component['setOptions']();
      expect(result.yAxis.min).toBe(10);
      expect(result.yAxis.max).toBe(100);
      expect(result.yAxis.splitNumber).toBe(7);
      expect(result.grid.left).toBe(60);
      expect(result.xAxis.splitLine.show).toBeFalse();
      expect(result.yAxis.splitLine.show).toBeTrue();
    });

    it('should configure axes correctly when isTypeBar is true', () => {
      component.isTypeBar = true;

      component.options = {
        axis: {
          showXAxis: undefined,
          showYAxis: false
        }
      };

      component.categories = ['Jan', 'Feb', 'Mar'];

      const options: any = {};

      component['chartGridUtils'].setOptionsAxis(options);

      expect(options.xAxis.type).toBe('value');

      expect(options.xAxis.splitLine.show).toBeTrue();

      expect(options.yAxis.type).toBe('category');

      expect(options.yAxis.splitLine.show).toBeFalse();

      expect(options.yAxis.data).toEqual(['Jan', 'Feb', 'Mar']);
    });

    it('should apply number formatting when labelType is Number', () => {
      component.options.axis = {
        labelType: PoChartLabelFormat.Number
      };

      const result = component['setOptions']();
      expect(result.yAxis.axisLabel.formatter(100)).toBe('100.00');
    });

    it('should apply currency formatting when labelType is Currency', () => {
      component.options.axis = {
        labelType: PoChartLabelFormat.Currency
      };

      const result = component['setOptions']();
      expect(result.yAxis.axisLabel.formatter(100)).toBe('$100.00');
    });

    it('should rotate xAxis labels when rotateLegend is true', () => {
      component.options.axis = {
        rotateLegend: 45
      };

      const result = component['setOptions']();
      expect(result.xAxis.axisLabel.rotate).toBe(45);
    });

    it('should adjust grid top when dataLabel.fixed is true', () => {
      component.dataLabel = { fixed: true };
      component.options = { axis: {} };

      const result = component['setOptions']();
      expect(result.grid.top).toBe(32);
    });

    it('should not adjust grid top when dataLabel.fixed is true but maxRange is set', () => {
      component.dataLabel = { fixed: true };
      component.options = { axis: { maxRange: 100 } };

      const result = component['setOptions']();
      expect(result.grid.top).toBe(16);
    });

    it('should set fontSize to 12 when --font-size-grid is not defined', () => {
      spyOn<any>(component['chartGridUtils'], 'resolvePx').and.callFake(variable =>
        variable === '--font-size-grid' ? undefined : 10
      );

      spyOn<any>(component, 'getCSSVariable').and.returnValue('');

      const options = (component as any).setOptions();

      expect(options.xAxis.axisLabel.fontSize).toBe(12);
      expect(options.yAxis.axisLabel.fontSize).toBe(12);
    });

    it('should apply gauge options when isTypeGauge is true', () => {
      component['isTypeGauge'] = true;

      const mockOptions = {};
      const mockFontSize = 14;

      spyOn(component['chartGridUtils'], 'resolvePx').and.returnValue(mockFontSize);
      spyOn(component['chartGaugeUtils'], 'setGaugeOptions');

      spyOn<any>(component, 'setSeries').and.returnValue([]);

      const result = component['setOptions']();

      expect(component['chartGridUtils'].resolvePx).toHaveBeenCalledWith('--font-size-grid', '.po-chart');
      expect(component['chartGaugeUtils'].setGaugeOptions).toHaveBeenCalledWith(result, mockFontSize);
    });
  });

  describe('setShowAxisDetails: ', () => {
    it('should add tooltip with axisPointer when showAxisDetails is true', () => {
      component['options'] = {
        axis: {
          showAxisDetails: true
        }
      };
      spyOn(component, 'getCSSVariable').and.returnValue('#4a5c60');

      const options: any = {};

      component['chartGridUtils']['setShowAxisDetails'](options);

      expect(options.tooltip).toEqual({
        trigger: 'none',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#4a5c60'
          }
        }
      });
    });
  });

  it('should set splitNumber on xAxis when isTypeBar is true', () => {
    component.isTypeBar = true;
    component.options = {
      axis: {
        gridLines: 7,
        minRange: 0,
        maxRange: 100
      }
    };

    const options: any = {
      xAxis: {
        axisLabel: {}
      }
    };

    (component as any).formatLabelOption(options);

    expect(options.xAxis.splitNumber).toBe(7);
  });

  describe('setSeries:', () => {
    let mockSeriesWithColor: Array<PoChartSerie>;

    function mockGetPropertyValue(prop: string): string {
      const values: { [key: string]: string } = {
        '--color-01': '#0000ff',
        '--color-02': '#00ff00',
        '--color-neutral-light-00': '#ffffff',
        '--border-width-md': '2px'
      };
      return values[prop] || '';
    }

    function mockGetComputedStyle(): CSSStyleDeclaration {
      return {
        getPropertyValue: mockGetPropertyValue
      } as CSSStyleDeclaration;
    }

    beforeEach(() => {
      mockSeriesWithColor = [
        { label: 'Serie 1', data: [1, 2, 3], type: PoChartType.Column, color: 'po-color-01' },
        { label: 'Serie 2', data: [4, 5, 6], type: PoChartType.Line, color: 'po-color-02' },
        { label: 'Serie 3', data: [7, 8, 9], color: '#123456' },
        { data: [10, 11, 12], color: '#abcdef' }
      ];

      spyOn(colorService, 'getColors').and.callFake((series: Array<any>) => series);

      window.getComputedStyle = mockGetComputedStyle;
    });

    it('should transform series correctly with default configurations if not set type and data is Array', () => {
      component.series = [{ label: 'Serie 1', data: [1, 2, 3], color: 'po-color-01' }];
      component.options = {};

      const result = component['setSeries']();

      expect(result.length).toBe(1);
      expect(result[0].type).toBe('bar');
      expect(result[0].isTypeColumn).toBeTrue();
      expect(result[0].name).toBe('Serie 1');
    });

    it('should call getComputedStyle with document.documentElement and use its value for var(...) color', () => {
      const spyGetComputed = spyOn(window, 'getComputedStyle').and.returnValue({
        getPropertyValue: (prop: string) => '#112233'
      } as unknown as CSSStyleDeclaration);

      component.series = [{ label: 'Serie Var2', data: [1, 2], color: 'var(--color-test)' }];
      component.type = PoChartType.Column;
      component.options = {};

      const result = component['setSeries']();

      expect(spyGetComputed).toHaveBeenCalledWith(document.documentElement);

      const resolvedColor = result[0]?.emphasis?.itemStyle?.color || result[0]?.itemStyle?.color;
      expect(resolvedColor).toBe('#112233');
      expect(result[0]?.name).toBe('Serie Var2');
    });

    it('should transform series correctly with default configurations if not set type and data is not Array', () => {
      component.series = [
        { label: 'Serie 1', data: 90, color: 'po-color-01' },
        { label: 'Serie 2', data: 10, color: 'po-color-01' }
      ];
      component.options = {};

      const result = component['setSeries']();

      expect(result.length).toBe(1);
      expect(result[0].type).toBe('pie');
      expect(result[0].data[0].name).toBe('Serie 1');
      expect(result[0].data[1].name).toBe('Serie 2');
      expect(result[0].data.length).toBe(2);
    });

    it('should transform series correctly with default configurations', () => {
      component.series = mockSeriesWithColor;
      component.type = PoChartType.Column;
      component.options = {};

      const result = component['setSeries']();

      expect(result.length).toBe(4);
      expect(result[0].type).toBe('bar');
      expect(result[0].name).toBe('Serie 1');
      expect(result[0].itemStyle.color).toBe('#0000ff');
      expect(result[1].type).toBe('line');
      expect(result[2].type).toBe('bar');
      expect(result[3].name).toBe(' ');
    });

    it('should return all types charts', () => {
      component.series = [
        { label: 'Serie 1', data: [1, 2, 3], type: PoChartType.Column, color: 'po-color-01' },
        { label: 'Serie 2', data: [4, 5, 6], type: PoChartType.Line, color: 'po-color-02' },
        { label: 'Serie 3', data: [7, 10, 9], type: PoChartType.Bar },
        { label: 'Serie 4', data: [5, 11, 9] },
        { label: 'Serie 5', data: [4, 12, 10] },
        { label: 'Serie 6', data: [2, 7, 8] },
        { label: 'Serie 7', data: [5, 10, 6] },
        { label: 'Serie 8', data: [7, 8, 5] },
        { label: 'Serie 9', data: [7, 8, 9], type: PoChartType.Area }
      ];

      const result = component['setSeries']();
      expect(result[0].itemStyle.color).toBe('#0000ff');
      expect(result[8].areaStyle.opacity).toBe(0.5);
      expect(result[8].type).toBe('line');
      expect(result[2].type).toBe('bar');
      expect(result[1].symbolSize).toBe(8);
    });

    it('should return type area and type bar and color 01', () => {
      component.type = PoChartType.Bar;
      component.series = [
        { label: 'Serie 1', data: [7, 8, 9], type: PoChartType.Area, color: 'po-color-01' },
        { label: 'Serie 2', data: [5, 2, 1] }
      ];

      const result = component['setSeries']();
      expect(result[0].areaStyle.color).toBe('#0000ff');
      expect(result[0].areaStyle.opacity).toBeUndefined();
      expect(result[0].type).toBe('line');
      expect(result[1].type).toBe('bar');
    });

    it('should return type Donut if data is not valid', () => {
      component.type = PoChartType.Donut;
      component.series = [{ label: 'Serie 1', data: [7, 8, 9] }];

      const result = component['setSeries']();
      expect(result[0].type).toBe('pie');
    });

    it('should return type Donut', () => {
      component.type = PoChartType.Donut;
      component.series = [
        { label: 'Serie 1', data: 10 },
        { label: 'Serie 2', data: 30 }
      ];

      const result = component['setSeries']();
      expect(result[0].type).toBe('pie');
    });

    it('should return type Pie', () => {
      component.type = PoChartType.Pie;
      component.series = [{ label: 'Serie 1', data: [7, 8, 9] }];

      const result = component['setSeries']();
      expect(result[0].type).toBe('pie');
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
      expect(result[1].itemStyle.color).toBe('');
      expect(result[1].lineStyle.color).toBe('#00ff00');
    });

    it('should call setListTypeGauge and finalizeSerieTypeGauge when type is "gauge"', () => {
      component.type = PoChartType.Gauge;
      component.series = [{ label: 'A', data: [10] }];

      const resolvePxSpy = spyOn(component['chartGridUtils'], 'resolvePx').and.callFake(
        (key: string) =>
          ({
            '--font-size-md': 12,
            '--font-size-lg': 14,
            '--font-size-description-chart': 16
          })[key] || 0
      );

      const setListTypeGaugeSpy = spyOn(component['chartGaugeUtils'], 'setListTypeGauge').and.returnValue({
        processed: true
      });
      const finalizeSerieTypeGaugeSpy = spyOn(component['chartGaugeUtils'], 'finalizeSerieTypeGauge').and.returnValue([
        { name: 'Gauge' }
      ]);

      const result = component['setSeries']();

      expect(resolvePxSpy).toHaveBeenCalledWith('--font-size-md');
      expect(resolvePxSpy).toHaveBeenCalledWith('--font-size-lg');
      expect(resolvePxSpy).toHaveBeenCalledWith('--font-size-description-chart', 'po-chart');
      expect(setListTypeGaugeSpy).toHaveBeenCalledWith(
        {},
        {
          fontSizeMd: 12,
          fontSizeLg: 14,
          fontSizeSubtitle: 16
        }
      );
      expect(finalizeSerieTypeGaugeSpy).toHaveBeenCalledWith({ processed: true });
      expect(result).toEqual([{ name: 'Gauge' }]);
    });
  });

  describe('getPaddingBottomGrid', () => {
    it('should return 48 and set bottomDataZoom to 8 when dataZoom is true, bottomDataZoom is true, and legend is false', () => {
      component.options = {
        dataZoom: true,
        bottomDataZoom: true,
        legend: false
      };

      const result = component['chartGridUtils']['getPaddingBottomGrid']();

      expect(result).toBe(48);
      expect(component.options.bottomDataZoom).toBe(8);
    });

    it('should return 72 and set bottomDataZoom to 32 when dataZoom is true, bottomDataZoom is true and legendVerticalPosition is not "top"', () => {
      component.options = {
        dataZoom: true,
        bottomDataZoom: true,
        legendVerticalPosition: 'bottom'
      };

      const result = component['chartGridUtils']['getPaddingBottomGrid']();

      expect(result).toBe(72);
      expect(component.options.bottomDataZoom).toBe(32);
    });

    it('should return 0 when dataZoom is false and legendVerticalPosition is top', () => {
      component.options = {
        dataZoom: false,
        legendVerticalPosition: 'top'
      };

      const result = component['chartGridUtils']['getPaddingBottomGrid']();

      expect(result).toBe(0);
    });

    it('should return 48 when no condition matches (default case)', () => {
      component.options = {
        dataZoom: true,
        bottomDataZoom: false,
        legend: true,
        legendVerticalPosition: 'bottom'
      };

      const result = component['chartGridUtils']['getPaddingBottomGrid']();

      expect(result).toBe(48);
    });
  });

  describe('getPaddingTopGrid', () => {
    it('should return 64 and set bottomDataZoom to 8 when fixed is true, no maxRange, and top legend conditions apply', () => {
      component.options = {
        dataZoom: true,
        legendVerticalPosition: 'top',
        bottomDataZoom: true,
        axis: {}
      };
      component.dataLabel = { fixed: true };

      const result = component['chartGridUtils']['getPaddingTopGrid']();

      expect(result).toBe(64);
      expect(component.options.bottomDataZoom).toBe(8);
    });

    it('should return 56 when fixed is false and top legend conditions apply', () => {
      component.options = {
        dataZoom: true,
        bottomDataZoom: false,
        legendVerticalPosition: 'top',
        axis: {}
      };
      component.dataLabel = { fixed: false };

      const result = component['chartGridUtils']['getPaddingTopGrid']();

      expect(result).toBe(56);
    });

    it('should return 32 when fixed is true, no maxRange, and bottom legend with zoom conditions apply', () => {
      component.options = {
        dataZoom: true,
        bottomDataZoom: true,
        legendVerticalPosition: 'bottom',
        axis: {}
      };
      component.dataLabel = { fixed: true };

      const result = component['chartGridUtils']['getPaddingTopGrid']();

      expect(result).toBe(32);
    });

    it('should return 16 when fixed is false and bottom legend with zoom conditions apply', () => {
      component.options = {
        dataZoom: false,
        legendVerticalPosition: 'bottom',
        axis: {}
      };
      component.dataLabel = { fixed: false };

      const result = component['chartGridUtils']['getPaddingTopGrid']();

      expect(result).toBe(16);
    });

    it('should return 16 when no condition matches (default case)', () => {
      component.options = {};
      component.dataLabel = {};

      const result = component['chartGridUtils']['getPaddingTopGrid']();

      expect(result).toBe(16);
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
      expect((component as any).setTableColumns).toHaveBeenCalledWith(jasmine.any(Object), ['Jan', 'Fev', 'Mar']);
    });
  });

  describe('setTableProperties', () => {
    it('should rebuild categories with "-" when they do not exist and series[0].data is an array', () => {
      component['chartInstance'] = {
        getOption: jasmine.createSpy('getOption').and.returnValue({
          xAxis: [{}],
          yAxis: [{}],
          series: [{ name: 'Série 1', data: [10, 20, 30] }]
        })
      } as any;
      spyOn(component as any, 'setTableColumns');
      component['isTypeBar'] = false;

      component['setTableProperties']();

      expect(component['itemsTable']).toEqual([{ serie: 'Série 1', '0': 10, '1': 20, '2': 30 }]);
      expect(component['setTableColumns']).toHaveBeenCalled();
    });

    it('should call setTablePropertiesTypeBar when isTypeBar is true', () => {
      component['chartInstance'] = {
        getOption: jasmine.createSpy('getOption').and.returnValue({
          xAxis: [{}],
          yAxis: [{ data: ['A', 'B'] }],
          series: [{ name: 'Série A', data: [1, 2] }]
        })
      } as any;
      spyOn(component as any, 'setTableColumns');
      component['isTypeBar'] = true;

      component['setTableProperties']();

      expect(component['setTableColumns']).not.toHaveBeenCalled();
    });

    it('should set Series if type is Pie', () => {
      component.type = PoChartType.Pie;
      component.series = [
        { data: 80, label: 'Pie Value 1' },
        { data: 20, label: 'Pie Value 2' }
      ];

      component['literals'] = { serie: 'Série' };

      component['chartInstance'] = {
        getOption: jasmine.createSpy('getOption').and.returnValue({
          series: [
            {
              name: 'Série A',
              data: [
                { name: 'Pie Value 1', value: 80 },
                { name: 'Pie Value 2', value: 20 }
              ]
            }
          ]
        })
      } as any;
      spyOn(component as any, 'setTableColumns');

      component['setTableProperties']();

      expect(component['setTableColumns']).not.toHaveBeenCalled();
      expect(component['itemsTable']).toEqual([{ 'Série': '-', 'Pie Value 1': 80, 'Pie Value 2': 20 }]);
    });

    it('should call setTablePropertiesTypeGauge when isTypeGauge is true', () => {
      component['isTypeGauge'] = true;
      component.isTypeBar = false;

      component['chartInstance'] = {
        getOption: jasmine.createSpy('getOption').and.returnValue({
          xAxis: [{ data: ['Jan', 'Feb'] }],
          series: [{ name: 'Series 1', data: [10, 20] }]
        })
      } as any;

      const spySetTypeGauge = spyOn(component as any, 'setTablePropertiesTypeGauge');

      component['setTableProperties']();

      expect(spySetTypeGauge).toHaveBeenCalled();
    });
  });

  describe('setTablePropertiesTypeGauge', () => {
    beforeEach(() => {
      component.literals = { value: 'Value', item: 'Item One' };
      component.series = [
        { data: 123, label: 'Label 1', from: 0, to: 10 },
        { data: 456, label: 'Label 2', from: 11, to: 20 }
      ];
      component.valueGaugeMultiple = 999;
    });

    it('should set itemsTable with first series data when isGaugeSingle is true', () => {
      component.isGaugeSingle = true;

      component['setTablePropertiesTypeGauge']();

      expect(component['itemsTable']).toEqual([{ Value: 123 }]);
    });

    it('should set itemsTable with valueGaugeMultiple and all series ranges when isGaugeSingle is false', () => {
      component.isGaugeSingle = false;
      component.valueGaugeMultiple = 999;
      component.series = [
        { data: 123, label: 'Label 1', from: 0, to: 10 },
        { data: 456, label: 'Label 2', from: 11, to: 20 }
      ];

      component['setTablePropertiesTypeGauge']();

      const expectedItem = {
        Value: 999,
        'Label 1': '0 - 10',
        'Label 2': '11 - 20'
      };

      expect(component['itemsTable']).toEqual([expectedItem]);
    });

    it('should fallback to "-" when valueGaugeMultiple is falsy and isGaugeSingle is false', () => {
      component.isGaugeSingle = false;
      component.valueGaugeMultiple = null;

      component.series = [
        { data: 123, label: 'Label 1', from: 0, to: 10 },
        { data: 456, label: 'Label 2', from: 11, to: 20 }
      ];

      component['setTablePropertiesTypeGauge']();

      const expectedItem = {
        Value: '-',
        'Label 1': '0 - 10',
        'Label 2': '11 - 20'
      };

      expect(component['itemsTable']).toEqual([expectedItem]);
    });

    it('should use literals.item when serie.label is falsy', () => {
      component.isGaugeSingle = false;
      component.valueGaugeMultiple = 999;
      component.series = [
        { data: 123, label: '', from: 0, to: 10 },
        { data: 456, label: null as any, from: 11, to: 20 }
      ];

      component['setTablePropertiesTypeGauge']();

      const firstSerie = component.series[0];
      const lastSerie = component.series[component.series.length - 1];
      const expectedItem = {
        Value: 999,
        [`${component.literals.item} 1`]: `${firstSerie.from} - ${firstSerie.to}`,
        [`${component.literals.item} 2`]: `${lastSerie.from} - ${lastSerie.to}`
      };

      expect(component['itemsTable']).toEqual([expectedItem]);
    });
  });

  describe('setTableColumns:', () => {
    it('should correctly set columnsTable based on categories and use default label when firstColumnName is undefined', () => {
      const option = { xAxis: [{ data: ['Jan', 'Fev', 'Mar'] }] };
      component.options = {} as any;
      component['literals'] = { serie: 'Série' };

      (component as any).setTableColumns(option, ['Jan', 'Fev', 'Mar']);

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
      component['columnsTable'] = [{ property: 'serie' }, { property: 'valor1' }, { property: 'valor2' }];
      component.options = {} as any;

      component['downloadCsv']();

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(document.body.appendChild).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalled();
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('should generate and download a CSV file correctly, using default values when necessary if typeBar is true', () => {
      component.isTypeBar = true;
      component['itemsTable'] = [
        { serie: 'Série 1', valor1: 10, valor2: undefined },
        { serie: 'Série 2', valor1: 30 }
      ];
      component.options = {} as any;

      component['downloadCsv']();

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

    it('should call exportSvgAsImage if renderer mode is svg', () => {
      spyOn<any>(component, 'exportSvgAsImage');

      component['currentRenderer'] = 'svg';
      (component as any)['exportImage']('png');

      expect(component['exportSvgAsImage']).toHaveBeenCalled();
    });

    it('should call configureImageCanvas with correct parameters when chartInstance is defined', () => {
      const mockChartInstance = {
        getDataURL: jasmine.createSpy('getDataURL').and.returnValue('mockImageData')
      };

      const mockImage = new Image();
      spyOn(window, 'Image').and.returnValue(mockImage);
      spyOn<any>(component, 'configureImageCanvas');

      (component as any).chartInstance = mockChartInstance;
      (component as any).exportImage('jpeg');

      expect(mockChartInstance.getDataURL).toHaveBeenCalledWith({
        type: 'jpeg',
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      expect(component['configureImageCanvas']).toHaveBeenCalledWith('jpeg', mockImage);
    });
  });

  it('exportSvgAsImage: should serialize svg, create blob, url and call configureImageCanvas', () => {
    const fakeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    (component['el'].nativeElement.querySelector as jasmine.Spy) = jasmine.createSpy().and.returnValue(fakeSvg);

    spyOn(component as any, 'configureImageCanvas');
    const mockUrl = 'blob:http://localhost/fake-id';
    spyOn(URL, 'createObjectURL').and.returnValue(mockUrl);

    class FakeImage {
      set src(value: string) {}
    }
    (window as any).Image = FakeImage;

    const serializerSpy = spyOn(XMLSerializer.prototype, 'serializeToString').and.returnValue('<svg></svg>');

    component['exportSvgAsImage']('jpeg');

    expect(serializerSpy).toHaveBeenCalledWith(fakeSvg);
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(component['configureImageCanvas']).toHaveBeenCalledWith('jpeg', jasmine.any(FakeImage));
  });

  it('exportSvgAsImage: should return if svg element is not found', () => {
    (component['el'].nativeElement.querySelector as jasmine.Spy) = jasmine.createSpy().and.returnValue(null);

    const serializerSpy = spyOn(XMLSerializer.prototype, 'serializeToString');
    const configureCanvasSpy = spyOn(component as any, 'configureImageCanvas');
    const urlSpy = spyOn(URL, 'createObjectURL');

    component['exportSvgAsImage']('png');

    expect(serializerSpy).not.toHaveBeenCalled();
    expect(configureCanvasSpy).not.toHaveBeenCalled();
    expect(urlSpy).not.toHaveBeenCalled();
  });

  describe('configureImageCanvas:', () => {
    it('should stop execution if the canvas context is null', () => {
      const mockImage = new Image();
      const canvas = document.createElement('canvas');
      spyOn(canvas, 'getContext').and.returnValue(null);

      spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'canvas') return canvas;
        return document.createElement(tag);
      });

      spyOn<any>(component, 'setHeaderProperties');

      component['configureImageCanvas']('png', mockImage);

      mockImage.onload?.(new Event('load'));

      expect(component['setHeaderProperties']).not.toHaveBeenCalled();
    });

    it('should create and download a PNG image correctly', done => {
      const chartElement = document.createElement('div');
      chartElement.style.width = '800px';
      chartElement.style.height = '600px';

      const headerElement = document.createElement('div');
      headerElement.style.height = '50px';

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      spyOn(canvas, 'getContext').and.returnValue(ctx);

      const link = document.createElement('a');

      const originalCreateElement = document.createElement;
      spyOn(document, 'createElement').and.callFake((tag: string) => {
        if (tag === 'canvas') return canvas;
        if (tag === 'a') return link;
        return originalCreateElement.call(document, tag);
      });

      spyOn(canvas, 'toDataURL').and.returnValue('data:image/png;base64,fakeImageData');
      spyOn(link, 'click');

      const mockImage = document.createElement('img');
      Object.defineProperty(mockImage, 'width', { value: 800 });
      Object.defineProperty(mockImage, 'height', { value: 600 });

      component['configureImageCanvas']('png', mockImage);

      if (mockImage.onload) {
        mockImage.onload(new Event('load'));
      }

      try {
        expect(link.href).toBe('data:image/png;base64,fakeImageData');
        expect(link.download).toBe('grafico-exportado.png');
        expect(link.click).toHaveBeenCalled();
        done();
      } catch (error) {
        done.fail(error);
      }
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

      const result = (component as any)['chartGridUtils'].resolvePx('--border-width-sm');

      expect(result).toBe(20);
    });

    it('should convert rem to pixels correctly', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('2rem');

      const result = (component as any)['chartGridUtils'].resolvePx('--font-size-grid');

      expect(result).toBe(32);
    });

    it('should use default font size of 16px if parent font size is undefined', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('2em');
      spyOn(document, 'querySelector').and.returnValue(null);
      spyOn(window, 'getComputedStyle').and.returnValue({ fontSize: '16px' } as CSSStyleDeclaration);

      const result = (component as any)['chartGridUtils'].resolvePx('2em');

      expect(result).toBe(32);
    });

    it('should convert em to pixels based on parent element font-size', () => {
      const mockParentElement = document.createElement('div');
      mockParentElement.style.fontSize = '18px';

      spyOn<any>(component, 'getCSSVariable').and.returnValue('1.5em');
      spyOn(document, 'querySelector').and.returnValue(mockParentElement);
      spyOn(window, 'getComputedStyle').and.returnValue({ fontSize: '18px' } as CSSStyleDeclaration);

      const result = (component as any)['chartGridUtils'].resolvePx('--some-size', '.some-selector');

      expect(result).toBe(27);
    });

    it('should return default 16px when em is used but parent element is not found', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('1.5em');
      spyOn(document, 'querySelector').and.returnValue(null);

      const result = (component as any)['chartGridUtils'].resolvePx('--some-size');

      expect(result).toBe(24);
    });

    it('should default to 16px when getComputedStyle does not return fontSize', () => {
      spyOn<any>(component, 'getCSSVariable').and.returnValue('1.5em');
      spyOn(document, 'querySelector').and.returnValue(null);

      const result = (component as any)['chartGridUtils'].resolvePx('--some-size', '.some-selector');
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

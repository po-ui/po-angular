import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';

import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { PoTooltipDirective } from '../../directives';
import { PoColorService } from '../../services/po-color';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { PoChartLabelFormat } from '../po-chart/enums/po-chart-label-format.enum';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoModalAction, PoModalComponent } from '../po-modal';
import { PoPopupAction } from '../po-popup';
import { PoTableColumn } from '../po-table';
import { PoChartBaseComponent } from './po-chart-base.component';

import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoChartGridUtils } from './po-chart-grid-utils';

import * as echarts from 'echarts/core';
import { BarChart, CustomChart, GaugeChart, LineChart, PieChart } from 'echarts/charts';
import { use } from 'echarts/core';
import {
  BrushComponent,
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers';
import { PoChartGaugeUtils } from './po-chart-gauge-utils';
use([
  BarChart,
  CustomChart,
  GaugeChart,
  GraphicComponent,
  LineChart,
  PieChart,
  BrushComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  ToolboxComponent,
  TooltipComponent,
  CanvasRenderer,
  SVGRenderer
]);

/**
 * @docsPrivate
 *
 * Componente de uso interno.
 */

@Component({
  selector: 'po-chart',
  templateUrl: './po-chart.component.html',
  standalone: false
})
export class PoChartComponent extends PoChartBaseComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChildren(PoTooltipDirective) poTooltip: QueryList<PoTooltipDirective>;
  @ViewChild('targetPopup', { read: ElementRef, static: false }) targetRef: ElementRef;
  @ViewChild('modalComponent') modal: PoModalComponent;

  tooltipText = ``;

  originalHeight: number;
  originalRadiusGauge;
  chartMarginTop = '0px';
  isTypeBar = false;
  boundaryGap = false;
  listTypePieDonut: Array<any>;
  itemsTypeDonut: Array<any> = [];
  isGaugeSingle: boolean;
  itemsTypeGauge: Array<any> = [];
  itemsColorTypeGauge = [];
  protected actionModal: PoModalAction = {
    action: this.downloadCsv.bind(this),
    label: this.literals.downloadCSV
  };
  public showPopup = true;
  protected itemsTable = [];
  protected columnsTable: Array<PoTableColumn> = [];
  protected isExpanded = false;
  protected legendData: Array<{ name: string; color: string }> = [];
  protected headerHeight: number;
  protected positionTooltip = 'top';
  protected tooltipTitle = undefined;
  protected chartGridUtils: PoChartGridUtils;
  protected chartGaugeUtils: PoChartGaugeUtils;
  protected popupActions: Array<PoPopupAction> = [];
  private chartInstance!: echarts.ECharts;
  private currentRenderer: 'svg' | 'canvas';
  private intersectionObserver: IntersectionObserver;
  private isTypeGauge = false;
  private hideDomEchartsDiv = false;

  get showHeader() {
    return this.title || !this.options?.header?.hideTableDetails || !this.options?.header?.hideExpand || this.showPopup;
  }

  constructor(
    public el: ElementRef,
    private readonly currencyPipe: CurrencyPipe,
    private readonly decimalPipe: DecimalPipe,
    private readonly colorService: PoColorService,
    private readonly cdr: ChangeDetectorRef,
    languageService: PoLanguageService
  ) {
    super(languageService);
  }

  @HostListener('window:resize')
  onResize = () => {
    if (this.chartInstance) {
      this.chartInstance?.resize();
    }
  };

  @HostListener('window:PoUiThemeChange', ['$event'])
  changeTheme = (event: any) => {
    this.chartInstance?.dispose();
    this.chartInstance = undefined;
    this.initECharts();
    this.checkShowCEcharts();
  };

  ngOnInit(): void {
    this.chartGridUtils = new PoChartGridUtils(this);
    this.chartGaugeUtils = new PoChartGaugeUtils(this);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customActions']?.currentValue) {
      this.setPopupActions();
    }

    if (changes['series']?.firstChange) {
      return;
    }

    const { options, series, dataLabel, categories, height } = changes;
    if (options || series || dataLabel || categories) {
      if (
        !this.chartInstance ||
        (options?.currentValue?.rendererOption && this.currentRenderer !== options.currentValue.rendererOption)
      ) {
        this.chartInstance?.dispose();
        this.chartInstance = undefined;
        this.setInitialPopupActions();
        this.initECharts();
      } else {
        this.chartInstance?.clear();
        this.setInitialPopupActions();
        this.setChartsProperties();
      }
    }

    if (height) {
      setTimeout(() => {
        this.chartInstance?.resize();
      });
    }
  }

  ngAfterViewInit() {
    this.setInitialPopupActions();
    this.initECharts();
    this.checkShowCEcharts();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  showTooltipTitle(e: MouseEvent) {
    const element = e.target as HTMLElement;

    if (element.offsetWidth < element.scrollWidth) {
      this.tooltipTitle = this.title;
    } else {
      this.tooltipTitle = undefined;
    }
  }

  getCSSVariable(variable: string, selector?: string): string {
    const element = selector ? document.querySelector(selector) : document.documentElement;
    return element ? getComputedStyle(element).getPropertyValue(variable).trim() : '';
  }

  openModal() {
    if (!this.chartInstance) {
      return;
    }

    this.setTableProperties();
    this.modal.open();
  }

  toggleExpand() {
    if (!this.isExpanded) {
      this.originalHeight = this.height;
      this.height = window.innerHeight;
      this.originalRadiusGauge = this.chartInstance?.getOption()?.series?.[0]?.radius;

      this.chartMarginTop = this.headerHeight + 'px';
    } else {
      this.height = this.originalHeight;
      this.chartMarginTop = '0px';
    }

    if (this.isTypeGauge && innerWidth < 1366) {
      this.chartInstance?.setOption({
        series: [{ radius: this.isExpanded ? this.originalRadiusGauge : '100%' }]
      });
    }
    this.isExpanded = !this.isExpanded;

    setTimeout(() => {
      this.chartInstance?.resize();
    });
  }

  private checkShowCEcharts() {
    const chartElement = this.el.nativeElement.querySelector('#chart-id');
    if (!chartElement || !this.hideDomEchartsDiv) return;

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.initECharts();
            this.intersectionObserver.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    this.intersectionObserver.observe(chartElement);
  }

  private setInitialPopupActions(): void {
    const hideExportCsv = this.options?.header?.hideExportCsv;
    const hideExportImage = this.options?.header?.hideExportImage;

    this.showPopup = !(hideExportCsv && hideExportImage && !this.customActions?.length);
    this.cdr.detectChanges();

    const headerElement = this.el.nativeElement.querySelector('.po-chart-header') as HTMLDivElement;
    if (this.headerHeight !== headerElement?.clientHeight) {
      this.headerHeight = headerElement?.clientHeight;
      this.cdr.detectChanges();
      this.chartInstance?.resize();
    }

    this.popupActions = [
      {
        label: this.literals.exportCSV,
        visible: !hideExportCsv,
        action: () => {
          this.setTableProperties();
          this.downloadCsv();
        }
      },
      {
        label: this.literals.exportPNG,
        visible: !hideExportImage,
        action: this.exportImage.bind(this, 'png')
      },
      {
        label: this.literals.exportJPG,
        visible: !hideExportImage,
        action: this.exportImage.bind(this, 'jpeg')
      }
    ];

    this.actionModal = {
      ...this.actionModal,
      disabled: hideExportCsv
    };

    this.setPopupActions();
  }

  private initECharts() {
    this.cdr.detectChanges();
    const echartsDiv = this.el.nativeElement.querySelector('#chart-id');
    if (!echartsDiv?.clientWidth) {
      this.hideDomEchartsDiv = true;
      return;
    }
    this.currentRenderer = this.options?.rendererOption || 'canvas';
    this.chartInstance = echarts.init(echartsDiv, null, { renderer: this.currentRenderer });
    this.setChartsProperties();
    this.initEChartsEvents();
  }

  private initEChartsEvents() {
    this.chartInstance.on('click', params => {
      if (!params.value || params?.seriesType === 'gauge') return;
      if (params.seriesName && !params.seriesName.includes('\u00000')) {
        this.seriesClick.emit({ label: params.seriesName, data: params.value, category: params.name });
      } else {
        this.seriesClick.emit({ label: params.name, data: params.value });
      }
    });

    this.chartInstance.on('mouseover', (params: any) => {
      if (!params.value || params?.seriesType === 'gauge') return;
      if (params.seriesType) {
        const divTooltipElement = this.el.nativeElement.querySelector('#custom-tooltip');
        if (divTooltipElement) {
          this.setTooltipProperties(divTooltipElement, params);
        }
      }
      if (params.seriesName && !params.seriesName.includes('\u00000')) {
        this.seriesHover.emit({ label: params.seriesName, data: params.value, category: params.name });
      } else {
        this.seriesHover.emit({ label: params.name, data: params.value });
      }
    });

    this.chartInstance.on('mouseout', () => {
      this.poTooltip.last.toggleTooltipVisibility(false);
    });
  }

  private setTooltipProperties(divTooltipElement, params) {
    const chartElement = this.el.nativeElement.querySelector('#chart-id');
    let valueLabel = params.value;
    if (this.itemsTypeDonut?.length) {
      const findCurrentValue = this.itemsTypeDonut.find(
        item => item.data === params.value && params.name === item.label
      );
      valueLabel = `${findCurrentValue?.valuePercentage ?? 0}%`;
    }
    const customTooltipText =
      params.seriesName && !params.seriesName.includes('\u00000')
        ? `<b>${params.name}</b><br>
        ${params.seriesName}: <b>${valueLabel}</b>`
        : `${params.name}: <b>${valueLabel}</b>`;

    const isPie = params.seriesType === 'pie';
    if (isPie) {
      this.tooltipText = this.series[params.dataIndex].tooltip
        ? this.series[params.dataIndex].tooltip
        : customTooltipText;
    } else {
      this.tooltipText = this.series[params.seriesIndex].tooltip
        ? this.series[params.seriesIndex].tooltip
        : customTooltipText;
    }
    divTooltipElement.style.left = `${params.event.offsetX + chartElement.offsetLeft + 3}px`;
    divTooltipElement.style.top = `${chartElement.offsetTop + params.event.offsetY - 2}px`;
    this.poTooltip.last.toggleTooltipVisibility(true);
  }

  private setChartsProperties() {
    this.isTypeBar = false;
    this.isTypeGauge = false;
    this.itemsColorTypeGauge = [];
    let option = {};
    if (!this.series?.length) {
      this.chartInstance?.dispose();
      this.chartInstance = undefined;
      return;
    }
    option = this.setOptions();
    this.chartInstance.setOption(option);
    this.cdr.detectChanges();
  }

  private setOptions() {
    const newSeries = this.setSeries();

    const options: any = {
      backgroundColor: this.getCSSVariable('--background-color-grid', '.po-chart'),
      series: newSeries as any
    };

    if (!this.listTypePieDonut?.length && !this.isTypeGauge) {
      this.chartGridUtils.setGridOption(options);
      this.chartGridUtils.setOptionsAxis(options);
      this.formatLabelOption(options);
      this.chartGridUtils.setShowAxisDetails(options);
      if (this.options?.dataZoom) {
        this.chartGridUtils.setOptionDataZoom(options);
      }
    }

    if (this.options?.legend !== false) {
      this.setOptionLegend(options);
    }

    if (this.isTypeGauge) {
      this.chartGaugeUtils.setGaugeOptions(options, this.chartGridUtils.resolvePx('--font-size-grid', '.po-chart'));
    }
    return options;
  }

  private formatLabelOption(options) {
    if (this.options?.axis && Object.keys(this.options.axis).length) {
      const currentAxis = this.isTypeBar ? 'xAxis' : 'yAxis';
      options[currentAxis]['splitNumber'] = this.options.axis.gridLines || 5;
      options[currentAxis]['min'] = this.options.axis.minRange;
      options[currentAxis]['max'] = this.options.axis.maxRange;
      if (this.options.axis.labelType) {
        options[currentAxis]['axisLabel'].formatter =
          this.options.axis.labelType === PoChartLabelFormat.Number
            ? (value: number) => this.decimalPipe.transform(value, '1.2-2')
            : (value: number) => this.currencyPipe.transform(value, null, 'symbol', '1.2-2');
      }
    }
  }

  private setOptionLegend(options) {
    options.legend = {
      show: true,
      selectedMode: !this.isTypeGauge,
      orient: 'horizontal',
      left: this.options?.legendPosition || 'center',
      top: this.options?.legendVerticalPosition || 'bottom',
      bottom: 0,
      padding: [0, 16, 0, 16],
      itemWidth: 16,
      itemHeight: 16,
      icon: 'roundRect',
      textStyle: {
        color: this.getCSSVariable('--color-legend', '.po-chart'),
        fontSize: this.getCSSVariable('--font-size-grid', '.po-chart'),
        fontFamily: this.getCSSVariable('--font-family-grid', '.po-chart'),
        fontWeight: this.getCSSVariable('--font-weight-grid', '.po-chart')
      }
    };
  }

  private setSeries() {
    const hasArea = this.type === 'area' || this.series.some(serie => serie.type === 'area');
    const newSeries: Array<any> = [...this.colorService.getColors<PoChartSerie>(this.series, true, hasArea)];
    const tokenBorderWidthMd = this.chartGridUtils.resolvePx('--border-width-md');
    const findType = this.series.find(serie => serie.type)?.type;
    let serieGauge = {};
    let typeDefault;
    if (!findType && !this.type) {
      typeDefault = Array.isArray(this.series[0].data) ? PoChartType.Column : PoChartType.Pie;
    }

    const verifyType = findType || this.type || typeDefault;
    if (verifyType === 'donut' || verifyType === 'pie') {
      this.chartGridUtils.setListTypeDonutPie(verifyType);
    } else if (verifyType === 'gauge') {
      const serie = {};
      const fontSizes = {
        fontSizeMd: this.chartGridUtils.resolvePx('--font-size-md'),
        fontSizeLg: this.chartGridUtils.resolvePx('--font-size-lg'),
        fontSizeSubtitle: this.chartGridUtils.resolvePx('--font-size-subtitle-gauge', '.po-chart')
      };
      serieGauge = this.chartGaugeUtils.setListTypeGauge(serie, fontSizes);
    }

    const seriesUpdated = newSeries.map((serie, index) => {
      serie.name = serie.label && typeof serie.label === 'string' ? serie.label : '';
      !serie.type ? this.setTypeSerie(serie, this.type || typeDefault) : this.setTypeSerie(serie, serie.type);

      const colorVariable: string = serie.color?.includes('color')
        ? this.getCSSVariable(`--${serie.color.replace('po-', '')}`)
        : serie.color;
      this.chartGridUtils.setSerieTypeDonutPie(serie, colorVariable);
      this.chartGaugeUtils.setSerieTypeGauge(serie, colorVariable);
      this.setSerieEmphasis(serie, colorVariable, tokenBorderWidthMd);
      this.chartGridUtils.setSerieTypeLine(serie, tokenBorderWidthMd, colorVariable);
      this.chartGridUtils.setSerieTypeArea(serie, index);
      this.chartGridUtils.setSerieTypeBarColumn(serie, colorVariable);

      return serie;
    });

    if (this.listTypePieDonut?.length) {
      return this.listTypePieDonut;
    } else if (verifyType === 'gauge') {
      return this.chartGaugeUtils.finalizeSerieTypeGauge(serieGauge);
    }
    return seriesUpdated;
  }

  private setSerieEmphasis(serie, color: string, tokenBorder: number) {
    serie.emphasis = {
      itemStyle: {
        color: color,
        borderWidth: tokenBorder
      },
      scale: 1.5
    };

    if (this.dataLabel?.fixed) {
      serie.label = {
        show: true
      };

      serie.emphasis = {
        focus: 'series',
        itemStyle: {
          color: color,
          borderWidth: tokenBorder
        },
        scale: 1.5
      };
    }
  }

  private setTypeSerie(serie, type: PoChartType) {
    switch (type) {
      case PoChartType.Area:
        serie.type = 'line';
        serie.isTypeArea = true;
        break;
      case PoChartType.Bar:
        this.isTypeBar = true;
        serie.type = 'bar';
        break;
      case PoChartType.Column:
        serie.isTypeColumn = true;
        serie.type = 'bar';
        break;
      case PoChartType.Line:
        serie.type = 'line';
        break;
      case PoChartType.Gauge:
        this.isTypeGauge = true;
        serie.type = 'gauge';
        break;
    }
  }

  private setTableProperties() {
    const option = this.chartInstance.getOption();
    let categories: Array<any> = this.isTypeBar ? option.yAxis[0].data : option.xAxis?.[0].data;
    if (!categories && !this.isTypeGauge) {
      categories = [];
      if (Array.isArray(this.series[0]?.data)) {
        this.series[0].data.forEach((data, index) => categories.push(String(index)));
      } else {
        let items = { [this.options?.firstColumnName || this.literals.serie]: '-' };
        option.series[0].data.forEach(data => (items = { ...items, [data.name]: data.value }));
        this.itemsTable = [items];
        return;
      }
    }
    const series: any = option.series;

    if (this.isTypeBar) {
      this.setTablePropertiesTypeBar(categories, series);
      return;
    } else if (this.isTypeGauge) {
      this.setTablePropertiesTypeGauge();
      return;
    }

    this.itemsTable = series.map((serie: any) => {
      const rowData: any = { serie: serie.name };

      categories.forEach((category: any, index) => {
        rowData[category] = serie.data[index];
      });

      return rowData;
    });
    this.setTableColumns(option, categories);
  }

  private setTablePropertiesTypeBar(categories: Array<any>, series: Array<any>) {
    this.itemsTable = categories.map((category: string, index: number) => {
      const rowData: any = { categoria: category };

      series.forEach((serie: any) => {
        rowData[serie.name] = serie.data[index];
      });

      return rowData;
    });

    this.columnsTable = [
      { property: 'categoria', label: this.options?.firstColumnName || this.literals.category },
      ...series.map((serie: any) => ({
        property: serie.name,
        label: serie.name
      }))
    ];
  }

  private setTablePropertiesTypeGauge() {
    this.itemsTable = [
      { [this.literals.value]: this.isGaugeSingle ? this.series[0].data : this.valueGaugeMultiple || '-' }
    ];
    if (!this.isGaugeSingle) {
      this.series.forEach(serie => {
        const item = { ...this.itemsTable[0], [serie.label || this.literals.itemOne]: `${serie.from} - ${serie.to}` };
        this.itemsTable = [{ ...item }];
      });
    }
  }

  private setTableColumns(option, categories) {
    this.columnsTable = [
      { property: 'serie', label: this.options?.firstColumnName || this.literals.serie },
      ...categories.map((category: string) => ({
        property: category,
        label: category
      }))
    ];
  }

  private downloadCsv() {
    const headers = Object.keys(this.itemsTable[0]);
    const columnNameDefault = this.isTypeBar ? 'Categoria' : this.literals.serie;
    const firstColumnName = this.options?.firstColumnName || columnNameDefault;
    const orderedHeaders = this.columnsTable?.length
      ? [firstColumnName, ...headers.filter(header => header !== 'serie')]
      : [...headers.filter(header => header !== 'serie')];

    const csvContent = [
      orderedHeaders.join(';'),
      ...this.itemsTable.map(row =>
        orderedHeaders.map(header => (header === firstColumnName ? row['serie'] : (row[header] ?? ''))).join(';')
      )
    ].join('\n');

    const utf8Bom = '\uFEFF';
    const blob = new Blob([utf8Bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dados_grafico.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private exportImage(type: 'png' | 'jpeg') {
    if (!this.chartInstance) {
      return;
    }

    if (this.currentRenderer === 'svg') {
      this.exportSvgAsImage(type);
    } else {
      const chartImage = new Image();
      chartImage.src = this.chartInstance.getDataURL({
        type: type,
        pixelRatio: 2,
        backgroundColor: this.getCSSVariable('--color-neutral-light-00')
      });
      this.configureImageCanvas(type, chartImage);
    }
  }

  private exportSvgAsImage(type: 'png' | 'jpeg') {
    const svgEl = this.el.nativeElement.querySelector('#chart-id svg') as SVGSVGElement;

    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    this.configureImageCanvas(type, image);

    image.src = url;
  }

  private configureImageCanvas(type: 'png' | 'jpeg', chartImage: HTMLImageElement) {
    chartImage.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const chartElement = this.el.nativeElement.querySelector('#chart-id') as HTMLDivElement;
      const headerElement = this.el.nativeElement.querySelector('.po-chart-header') as HTMLDivElement;

      const chartWidth = chartElement.clientWidth;
      const chartHeight = chartElement.clientHeight;

      const headerHeight = headerElement?.clientHeight || 40;

      canvas.width = chartWidth;
      canvas.height = headerHeight + chartHeight + 40;
      ctx.fillStyle = this.getCSSVariable('--color-neutral-light-00');
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      this.setHeaderProperties(ctx, headerElement, chartWidth, headerHeight);
      ctx.drawImage(chartImage, 0, headerHeight, chartWidth, chartHeight);

      const link = document.createElement('a');
      link.href = canvas.toDataURL(`image/${type}`);
      link.download = `grafico-exportado.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }

  private setHeaderProperties(ctx, headerElement, chartWidth, headerHeight) {
    ctx.fillStyle = this.getCSSVariable('--color-neutral-light-00');
    ctx.fillRect(0, 0, chartWidth, headerHeight);

    const titleElement = headerElement.querySelector('.po-chart-header-title');
    const title = titleElement?.innerText ?? 'Gráfico';

    ctx.fillStyle = this.getCSSVariable('--color-neutral-dark-70');
    ctx.font = 'bold 16px Roboto-Bold';
    ctx.textAlign = 'left';
    ctx.fillText(title, 20, headerHeight / 2 + 5);
  }

  private setPopupActions(): void {
    this.popupActions = [...this.popupActions, ...(this.customActions || [])];
  }
}

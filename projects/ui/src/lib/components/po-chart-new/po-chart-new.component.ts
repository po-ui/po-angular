import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
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
import { PoChartNewBaseComponent } from './po-chart-new-base.component';

import * as echarts from 'echarts/dist/echarts.esm';
import { EChartsOption } from 'echarts/dist/echarts.esm';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoChartGridUtils } from './po-chart-grid-utils';

/**
 * @docsExtends PoChartBaseComponent
 *
 * @example
 *
 * <example name="po-chart-basic" title="PO Chart Basic">
 *  <file name="sample-po-chart-basic/sample-po-chart-basic.component.html"> </file>
 *  <file name="sample-po-chart-basic/sample-po-chart-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-labs" title="PO Chart Labs">
 *  <file name="sample-po-chart-labs/sample-po-chart-labs.component.html"> </file>
 *  <file name="sample-po-chart-labs/sample-po-chart-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-coffee-ranking" title="PO Chart - Coffee Ranking">
 *  <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.html"> </file>
 *  <file name="sample-po-chart-coffee-ranking/sample-po-chart-coffee-ranking.component.ts"> </file>
 * </example>
 *
 * <example name="po-chart-world-exports" title="PO Chart - World Exports">
 *  <file name="sample-po-chart-world-exports/sample-po-chart-world-exports.component.html"> </file>
 *  <file name="sample-po-chart-world-exports/sample-po-chart-world-exports.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-chart-new',
  templateUrl: './po-chart-new.component.html',
  standalone: false
})
export class PoChartNewComponent extends PoChartNewBaseComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(PoTooltipDirective) poTooltip: PoTooltipDirective;
  @ViewChild('targetPopup', { read: ElementRef, static: false }) targetRef: ElementRef;
  @ViewChild('modalComponent') modal: PoModalComponent;

  tooltipText = ``;

  originalHeight: number;
  chartMarginTop = '0px';
  isTypeBar = false;
  boundaryGap = false;
  protected actionModal: PoModalAction = {
    action: this.downloadCsv.bind(this),
    label: this.literals.downloadCSV
  };
  protected itemsTable = [];
  protected columnsTable: Array<PoTableColumn> = [];
  protected isExpanded = false;
  protected legendData: Array<{ name: string; color: string }> = [];
  protected headerHeight: number;
  protected positionTooltip = 'bottom';
  protected chartGridUtils: PoChartGridUtils;
  protected popupActions: Array<PoPopupAction> = [
    {
      label: this.literals.exportCSV,
      disabled: this.options?.header?.disabledExportCsv,
      action: () => {
        this.setTableProperties();
        this.downloadCsv();
      }
    },
    {
      label: this.literals.exportPNG,
      disabled: this.options?.header?.disabledExportImage,
      action: this.exportImage.bind(this, 'png')
    },
    {
      label: this.literals.exportJPG,
      disabled: this.options?.header?.disabledExportImage,
      action: this.exportImage.bind(this, 'jpeg')
    }
  ];
  private chartInstance!: echarts.ECharts;
  private currentRenderer: 'svg' | 'canvas';

  constructor(
    private el: ElementRef,
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

  ngOnInit(): void {
    this.chartGridUtils = new PoChartGridUtils(this);
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
        this.initECharts();
      } else {
        this.chartInstance?.clear();
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
    this.initECharts();
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

      this.chartMarginTop = this.headerHeight + 'px';
    } else {
      this.height = this.originalHeight;
      this.chartMarginTop = '0px';
    }

    this.isExpanded = !this.isExpanded;

    setTimeout(() => {
      this.chartInstance?.resize();
    });
  }

  private initECharts() {
    this.cdr.detectChanges();
    const echartsDiv = this.el.nativeElement.querySelector('#chart-id');
    if (!echartsDiv) {
      return;
    }

    if (!this.headerHeight) {
      const headerElement = this.el.nativeElement.querySelector('.po-chart-header') as HTMLDivElement;
      this.headerHeight = headerElement?.clientHeight;
      this.cdr.detectChanges();
    }
    this.currentRenderer = this.options?.rendererOption || 'canvas';
    this.chartInstance = echarts.init(echartsDiv, null, { renderer: this.currentRenderer });
    this.setChartsProperties();
    this.initEChartsEvents();
  }

  private initEChartsEvents() {
    this.chartInstance.on('click', params => {
      if (!params.value) return;
      this.seriesClick.emit({ label: params.seriesName, data: params.value, category: params.name });
    });

    this.chartInstance.on('mouseover', (params: any) => {
      if (!params.value) return;
      if (params.seriesType) {
        const divTooltipElement = this.el.nativeElement.querySelector('#custom-tooltip');
        if (divTooltipElement) {
          const chartElement = this.el.nativeElement.querySelector('#chart-id');
          if (params.seriesType === 'bar') {
            this.positionTooltip = 'top';
          }
          const customTooltipText = params.seriesName
            ? `<b>${params.name}</b><br>
            ${params.seriesName}: <b>${params.value}</b>`
            : `${params.name}<b>${params.value}</b>`;
          this.tooltipText = this.series[params.seriesIndex].tooltip
            ? this.series[params.seriesIndex].tooltip
            : customTooltipText;
          divTooltipElement.style.left = `${params.event.offsetX + chartElement.offsetLeft + 3}px`;
          divTooltipElement.style.top = `${chartElement.offsetTop + params.event.offsetY + 3}px`;
          this.poTooltip.toggleTooltipVisibility(true);
        }
      }
      this.seriesHover.emit({ label: params.seriesName, data: params.value, category: params.name });
    });

    this.chartInstance.on('mouseout', () => {
      this.poTooltip.toggleTooltipVisibility(false);
    });
  }

  private setChartsProperties() {
    let option: EChartsOption = {};
    option = this.setOptions();
    this.chartInstance.setOption(option);
  }

  private setOptions() {
    const newSeries = this.setSeries();

    const options: EChartsOption = {
      backgroundColor: this.getCSSVariable('--background-color-grid', '.po-chart'),
      series: newSeries as any
    };

    this.chartGridUtils.setGridOption(options);
    this.chartGridUtils.setOptionsAxis(options);
    this.formatLabelOption(options);
    this.chartGridUtils.setShowAxisDetails(options);

    if (this.options?.dataZoom) {
      this.chartGridUtils.setOptionDataZoom(options);
    }

    if (this.options?.legend !== false) {
      this.setOptionLegend(options);
    }
    return options;
  }

  private formatLabelOption(options: EChartsOption) {
    if (this.options?.axis && Object.keys(this.options.axis).length) {
      options.yAxis['splitNumber'] = this.options.axis.gridLines || 5;
      options.yAxis['min'] = this.options.axis.minRange;
      options.yAxis['max'] = this.options.axis.maxRange;
      if (this.options.axis.labelType) {
        options.yAxis['axisLabel'].formatter =
          this.options.axis.labelType === PoChartLabelFormat.Number
            ? (value: number) => this.decimalPipe.transform(value, '1.2-2')
            : (value: number) => this.currencyPipe.transform(value, null, 'symbol', '1.2-2');
      }
    }
  }

  private setOptionLegend(options: EChartsOption) {
    options.legend = {
      show: true,
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
        fontFamily: this.getCSSVariable('--font-family-grid', '.po-chart')
      }
    };
  }

  private setSeries() {
    const hasArea = this.type === 'area' || this.series.some(serie => serie.type === 'area');
    const newSeries: Array<any> = [...this.colorService.getColors<PoChartSerie>(this.series, true, hasArea)];
    const tokenBorderWidthMd = this.chartGridUtils.resolvePx('--border-width-md');
    const findType = this.series.find(serie => serie.type);
    let typeDefault;
    if (!findType && !this.type) {
      typeDefault = Array.isArray(this.series[0].data) ? PoChartType.Column : PoChartType.Pie;
    }

    return newSeries.map((serie, index) => {
      serie.name = serie.label && typeof serie.label === 'string' ? serie.label : '';
      !serie.type ? this.setTypeSerie(serie, this.type || typeDefault) : this.setTypeSerie(serie, serie.type);

      const colorVariable: string = serie.color?.includes('color')
        ? this.getCSSVariable(`--${serie.color.replace('po-', '')}`)
        : serie.color;

      this.setSerieEmphasis(serie, colorVariable, tokenBorderWidthMd);
      this.chartGridUtils.setSerieTypeLine(serie, tokenBorderWidthMd, colorVariable);
      this.chartGridUtils.setSerieTypeArea(serie, index);
      this.chartGridUtils.setSerieTypeBarColumn(serie, colorVariable);

      return serie;
    });
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
      case PoChartType.Donut:
        serie.type = 'donut';
        break;
      case PoChartType.Line:
        serie.type = 'line';
        break;
      case PoChartType.Pie:
        serie.type = 'pie';
        break;
    }
  }

  private setTableProperties() {
    const option = this.chartInstance.getOption();
    let categories: Array<any> = this.isTypeBar ? option.yAxis[0].data : option.xAxis[0].data;
    if (!categories && Array.isArray(this.series[0]?.data)) {
      categories = [];
      this.series[0].data.forEach((data, index) => categories.push(String(index)));
    }
    const series: any = option.series;

    if (this.isTypeBar) {
      this.setTablePropertiesTypeBar(categories, series);
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
      { property: 'categoria', label: this.options?.firstColumnName || 'Categoria' },
      ...series.map((serie: any) => ({
        property: serie.name,
        label: serie.name
      }))
    ];
  }

  private setTableColumns(option, categories) {
    this.columnsTable = [
      { property: 'serie', label: this.options?.firstColumnName || 'Série' },
      ...categories.map((category: string) => ({
        property: category,
        label: category
      }))
    ];
  }

  private downloadCsv() {
    const headers = Object.keys(this.itemsTable[0]);
    const columnNameDefault = this.isTypeBar ? 'Categoria' : 'Série';
    const firstColumnName = this.options?.firstColumnName || columnNameDefault;
    const orderedHeaders = [firstColumnName, ...headers.filter(header => header !== 'serie')];

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
        backgroundColor: 'white'
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
      ctx.fillStyle = 'white';
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

    const titleElement = headerElement.querySelector('.po-chart-header-title strong');
    const title = titleElement?.innerText || 'Gráfico';

    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, 20, headerHeight / 2 + 5);
  }

  private setPopupActions(): void {
    this.popupActions = [...this.popupActions, ...(this.customActions || [])];
  }
}

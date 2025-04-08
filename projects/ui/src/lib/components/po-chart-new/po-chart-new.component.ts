import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnChanges,
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
export class PoChartNewComponent extends PoChartNewBaseComponent implements AfterViewInit, OnChanges {
  @ViewChild(PoTooltipDirective) poTooltip: PoTooltipDirective;
  @ViewChild('targetPopup', { read: ElementRef, static: false }) targetRef: ElementRef;
  @ViewChild('modalComponent') modal: PoModalComponent;

  tooltipText = ``;

  originalHeight: number;
  chartMarginTop = '0px';
  protected actionModal: PoModalAction = {
    action: this.downloadCsv.bind(this),
    label: this.literals.downloadCSV
  };
  protected itemsTable = [];
  protected columnsTable: Array<PoTableColumn> = [];
  protected isExpanded = false;
  protected legendData: Array<{ name: string; color: string }> = [];
  protected headerHeight: number;
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
    this.chartInstance = echarts.init(echartsDiv, null, { renderer: this.options?.rendererOption || 'canvas' });
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
      if (params.seriesType === 'line') {
        const divTooltipElement = this.el.nativeElement.querySelector('#custom-tooltip');
        if (divTooltipElement) {
          const chartElement = this.el.nativeElement.querySelector('#chart-id');
          this.tooltipText = this.series[params.seriesIndex].tooltip
            ? this.series[params.seriesIndex].tooltip
            : `${params.seriesName}: ${params.value}`;
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

  private getCSSVariable(variable: string, selector?: string): string {
    const element = selector ? document.querySelector(selector) : document.documentElement;
    return element ? getComputedStyle(element).getPropertyValue(variable).trim() : '';
  }

  private setChartsProperties() {
    let option: EChartsOption = {};
    option = this.setOptionLine();
    this.chartInstance.setOption(option);
  }

  private setOptionLine() {
    const tokenBorderWidthSm = this.resolvePx('--border-width-sm');
    const tokenFontSizeGrid = this.resolvePx('--font-size-grid', '.po-chart');
    const newSeries = this.setSeries();
    const paddingTop = this.getPaddingTopGrid();

    const options: EChartsOption = {
      backgroundColor: this.getCSSVariable('--background-color-grid', '.po-chart'),
      grid: {
        top: paddingTop,
        left: this.options?.axis?.paddingLeft || 48,
        right: 16,
        borderWidth: tokenBorderWidthSm
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.categories,
        axisLabel: {
          fontFamily: this.getCSSVariable('--font-family-grid', '.po-chart'),
          fontSize: tokenFontSizeGrid || 12,
          fontWeight: Number(this.getCSSVariable('--font-weight-grid', '.po-chart')),
          rotate: this.options?.axis?.rotateLegend
        },
        splitLine: {
          show: this.options?.axis?.showXAxis || false,
          lineStyle: {
            type: 'solid',
            width: tokenBorderWidthSm,
            color: this.getCSSVariable('--color-grid', '.po-chart')
          }
        }
      },
      yAxis: {
        type: 'value',
        splitNumber: 5,
        axisLabel: {
          margin: 10,
          fontFamily: this.getCSSVariable('--font-family-grid', '.po-chart'),
          fontSize: tokenFontSizeGrid || 12,
          fontWeight: Number(this.getCSSVariable('--font-weight-grid', '.po-chart'))
        },
        splitLine: {
          show: this.options?.axis?.showYAxis ?? true,
          lineStyle: {
            color: this.getCSSVariable('--color-grid', '.po-chart')
          }
        }
      },
      series: newSeries as any
    };

    this.formatLabelOption(options);
    this.setShowAxisDetails(options);

    if (this.options.dataZoom) {
      this.setOptionDataZoom(options);
    }

    if (this.options?.legend !== false) {
      this.setOptionLegend(options);
    }
    return options;
  }

  private getPaddingTopGrid(): number {
    if (this.options?.dataZoom) {
      return 45;
    } else if (this.dataLabel?.fixed && !this.options?.axis?.maxRange) {
      return 20;
    }
    return 8;
  }

  private setOptionDataZoom(options: EChartsOption) {
    options.dataZoom = [
      {
        show: true,
        realtime: true,
        bottom: 'calc(100%)',
        height: 20,
        right: 16,
        xAxisIndex: [0]
      },
      {
        type: 'inside',
        realtime: true,
        xAxisIndex: [0]
      }
    ];
    options.graphic = [
      {
        type: 'text',
        left: 'center',
        top: 30,
        style: {
          text: 'Use o scroll do mouse para dar zoom',
          fontFamily: this.getCSSVariable('--font-family-grid', '.po-chart'),
          fontSize: this.resolvePx('--font-size-sm'),
          fill: this.getCSSVariable('--color-legend', '.po-chart')
        }
      }
    ];
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

  private setShowAxisDetails(options: EChartsOption) {
    if (this.options?.axis?.showAxisDetails) {
      options.tooltip = {
        trigger: 'none',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      };
    }
  }

  private setSeries() {
    const hasArea = this.type === 'area' || this.series.some(serie => serie.type === 'area');
    const newSeries: Array<any> = [...this.colorService.getColors<PoChartSerie>(this.series, true, hasArea)];
    const tokenBorderWidthMd = this.resolvePx('--border-width-md');

    return newSeries.map((serie, index) => {
      if (serie.label && typeof serie.label === 'string') {
        serie.name = serie.label;
      }

      if (!serie.type || serie.type === 'area' || serie.type === 'column') {
        !serie.type ? this.setTypeSerie(serie, this.type) : this.setTypeSerie(serie, serie.type);
      }

      const colorVariable: string = serie.color?.includes('color')
        ? this.getCSSVariable(`--${serie.color.replace('po-', '')}`)
        : serie.color;

      this.setSerieEmphasis(serie, colorVariable, tokenBorderWidthMd);
      this.setSerieTypeArea(serie, index);

      const isTypeLine = this.type === 'line' || serie.type === 'line';
      if (isTypeLine) {
        serie.symbolSize = 8;
        serie.symbol = 'circle';
      }
      serie.itemStyle = {
        color:
          isTypeLine && !this.options?.fillPoints ? this.getCSSVariable('--color-neutral-light-00') : colorVariable,
        borderColor: colorVariable,
        borderWidth: tokenBorderWidthMd
      };
      serie.lineStyle = { color: colorVariable, width: tokenBorderWidthMd };
      return serie;
    });
  }

  private setSerieTypeArea(serie, index: number) {
    if (serie.isTypeArea) {
      serie.areaStyle = {
        color: serie.color?.includes('color')
          ? this.getCSSVariable(`--${serie.color.replace('po-', '')}`)
          : serie.overlayColor
      };

      if (index > 7 || serie.isNotTokenColor) {
        serie.areaStyle.opacity = 0.5;
      }
    }
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
        serie.type = 'bar';
        break;
      case PoChartType.Column:
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
    const categories = option.xAxis[0].data;
    const series: any = option.series;

    this.itemsTable = series.map((serie: any) => {
      const rowData: any = { serie: serie.name };

      categories.forEach((category: any, index) => {
        rowData[category] = serie.data[index];
      });

      return rowData;
    });
    this.setTableColumns(option);
  }

  private setTableColumns(option) {
    const categories = option.xAxis[0].data;
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
    const firstColumnName = this.options?.firstColumnName || 'Série';
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

    const chartImage = new Image();
    chartImage.src = this.chartInstance.getDataURL({
      type: type,
      pixelRatio: 2,
      backgroundColor: 'white'
    });

    this.createImage(type, chartImage);
  }

  private createImage(type: 'png' | 'jpeg', chartImage: HTMLImageElement) {
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
      link.download = `grafico_com_legenda.${type}`;
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

  private resolvePx(size: string, selector?: string): number {
    const token = this.getCSSVariable(size, selector);
    if (token.endsWith('px')) {
      return parseFloat(token);
    } else if (token.endsWith('rem')) {
      return parseFloat(token) * 16;
    } else if (token.endsWith('em')) {
      const parentElement = selector ? document.querySelector(selector) : document.documentElement;
      const parentFontSize = parentElement ? parseFloat(getComputedStyle(parentElement).fontSize) : 16;
      return parseFloat(token) * parentFontSize;
    }
  }

  private setPopupActions(): void {
    this.popupActions = [...this.popupActions, ...(this.customActions || [])];
  }
}

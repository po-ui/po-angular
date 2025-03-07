import { AfterViewInit, Component, DEFAULT_CURRENCY_CODE, ElementRef, LOCALE_ID, ViewChild } from '@angular/core';

import { PoChartNewBaseComponent } from './po-chart-new-base.component';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { PoChartLabelFormat } from '../po-chart/enums/po-chart-label-format.enum';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';
import { PoTooltipDirective } from '../../directives';
import { PoColorService } from '../../services/po-color';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';

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
export class PoChartNewComponent extends PoChartNewBaseComponent implements AfterViewInit {
  @ViewChild(PoTooltipDirective) poTooltip: PoTooltipDirective;

  tooltipText = ''; // Texto da tooltip

  constructor(
    private readonly el: ElementRef,
    private readonly currencyPipe: CurrencyPipe,
    private readonly decimalPipe: DecimalPipe,
    private readonly colorService: PoColorService
  ) {
    super();
  }

  ngAfterViewInit() {
    this.initECharts();
  }

  private initECharts() {
    const echartsDiv = this.el.nativeElement.querySelector('#chart-id');

    const chart = echarts.init(echartsDiv, null, { renderer: 'svg' });

    let option: EChartsOption = this.options2 || {};

    if (!option.xAxis) {
      if (this.type === 'line' || this.series.find(serie => serie.type === PoChartType.Line)) {
        option = this.setOptionLine();
      }
    }
    console.log('option: ', option);

    chart.setOption(option);

    chart.on('click', params => {
      this.seriesClick.emit({ label: params.seriesName, data: params.value, category: params.name });
    });

    chart.on('dblclick', function (params) {
      console.log('dblclick', params);
    });

    chart.on('legendselectchanged', function (params) {
      console.log('legendselectchanged', params);
    });

    // chart.on('click', 'series.line', function (params) {
    //   console.log('click - series.line', params);
    // });

    chart.on('mouseover', (params: any) => {
      if (params.seriesType === 'line') {
        const divTooltipElement = this.el.nativeElement.querySelector('#custom-tooltip');
        if (divTooltipElement) {
          this.tooltipText = this.series[params.seriesIndex].tooltip
            ? this.series[params.seriesIndex].tooltip
            : `${params.seriesName}: ${params.value}`;
          divTooltipElement.style.left = `${params.event.offsetX + 15}px`;
          divTooltipElement.style.top = `${params.event.offsetY + 40}px`;
          this.poTooltip.toggleTooltipVisibility(true);
        }
      }
      this.seriesHover.emit({ label: params.seriesName, data: params.value, category: params.name });
    });

    chart.on('mouseout', () => {
      this.poTooltip.toggleTooltipVisibility(false);
    });
  }

  getCSSVariable(variable: string, selector?: string): string {
    const element = selector ? document.querySelector(selector) : document.documentElement;
    return element ? getComputedStyle(element).getPropertyValue(variable).trim() : '';
  }

  private setOptionLine() {
    console.log('series: ', this.series);
    const newSeries: Array<any> = [...this.colorService.getColors<PoChartSerie>(this.series)];
    const tokenBorderWidthMd = this.getCSSVariable('--border-width-md').replace('px', '');
    const tokenBorderWidthSm = this.getCSSVariable('--border-width-sm').replace('px', '');
    const tokenFontSizeGrid = Number(this.getCSSVariable('--font-size-grid', '.po-chart').replace('rem', '')) * 16;
    newSeries.forEach(serie => {
      if (serie.label) {
        serie.name = serie.label;
      }

      if (serie.type === 'column') {
        serie.type = 'bar';
      }

      if (this.dataLabel?.fixed) {
        serie.label = {
          show: true
        };

        // serie.emphasis = {
        //   focus: 'self',
        //   lineStyle: {
        //     width: 4
        //   }
        // };
      }

      console.log('newSerie: ', tokenBorderWidthMd);
      const colorVariable = serie.color.includes('color')
        ? this.getCSSVariable(`--${serie.color.replace('po-', '')}`)
        : serie.color;

      serie.emphasis = {
        itemStyle: {
          color: colorVariable,
          borderWidth: tokenBorderWidthMd
        },
        scale: 1.5
      };
      const isTypeLine = this.type === 'line' || serie.type === 'line';
      if (isTypeLine) {
        serie.symbolSize = 8;
        serie.symbol = 'circle';
      }
      serie.itemStyle = {
        color: isTypeLine ? this.getCSSVariable('--color-neutral-light-20') : colorVariable,
        borderColor: colorVariable,
        borderWidth: tokenBorderWidthMd
      };
      serie.lineStyle = { color: colorVariable, width: tokenBorderWidthMd };
    });

    const options: EChartsOption = {
      // tooltip: {
      //   trigger: 'axis',
      //   triggerOn: 'mousemove'
      // },
      backgroundColor: this.getCSSVariable('--background-color-grid', '.po-chart'),
      grid: {
        top: 10,
        bottom: 30,
        borderWidth: Number(tokenBorderWidthSm)
      },
      xAxis: {
        type: 'category',
        data: this.categories,
        axisLabel: {
          margin: 10,
          fontFamily: this.getCSSVariable('--font-family-grid', '.po-chart'),
          fontSize: tokenFontSizeGrid || 12,
          fontWeight: Number(this.getCSSVariable('--font-weight-grid', '.po-chart'))
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'solid',
            width: Number(tokenBorderWidthSm),
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
          lineStyle: {
            color: this.getCSSVariable('--color-grid', '.po-chart')
          }
        }
      },
      series: newSeries as any
    };

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
    return options;
  }
}

import { EChartsOption } from 'echarts/dist/echarts.esm';
import { PoChartNewComponent } from './po-chart-new.component';

export class PoChartGridUtils {
  constructor(private readonly component: PoChartNewComponent) {}

  setGridOption(options: EChartsOption) {
    const tokenBorderWidthSm = this.resolvePx('--border-width-sm');
    const paddingBottom = this.getPaddingBottomGrid();
    const paddingTop = this.getPaddingTopGrid();
    options.grid = {
      top: paddingTop,
      left: this.component.options?.axis?.paddingLeft || 16,
      right: this.component.options?.axis?.paddingRight || 32,
      bottom: this.component.options?.axis?.paddingBottom || paddingBottom,
      containLabel: true,
      borderWidth: tokenBorderWidthSm
    };
  }

  setOptionsAxis(options: EChartsOption) {
    const tokenFontSizeGrid = this.resolvePx('--font-size-grid', '.po-chart');
    const tokenBorderWidthSm = this.resolvePx('--border-width-sm');

    options.xAxis = {
      type: this.component.isTypeBar ? 'value' : 'category',
      axisLabel: {
        fontFamily: this.component.getCSSVariable('--font-family-grid', '.po-chart'),
        fontSize: tokenFontSizeGrid || 12,
        fontWeight: Number(this.component.getCSSVariable('--font-weight-grid', '.po-chart')),
        rotate: this.component.options?.axis?.rotateLegend,
        interval: 0,
        width: 72,
        overflow: 'break'
      },
      splitLine: {
        show: this.component.options?.axis?.showXAxis || false,
        lineStyle: {
          type: 'solid',
          width: tokenBorderWidthSm,
          color: this.component.getCSSVariable('--color-grid', '.po-chart')
        }
      }
    };

    options.yAxis = {
      type: this.component.isTypeBar ? 'category' : 'value',
      splitNumber: 5,
      axisLabel: {
        margin: 10,
        fontFamily: this.component.getCSSVariable('--font-family-grid', '.po-chart'),
        fontSize: tokenFontSizeGrid || 12,
        fontWeight: Number(this.component.getCSSVariable('--font-weight-grid', '.po-chart'))
      },
      splitLine: {
        show: this.component.options?.axis?.showYAxis ?? true,
        lineStyle: {
          color: this.component.getCSSVariable('--color-grid', '.po-chart')
        }
      }
    };

    if (this.component.isTypeBar) {
      options.yAxis.data = this.component.categories;
    } else {
      options.xAxis.data = this.component.categories;
      options.xAxis.boundaryGap = this.component.boundaryGap;
    }
  }

  setOptionDataZoom(options: EChartsOption) {
    options.dataZoom = [
      {
        show: true,
        realtime: true,
        bottom: this.component.options?.bottomDataZoom || 'calc(100%)',
        height: 25,
        right: this.component.options?.axis?.paddingRight || 32,
        xAxisIndex: [0]
      },
      {
        type: 'inside',
        realtime: true,
        xAxisIndex: [0]
      }
    ];
  }

  setShowAxisDetails(options: EChartsOption) {
    if (this.component.options?.axis?.showAxisDetails) {
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

  setSerieTypeLine(serie: any, tokenBorderWidthMd: number, color: string) {
    if (serie.type === 'line') {
      serie.symbolSize = 8;
      serie.symbol = 'circle';
      serie.itemStyle = {
        color: !this.component.options?.fillPoints ? this.component.getCSSVariable('--color-neutral-light-00') : color,
        borderColor: color,
        borderWidth: tokenBorderWidthMd
      };
      serie.lineStyle = { color: color, width: tokenBorderWidthMd };
    }
  }

  setSerieTypeArea(serie: any, index: number) {
    if (serie.isTypeArea) {
      serie.areaStyle = {
        color: serie.color?.includes('color')
          ? this.component.getCSSVariable(`--${serie.color.replace('po-', '')}`)
          : serie.overlayColor
      };

      if (index > 7 || serie.isNotTokenColor) {
        serie.areaStyle.opacity = 0.5;
      }
    }
  }

  setSerieTypeBarColumn(serie: any, color: string) {
    if (serie.type === 'bar') {
      serie.itemStyle = {
        borderRadius: this.resolvePx('--border-radius-bar', '.po-chart'),
        color: color
      };
      serie.emphasis = { focus: 'series' };
      this.component.boundaryGap = true;
    }
  }

  resolvePx(size: string, selector?: string): number {
    const token = this.component.getCSSVariable(size, selector);
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

  private getPaddingBottomGrid() {
    const options = this.component.options;
    if (
      options?.dataZoom &&
      options.bottomDataZoom &&
      (options.legend === false || options.legendVerticalPosition === 'top')
    ) {
      if (typeof options.bottomDataZoom === 'boolean' && options.bottomDataZoom === true) {
        options.bottomDataZoom = 8;
      }
      return 50;
    } else if (options?.dataZoom && options.bottomDataZoom && options.legendVerticalPosition !== 'top') {
      if (typeof options.bottomDataZoom === 'boolean' && options.bottomDataZoom === true) {
        options.bottomDataZoom = 32;
      }
      return 70;
    } else if (
      (options?.dataZoom && !options?.bottomDataZoom && options.legend === false) ||
      (!options?.dataZoom && options?.legend === false) ||
      (!options?.dataZoom && options?.legendVerticalPosition === 'top')
    ) {
      return 0;
    }
    return 50;
  }

  private getPaddingTopGrid() {
    const options = this.component.options;
    if (
      (options?.dataZoom && !options.bottomDataZoom) ||
      (options?.dataZoom && options.bottomDataZoom && options.legendVerticalPosition === 'top') ||
      (!options?.dataZoom && options?.legendVerticalPosition === 'top')
    ) {
      if (typeof options.bottomDataZoom === 'boolean' && options.bottomDataZoom === true) {
        options.bottomDataZoom = 8;
      }
      const fixed = this.component.dataLabel?.fixed && !options?.axis?.maxRange;
      return fixed ? 60 : 50;
    } else if (
      (options?.dataZoom && options.bottomDataZoom && options.legendVerticalPosition !== 'top') ||
      (!options?.dataZoom && options?.legendVerticalPosition !== 'top')
    ) {
      const fixed = this.component.dataLabel?.fixed && !options?.axis?.maxRange;
      return fixed ? 30 : 20;
    }
  }
}

import { PoChartComponent } from './po-chart.component';
import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoChartType } from '../po-chart/enums/po-chart-type.enum';

const gridPaddingValues = {
  paddingBottomWithTopLegend: 48,
  paddingBottomWithBottomLegend: 72,
  paddingBottomNoLegend: 0,

  paddingTopWithDataLabelFixed: 64,
  paddingTopDefaultWithTopLegend: 56,
  paddingTopWithDataLabelFixedBottomLegend: 32,
  paddingTopDefaultWithBottomLegend: 16,

  bottomDataZoomValueTopLegend: 8,
  bottomDataZoomValueBottomLegend: 32
} as const;

export class PoChartGridUtils {
  private isTypeDonut = false;
  constructor(private readonly component: PoChartComponent) {}

  setGridOption(options) {
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

  setOptionsAxis(options) {
    const tokenFontSizeGrid = this.resolvePx('--font-size-grid', '.po-chart');
    const tokenBorderWidthSm = this.resolvePx('--border-width-sm');

    options.xAxis = {
      type: this.component.isTypeBar ? 'value' : 'category',
      axisLabel: {
        fontFamily: this.component.getCSSVariable('--font-family-grid', '.po-chart'),
        fontSize: tokenFontSizeGrid || 12,
        fontWeight: Number(this.component.getCSSVariable('--font-weight-grid', '.po-chart')),
        color: this.component.getCSSVariable('--text-color-grid', '.po-chart'),
        rotate: this.component.options?.axis?.rotateLegend,
        interval: 0,
        width: 72,
        overflow: 'break'
      },
      splitLine: {
        show: this.component.isTypeBar
          ? (this.component.options?.axis?.showXAxis ?? true)
          : this.component.options?.axis?.showXAxis || false,
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
        color: this.component.getCSSVariable('--text-color-grid', '.po-chart'),
        fontWeight: Number(this.component.getCSSVariable('--font-weight-grid', '.po-chart'))
      },
      splitLine: {
        show: this.component.isTypeBar
          ? this.component.options?.axis?.showYAxis || false
          : (this.component.options?.axis?.showYAxis ?? true),
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

  setOptionDataZoom(options) {
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

  setShowAxisDetails(options) {
    if (this.component.options?.axis?.showAxisDetails) {
      options.tooltip = {
        trigger: 'none',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: this.component.getCSSVariable('--color-neutral-dark-70')
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
        color: !this.component.options?.fillPoints
          ? this.component.getCSSVariable('--color-chart-line-point-fill', '.po-chart')
          : color,
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
      serie.blur = {
        itemStyle: { opacity: 0.4 }
      };
      this.component.boundaryGap = true;
    }
  }

  setSerieTypeDonutPie(serie: any, color: string) {
    if (this.component.listTypePieDonut?.length) {
      const borderWidth = this.resolvePx('--border-width-sm');
      const borderColor = this.component.getCSSVariable('--border-color', '.po-chart');
      const seriePie = {
        name: serie.name,
        value: serie.data,
        itemStyle: {
          borderWidth: borderWidth,
          borderColor: borderColor,
          color: color,
          borderRadius: this.component.options?.borderRadius
        },
        label: { show: this.isTypeDonut && this.component.options?.textCenterGraph }
      };
      this.component.listTypePieDonut[0].data.push(seriePie);
    }
  }

  setListTypeDonutPie(type: PoChartType) {
    if (type === PoChartType.Donut) {
      this.isTypeDonut = true;
      this.component.itemsTypeDonut = this.normalizeToPercentage(this.component.series);
    }
    let radiusHorizontal = '80%';
    let radiusVertical = '55%';
    let positionHorizontal;
    if (this.component.options?.legend === false) {
      radiusHorizontal = '95%';
      radiusVertical = '65%';
      positionHorizontal = '50%';
    } else {
      positionHorizontal = this.component.options?.legendVerticalPosition === 'top' ? '54%' : '46%';
    }

    if (this.component.options?.innerRadius) {
      radiusVertical = this.getAdjustedRadius(radiusVertical, this.component.options.innerRadius);
    }
    const radius = this.isTypeDonut ? [radiusVertical, radiusHorizontal] : radiusHorizontal;
    this.component.listTypePieDonut = [
      {
        type: 'pie',
        center: ['50%', positionHorizontal],
        radius: radius,
        roseType: this.component.options?.roseType ? 'area' : undefined,
        label: {
          show: !!(this.isTypeDonut && this.component.options?.textCenterGraph),
          position: 'center',
          formatter: this.component.options?.textCenterGraph,
          fontSize: this.resolvePx('--font-size-md'),
          fontWeight: Number(this.component.getCSSVariable('--font-weight-hightlight-value', '.po-chart')),
          fontFamily: this.component.getCSSVariable('--font-family-hightlight-value', '.po-chart'),
          color: this.component.getCSSVariable('--color-hightlight-value', '.po-chart')
        },
        emphasis: { focus: 'self' },
        data: [],
        blur: { itemStyle: { opacity: 0.4 } }
      }
    ];
  }

  private getAdjustedRadius(radius: string, innerRadius: number): string {
    const radiusValue = parseFloat(radius);
    if (innerRadius >= 100) {
      return radius;
    }
    const adjusted = radiusValue * (innerRadius / 100);
    return `${adjusted}%`;
  }

  private normalizeToPercentage(series: Array<PoChartSerie>) {
    const total =
      series
        .map(item => item.data)
        .filter((value): value is number => typeof value === 'number')
        .reduce((sum, value) => sum + value, 0) || 1;

    return series.map(item => ({
      label: item.label,
      data: item.data,
      valuePercentage: +(((item.data as number) / total) * 100).toFixed(2)
    }));
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
        options.bottomDataZoom = gridPaddingValues.bottomDataZoomValueTopLegend;
      }
      return gridPaddingValues.paddingBottomWithTopLegend;
    } else if (options?.dataZoom && options.bottomDataZoom && options.legendVerticalPosition !== 'top') {
      if (typeof options.bottomDataZoom === 'boolean' && options.bottomDataZoom === true) {
        options.bottomDataZoom = gridPaddingValues.bottomDataZoomValueBottomLegend;
      }
      return gridPaddingValues.paddingBottomWithBottomLegend;
    } else if (
      (options?.dataZoom && !options?.bottomDataZoom && options.legend === false) ||
      (!options?.dataZoom && options?.legend === false) ||
      (!options?.dataZoom && options?.legendVerticalPosition === 'top')
    ) {
      return gridPaddingValues.paddingBottomNoLegend;
    }
    return gridPaddingValues.paddingBottomWithTopLegend;
  }

  private hasTopLegendOrNoZoom(options): boolean {
    return (
      (options?.dataZoom && !options.bottomDataZoom) ||
      (options?.dataZoom && options.bottomDataZoom && options.legendVerticalPosition === 'top') ||
      (!options?.dataZoom && options?.legendVerticalPosition === 'top')
    );
  }

  private hasBottomLegendWithZoom(options): boolean {
    return (
      (options?.dataZoom && options.bottomDataZoom && options.legendVerticalPosition !== 'top') ||
      (!options?.dataZoom && options?.legendVerticalPosition !== 'top')
    );
  }

  private getPaddingTopGrid() {
    const options = this.component.options;
    if (this.hasTopLegendOrNoZoom(options)) {
      if (typeof options.bottomDataZoom === 'boolean' && options.bottomDataZoom === true) {
        options.bottomDataZoom = gridPaddingValues.bottomDataZoomValueTopLegend;
      }
      const fixed = this.component.dataLabel?.fixed && !options?.axis?.maxRange;
      return fixed ? gridPaddingValues.paddingTopWithDataLabelFixed : gridPaddingValues.paddingTopDefaultWithTopLegend;
    } else if (this.hasBottomLegendWithZoom(options)) {
      const fixed = this.component.dataLabel?.fixed && !options?.axis?.maxRange;
      return fixed
        ? gridPaddingValues.paddingTopWithDataLabelFixedBottomLegend
        : gridPaddingValues.paddingTopDefaultWithBottomLegend;
    }
  }
}

import { PoChartSerie } from '../po-chart/interfaces/po-chart-serie.interface';
import { PoChartComponent } from './po-chart.component';

export class PoChartGaugeUtils {
  constructor(private readonly component: PoChartComponent) {}

  setGaugeOptions(options, fontSizeText) {
    const series = this.component.series;
    if (
      this.component.isGaugeSingle ||
      this.component.options?.legend === false ||
      !series?.find(serie => serie.label)
    ) {
      return;
    }

    let currentX = 0;
    let currentY = 0;
    const lineHeight = 30;
    const gap = 20;
    const chartWidth = this.component.el.nativeElement.querySelector('#chart-id')?.clientWidth;
    const children = this.component.itemsTypeGauge
      .map((item, index) => {
        const label = item.label ?? '';
        const text = this.component.options?.showFromToLegend ? `${label} (${item.from}–${item.to})` : `${label}`;
        const estimatedTextWidth = text.length * (fontSizeText * 0.5) + 16;
        const itemWidth = estimatedTextWidth < 78 ? gap + estimatedTextWidth + 5 : gap + 90;

        if (currentX + itemWidth > chartWidth) {
          currentX = 0;
          currentY += lineHeight;
        }

        const itemGraphic = [
          {
            type: 'rect',
            shape: { width: 14, height: 14 },
            style: {
              fill: this.component.itemsColorTypeGauge[index]
            },
            left: currentX,
            top: currentY
          },
          {
            type: 'text',
            left: currentX + gap,
            top: currentY + 1,
            style: {
              text,
              fill: this.component.getCSSVariable('--color-legend', '.po-chart'),
              width: 85,
              overflow: 'break',
              fontSize: fontSizeText,
              fontFamily: this.component.getCSSVariable('--font-family-grid', '.po-chart'),
              fontWeight: this.component.getCSSVariable('--font-weight-grid', '.po-chart')
            }
          }
        ];

        currentX += itemWidth;

        return itemGraphic;
      })
      .flat();

    options.graphic = [
      {
        type: 'group',
        left: 'center',
        bottom: 0,
        layout: 'horizontal',
        children: children
      }
    ];
  }

  setListTypeGauge(serie: any, fontSizes: { fontSizeMd: number; fontSizeLg: number; fontSizeSubtitle: number }) {
    const series = this.component.series;
    this.component.isGaugeSingle = series?.length === 1 && !!series[0]?.data;
    if (this.component.isGaugeSingle) {
      const item = series[0];
      this.component.itemsTypeGauge = [
        {
          label: item.label,
          from: 0,
          to: item.data,
          valuePercentage: item.data
        }
      ];
    } else {
      this.component.itemsTypeGauge = this.normalizeToRelativePercentage(series);
    }
    const divWidth = this.component.el.nativeElement.querySelector('#chart-id')?.clientWidth ?? 0;
    const height = this.component.height;

    const properties = this.setPropertiesGauge(divWidth, height);

    const data = series[0];
    const fontSizeDetail = divWidth < 480 || height < 400 ? fontSizes.fontSizeMd : fontSizes.fontSizeLg;
    serie.type = 'gauge';
    serie.startAngle = 180;
    serie.endAngle = 0;
    serie.center = properties.center;
    serie.radius = properties.radius;
    serie.axisTick = { show: false };
    serie.splitLine = { show: false };
    serie.axisLabel = { show: false };
    serie.pointer = {
      show: !this.component.isGaugeSingle && this.component.options?.pointer !== false,
      offsetCenter: ['0%', '-45%'],
      length: properties.lengthPointer,
      itemStyle: {
        color: this.component.getCSSVariable('--color-gauge-pointer-color', '.po-chart')
      }
    };
    serie.progress = {
      show: false
    };
    serie.detail = {
      show: true,
      offsetCenter: [0, '-30%'],
      formatter: row => {
        if (this.component.isGaugeSingle) {
          return `${data.data}%`;
        } else if (this.component.valueGaugeMultiple) {
          return `${this.component.valueGaugeMultiple}%`;
        }
        return '';
      },
      fontSize: fontSizeDetail,
      fontWeight: Number(this.component.getCSSVariable('--font-weight-hightlight-value', '.po-chart')),
      fontFamily: this.component.getCSSVariable('--font-family-hightlight-value', '.po-chart'),
      color: this.component.getCSSVariable('--color-hightlight-value', '.po-chart')
    };
    serie.title = {
      show: !!this.component.options?.subtitleGauge,
      offsetCenter: [0, '-10%'],
      fontSize: fontSizes.fontSizeSubtitle,
      fontWeight: Number(this.component.getCSSVariable('--font-weight-description-chart', 'po-chart')),
      fontFamily: this.component.getCSSVariable('--font-family-description-chart', 'po-chart'),
      color: this.component.getCSSVariable('--color-description-chart', 'po-chart'),
      width: properties.widthSubtitle,
      overflow: 'break'
    };
    serie.data = [
      {
        value: this.component.isGaugeSingle ? data.data : this.component.valueGaugeMultiple,
        name: this.component.isGaugeSingle
          ? this.component.options?.subtitleGauge || data.label
          : this.component.options?.subtitleGauge
      }
    ];
    return serie;
  }

  private setPropertiesGauge(divWidth: number, height: number) {
    let radius = '140%';
    let lengthPointer = '40%';
    let center: [string, string] = ['50%', '80%'];
    let widthSubtitle = height < 450 ? 400 : 500;

    // 👇 Regras para telas pequenas
    const isSmallScreen = divWidth < 480;
    const isMediumScreen = divWidth >= 480 && divWidth < 960;
    const isLargeScreen = divWidth >= 960;

    // 👇 Ajustes por largura
    if (isSmallScreen) {
      radius = height > 480 ? '100%' : '120%';
      lengthPointer = '25%';
      widthSubtitle = 300;
      center = ['50%', '75%'];
    } else if (isMediumScreen) {
      radius = height > 550 ? '100%' : '120%';
      widthSubtitle = height > 499 ? 450 : 320;
      lengthPointer = '35%';
    } else if (isLargeScreen && height > 750) {
      radius = '100%';
    }

    // 👇 Ajuste específico para altura muito pequena
    if (height < 400) {
      return this.setPropertiesDefaultHeight(center);
    }
    return { radius, lengthPointer, center, widthSubtitle };
  }

  setPropertiesDefaultHeight(center: [string, string]) {
    const radius = '140%';
    const lengthPointer = '30%';
    const widthSubtitle = 210;
    return { radius, lengthPointer, center, widthSubtitle };
  }

  setSerieTypeGauge(serie: any, color: string) {
    if (serie.type === 'gauge') {
      this.component.itemsColorTypeGauge = [...this.component.itemsColorTypeGauge, color];
    }
  }

  private normalizeToRelativePercentage(series: Array<PoChartSerie>) {
    const numericSeries = series.filter(item => typeof item.to === 'number') as Array<PoChartSerie & { to: number }>;

    if (numericSeries.length === 0) return [];

    const sortedSeries = [...numericSeries].sort((a, b) => a.to - b.to);

    const max = sortedSeries[sortedSeries.length - 1].to;

    if (max === 0) {
      return sortedSeries.map(item => ({
        label: item.label,
        from: item.from,
        to: item.to,
        valuePercentage: 100
      }));
    }

    return sortedSeries.map(item => ({
      label: item.label,
      from: item.from,
      to: item.to,
      valuePercentage: +((item.to / max) * 100).toFixed(2)
    }));
  }

  finalizeSerieTypeGauge(serie) {
    let colors;
    if (this.component.isGaugeSingle) {
      colors = [
        [this.component.itemsTypeGauge[0].valuePercentage / 100, this.component.itemsColorTypeGauge[0]],
        [1, this.component.getCSSVariable('--color-base-gauge', '.po-chart')]
      ];
    } else {
      colors = this.buildGaugeAxisLineColorsWithGaps(
        this.component.itemsTypeGauge,
        this.component.itemsColorTypeGauge,
        this.component.getCSSVariable('--color-base-gauge', '.po-chart')
      );
    }
    return [
      {
        ...serie,
        axisLine: {
          lineStyle: {
            width: 40,
            color: colors
          }
        }
      }
    ];
  }

  private buildGaugeAxisLineColorsWithGaps(
    series: Array<{ label: string; from: number; to: number }>,
    colorPalette: Array<string>,
    gapColor
  ) {
    const sortedSeries = [...series].sort((a, b) => a.from - b.from);
    const maxTo = Math.max(...sortedSeries.map(s => s.to));
    const colorSegments = [];

    let lastTo = 0;

    sortedSeries.forEach((segment, index) => {
      const { from, to } = segment;
      const color = colorPalette[index % colorPalette.length];

      // gap entre o último "to" e o próximo "from"
      if (from > lastTo) {
        colorSegments.push([+(from / maxTo).toFixed(4), gapColor]);
      }

      colorSegments.push([+(to / maxTo).toFixed(4), color]);
      lastTo = to;
    });

    // gap final, se o último "to" não cobriu até o maxTo
    if (lastTo < maxTo) {
      colorSegments.push([1, gapColor]);
    }

    return colorSegments;
  }
}

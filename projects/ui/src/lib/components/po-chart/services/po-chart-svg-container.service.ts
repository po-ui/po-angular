import { Injectable } from '@angular/core';

import { PoChartPadding } from '../helpers/po-chart-default-values.constant';
import { PoChartContainerSize } from '../interfaces/po-chart-container-size.interface';

@Injectable({
  providedIn: 'root'
})
export class PoChartSvgContainerService {
  constructor() {}

  /**
   * Retorna um objeto do tipo PoChartContainerSize contendo as dimensões necessárias para plotagem do SVG.
   * @param chartHeight
   * @param chartWrapperWidth
   * @param chartHeaderHeight
   * @param chartLegendHeight
   */
  calculateSVGContainerMeasurements(
    chartHeight: number = 0,
    chartWrapperWidth: number = 0,
    chartHeaderHeight: number = 0,
    chartLegendHeight: number = 0
  ): PoChartContainerSize {
    const svgWidth = this.svgWidth(chartWrapperWidth);
    const centerX = this.center(chartWrapperWidth);
    const svgHeight = this.svgHeight(chartHeight, chartHeaderHeight, chartLegendHeight);
    const centerY = this.center(svgHeight);
    const svgPlottingAreaHeight = this.svgPlottingAreaHeight(svgHeight);

    return {
      svgWidth,
      svgHeight,
      centerX,
      centerY,
      svgPlottingAreaHeight
    };
  }

  // Largura do container.
  private svgWidth(chartWrapperWidth: number) {
    const wrapperWidth = chartWrapperWidth - PoChartPadding * 2;

    return wrapperWidth > 0 ? wrapperWidth : 0;
  }

  // O centro do container. Usado para gráficos do tipo circular.
  private center(dimension: number) {
    return dimension / 2;
  }

  // Altura do container
  private svgHeight(chartHeight: number, chartHeaderHeight: number, chartLegendHeight: number) {
    const subtractedHeights = chartHeight - chartHeaderHeight - chartLegendHeight - PoChartPadding * 2;

    return subtractedHeights <= 0 ? 0 : subtractedHeights;
  }

  /**
   * Altura da área de plotagem.
   * Subtrai a altura do container SVG pelo padding superior + área para overflow de labels do eixo X.
   */
  private svgPlottingAreaHeight(svgHeight: number) {
    return svgHeight - PoChartPadding - 8;
  }
}

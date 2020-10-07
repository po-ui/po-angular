import { Injectable } from '@angular/core';

import { PoChartAxisXLabelArea, PoChartPadding } from '../helpers/po-chart-default-values.constant';
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
   * @param categoriesLength
   */
  calculateSVGContainerMeasurements(
    chartHeight: number = 0,
    chartWrapperWidth: number = 0,
    chartHeaderHeight: number = 0,
    chartLegendHeight: number = 0,
    categoriesLength: number = 0
  ): PoChartContainerSize {
    const svgWidth = this.svgWidth(chartWrapperWidth);
    const centerX = this.center(chartWrapperWidth);
    const svgHeight = this.svgHeight(chartHeight, chartHeaderHeight, chartLegendHeight);
    const centerY = this.center(svgHeight);
    const svgPlottingAreaWidth = this.svgPlottingAreaWidth(svgWidth, categoriesLength);
    const svgPlottingAreaHeight = this.svgPlottingAreaHeight(svgHeight);

    return {
      svgWidth,
      svgHeight,
      centerX,
      centerY,
      svgPlottingAreaWidth,
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
   * Largura de área de plotagem das séries designada para gráficos do tipo linha e área.
   *
   * Contempla:
   *   - a largura do svg: svgWidth.
   *   - área dos labels eixo X: PoChartAxisXLabelArea
   *   - espaços laterais dentro do eixo: svgAxisSideSpace
   *
   * > A largura máxima para 'svgAxisSideSpace' é de 48px.
   */
  private svgPlottingAreaWidth(svgWidth: number, categoriesLength: number) {
    const categoryWidth = (svgWidth - PoChartAxisXLabelArea) / categoriesLength;
    const svgAxisSideSpace = categoryWidth <= PoChartPadding * 2 ? categoryWidth : PoChartPadding * 2;

    return svgWidth - PoChartAxisXLabelArea - svgAxisSideSpace;
  }

  /**
   * Altura da área de plotagem.
   * Subtrai a altura do container SVG pelo padding superior + área para overflow de labels do eixo X.
   */
  private svgPlottingAreaHeight(svgHeight: number) {
    return svgHeight - PoChartPadding - 8;
  }
}

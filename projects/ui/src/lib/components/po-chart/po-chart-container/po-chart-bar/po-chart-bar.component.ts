import { Component } from '@angular/core';

import { PoChartPlotAreaPaddingTop } from './../../helpers/po-chart-default-values.constant';

import { PoChartBarBaseComponent } from './po-chart-bar-base.component';
import { PoChartMathsService } from './../../services/po-chart-maths.service';

import { PoChartContainerSize } from './../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from './../../interfaces/po-chart-min-max-values.interface';

@Component({
  selector: '[po-chart-bar]',
  templateUrl: './po-chart-bar.component.svg'
})
export class PoChartBarComponent extends PoChartBarBaseComponent {
  readonly tooltipPosition = 'right';

  constructor(protected mathsService: PoChartMathsService) {
    super(mathsService);
  }

  protected barCoordinates(
    seriesIndex: number,
    serieItemDataIndex: number,
    containerSize: PoChartContainerSize,
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number
  ) {
    const { svgPlottingAreaWidth, barHeight, spaceBetweenBars } = this.calculateElementsMeasurements(containerSize);

    const { x1, x2 } = this.xCoordinates(
      minMaxSeriesValues,
      svgPlottingAreaWidth,
      containerSize.axisXLabelWidth,
      containerSize.svgWidth,
      serieValue
    );
    const { y1, y2 } = this.yCoordinates(
      seriesIndex,
      serieItemDataIndex,
      containerSize.svgPlottingAreaHeight,
      barHeight,
      spaceBetweenBars
    );

    return ['M', x1, y2, 'L', x2, y2, 'L', x2, y1, 'L', x1, y1, 'z'].join(' ');
  }

  private calculateElementsMeasurements(containerSize: PoChartContainerSize) {
    const { svgWidth, svgPlottingAreaHeight, axisXLabelWidth } = containerSize;

    // Fração das séries em relação à largura da categoria. Incrementa + 2 na extensão das séries pois se trata da área de margem entre as categorias.
    const svgPlottingAreaWidth = svgWidth - axisXLabelWidth;
    const categoryHeight = svgPlottingAreaHeight / this.seriesGreaterLength;
    const columnFraction = categoryHeight / (this.series.length + 2);

    // Área entre as colunas: retorna zero se houver apenas uma série.
    const spaceBetweenBars = this.series.length > 1 ? columnFraction / (this.series.length + 2) : 0;

    // Subtrai a fração das séries pelo espaço entre as colunas.
    const barHeight = columnFraction - (spaceBetweenBars * (this.series.length - 1)) / (this.series.length + 2);

    return { svgPlottingAreaWidth, barHeight, spaceBetweenBars };
  }

  private xCoordinates(
    minMaxSeriesValues: PoChartMinMaxValues,
    svgPlottingAreaWidth: number,
    axisXLabelWidth: PoChartContainerSize['axisXLabelWidth'],
    svgWidth: PoChartContainerSize['svgWidth'],
    serieValue: number
  ) {
    const { minValue } = minMaxSeriesValues;
    const valueZeroPercentage = this.mathsService.getSeriePercentage(minMaxSeriesValues, minValue < 0 ? 0 : minValue);
    const x1 = axisXLabelWidth + (svgWidth - axisXLabelWidth) * valueZeroPercentage;

    const xRatio = this.mathsService.getSeriePercentage(minMaxSeriesValues, serieValue);
    const x2 = Math.round(svgPlottingAreaWidth * xRatio + axisXLabelWidth);

    return { x1, x2 };
  }

  private yCoordinates(
    seriesIndex: number,
    serieItemDataIndex: number,
    svgPlottingAreaHeight: number,
    barHeight: number,
    spaceBetweenBars: number
  ) {
    const spaceBetweenAxisAndBars = barHeight;
    const yRatio = serieItemDataIndex / this.seriesGreaterLength;

    const y1 = Math.round(
      PoChartPlotAreaPaddingTop +
        svgPlottingAreaHeight * yRatio +
        spaceBetweenAxisAndBars +
        barHeight * seriesIndex +
        spaceBetweenBars * seriesIndex
    );

    const y2 = Math.round(y1 + barHeight);
    return { y1, y2 };
  }
}

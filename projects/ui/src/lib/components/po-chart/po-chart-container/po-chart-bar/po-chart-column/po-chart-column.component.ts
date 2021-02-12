import { Component } from '@angular/core';

import { PoChartAxisXLabelArea, PoChartPlotAreaPaddingTop } from '../../../helpers/po-chart-default-values.constant';

import { PoChartBarBaseComponent } from '../po-chart-bar-base.component';
import { PoChartMathsService } from '../../../services/po-chart-maths.service';

import { PoChartContainerSize } from '../../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from '../../../interfaces/po-chart-min-max-values.interface';

@Component({
  selector: '[po-chart-column]',
  templateUrl: '../po-chart-bar.component.svg'
})
export class PoChartColumnComponent extends PoChartBarBaseComponent {
  readonly tooltipPosition = 'top';

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
    const { svgWidth, svgPlottingAreaHeight } = containerSize;
    const { chartBarPlotArea, barWidth, spaceBetweenBars } = this.calculateElementsMeasurements(svgWidth);

    const { x1, x2 } = this.xCoordinates(seriesIndex, serieItemDataIndex, chartBarPlotArea, barWidth, spaceBetweenBars);
    const { y1, y2 } = this.yCoordinates(minMaxSeriesValues, svgPlottingAreaHeight, serieValue);

    return ['M', x1, y2, 'L', x2, y2, 'L', x2, y1, 'L', x1, y1, 'z'].join(' ');
  }

  private calculateElementsMeasurements(svgWidth: PoChartContainerSize['svgWidth']) {
    // Fração das séries em relação à largura da categoria. Incrementa + 2 na extensão das séries pois se trata da área de margem entre as categorias.
    const chartBarPlotArea = svgWidth - PoChartAxisXLabelArea;
    const categoryWidth = chartBarPlotArea / this.seriesGreaterLength;
    const columnFraction = categoryWidth / (this.series.length + 2);

    // Área entre as colunas: retorna zero se houver apenas uma série.
    const spaceBetweenBars = this.series.length > 1 ? columnFraction / (this.series.length + 2) : 0;

    // Subtrai a fração das séries pelo espaço entre as colunas.
    const barWidth = columnFraction - (spaceBetweenBars * (this.series.length - 1)) / (this.series.length + 2);

    return { chartBarPlotArea, barWidth, spaceBetweenBars };
  }

  private xCoordinates(
    seriesIndex: number,
    serieItemDataIndex: number,
    chartBarPlotArea: number,
    barWidth: number,
    spaceBetweenBars: number
  ) {
    // A área lateral entre a coluna e a linha do eixo Y do grid será sempre equivalente à largura da coluna.
    const spaceBetweenAxisAndBars = barWidth;
    const xRatio = serieItemDataIndex / this.seriesGreaterLength;

    const x1 = Math.round(
      PoChartAxisXLabelArea +
        chartBarPlotArea * xRatio +
        spaceBetweenAxisAndBars +
        barWidth * seriesIndex +
        spaceBetweenBars * seriesIndex
    );

    const x2 = Math.round(x1 + barWidth);

    return { x1, x2 };
  }

  private yCoordinates(minMaxSeriesValues: PoChartMinMaxValues, svgPlottingAreaHeight: number, serieValue: number) {
    // TO DO: tratamento para valores negativos.
    const filterNegativeSerieValue = serieValue <= 0 ? 0 : serieValue;

    const yRatio = this.mathsService.getSeriePercentage(minMaxSeriesValues, filterNegativeSerieValue);
    const y1 = Math.round(svgPlottingAreaHeight + PoChartPlotAreaPaddingTop);
    const y2 = Math.round(svgPlottingAreaHeight - svgPlottingAreaHeight * yRatio + PoChartPlotAreaPaddingTop);

    return { y1, y2 };
  }
}

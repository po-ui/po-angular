import { Component } from '@angular/core';

import { PoChartAxisXLabelArea, PoChartPlotAreaPaddingTop } from './../../helpers/po-chart-default-values.constant';

import { PoChartBarBaseComponent } from './po-chart-bar-base.component';
import { PoChartColorService } from './../../services/po-chart-color.service';
import { PoChartMathsService } from './../../services/po-chart-maths.service';

import { PoChartContainerSize } from './../../interfaces/po-chart-container-size.interface';
import { PoChartMinMaxValues } from './../../interfaces/po-chart-min-max-values.interface';

@Component({
  selector: '[po-chart-bar]',
  templateUrl: './po-chart-bar.component.svg'
})
export class PoChartBarComponent extends PoChartBarBaseComponent {
  constructor(protected colorService: PoChartColorService, protected mathsService: PoChartMathsService) {
    super(colorService, mathsService);
  }

  protected barCoordinates(
    seriesIndex: number,
    serieItemDataIndex: number,
    containerSize: PoChartContainerSize,
    minMaxSeriesValues: PoChartMinMaxValues,
    serieValue: number
  ) {
    const { svgWidth, svgPlottingAreaHeight } = containerSize;
    const { svgPlottingAreaWidth, barHeight, spaceBetweenBars } = this.calculateElementsMeasurements(
      svgWidth,
      svgPlottingAreaHeight
    );

    const { x1, x2 } = this.xCoordinates(minMaxSeriesValues, svgPlottingAreaWidth, serieValue);
    const { y1, y2 } = this.yCoordinates(
      seriesIndex,
      serieItemDataIndex,
      svgPlottingAreaHeight,
      barHeight,
      spaceBetweenBars
    );

    return ['M', x1, y2, 'L', x2, y2, 'L', x2, y1, 'L', x1, y1, 'z'].join(' ');
  }

  private calculateElementsMeasurements(
    svgWidth: PoChartContainerSize['svgWidth'],
    svgPlottingAreaHeight: PoChartContainerSize['svgPlottingAreaHeight']
  ) {
    // Fração das séries em relação à largura da categoria. Incrementa + 2 na extensão das séries pois se trata da área de margem entre as categorias.
    const svgPlottingAreaWidth = svgWidth - PoChartAxisXLabelArea;
    const categoryHeight = svgPlottingAreaHeight / this.seriesGreaterLength;
    const columnFraction = categoryHeight / (this.series.length + 2);

    // Área entre as colunas: retorna zero se houver apenas uma série.
    const spaceBetweenBars = this.series.length > 1 ? columnFraction / (this.series.length + 2) : 0;

    // Subtrai a fração das séries pelo espaço entre as colunas.
    const barHeight = columnFraction - (spaceBetweenBars * (this.series.length - 1)) / (this.series.length + 2);

    return { svgPlottingAreaWidth, barHeight, spaceBetweenBars };
  }

  private xCoordinates(minMaxSeriesValues: PoChartMinMaxValues, svgPlottingAreaWidth: number, serieValue: number) {
    // TO DO: tratamento para valores negativos.
    const filterNegativeSerieValue = serieValue <= 0 ? 0 : serieValue;

    const xRatio = this.mathsService.getSeriePercentage(minMaxSeriesValues, filterNegativeSerieValue);
    const x1 = PoChartAxisXLabelArea;
    const x2 = Math.round(svgPlottingAreaWidth * xRatio + PoChartAxisXLabelArea);

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

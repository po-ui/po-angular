import { Injectable } from '@angular/core';

import { PoChartType } from '../enums/po-chart-type.enum';
import { PoChartColors } from '../helpers/po-chart-colors.constant';
import { PoChartSerie } from '../interfaces/po-chart-serie.interface';
import { PoChartGaugeSerie } from '../po-chart-types/po-chart-gauge/po-chart-gauge-series.interface';

@Injectable({
  providedIn: 'root'
})
export class PoChartColorService {
  constructor() {}

  /**
   * Retorna um array de Hexadecimais. Valores retornados são defasados, fora do padrão, não permite customizações e deve ser refatorado.
   * @param series
   * @param type
   */
  getSeriesColor(series: Array<PoChartSerie | PoChartGaugeSerie>, type: PoChartType) {
    const colorsLength = PoChartColors.length - 1;

    if (!series) {
      return PoChartColors[colorsLength];
    }
    if (type === PoChartType.Gauge) {
      return PoChartColors[0];
    }

    const seriesLength = series.length - 1;

    if (seriesLength > colorsLength) {
      let colors = PoChartColors[colorsLength];

      // recupera o resultado da divisao entre tamanho das series e o numero de cores disponiveis
      const quantityDuplicates = seriesLength / colorsLength;

      for (let i = 1; i <= quantityDuplicates; i++) {
        colors = colors.concat(PoChartColors[colorsLength]);
      }

      return colors;
    }

    return PoChartColors[seriesLength];
  }
}

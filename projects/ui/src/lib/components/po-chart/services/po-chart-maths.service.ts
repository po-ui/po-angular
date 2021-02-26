import { Injectable } from '@angular/core';

import { PoChartGridLines } from '../helpers/po-chart-default-values.constant';
import { PoChartType } from '../enums/po-chart-type.enum';

import { PoChartAxisOptions } from '../interfaces/po-chart-axis-options.interface';
import { PoChartMinMaxValues } from '../interfaces/po-chart-min-max-values.interface';
import { PoChartOptions } from '../interfaces/po-chart-options.interface';
import { PoChartSerie } from '../interfaces/po-chart-serie.interface';

@Injectable({
  providedIn: 'root'
})
export class PoChartMathsService {
  /**
   * Calcula e retorna os válores mínimo e máximo das séries.
   *
   * @param series Lista de séries.
   * @param acceptNegativeValues boolean.
   */
  calculateMinAndMaxValues(series: Array<any>, acceptNegativeValues: boolean = true): PoChartMinMaxValues {
    const minValue = this.getDomain(series, 'min');
    const maxValue = this.getDomain(series, 'max');

    return {
      minValue: !acceptNegativeValues && minValue < 0 ? 0 : minValue,
      maxValue: acceptNegativeValues && maxValue < 0 ? 0 : maxValue
    };
  }

  /**
   * Retorna o valor com maior quantidade de dígitos entre todas as séries.
   * Pode receber uma lista de categorias para o caso de gráfico de barra, ou então a lista de séries se o tipo de gráfico for linha ou coluna.
   *
   * @param data Lista de séries.
   * @param type O tipo do gráfico'.
   * @param options As opções para validação de número de linhas do eixo X'.
   */
  getLongestDataValue(
    data: Array<PoChartSerie | string> = [],
    type: PoChartType,
    options: PoChartOptions
  ): number | string {
    if (type === PoChartType.Bar) {
      return this.sortLongestData<string>(data as Array<string>);
    } else {
      return this.getAxisXLabelLongestValue(data as Array<PoChartSerie>, this.amountOfGridLines(options?.axis));
    }
  }

  /**
   * Retorna o tamanho da série que tiver mais itens.
   *
   * @param series Lista de séries.
   */
  seriesGreaterLength(series: Array<PoChartSerie>): number {
    return series.reduce((result, serie: any) => (result > serie.data.length ? result : serie.data.length), 0);
  }

  /**
   * Retorna o percentual em decimal da série passada pela distância entre os valores mínimos e máximos da série.
   *
   * Se o valor mínimo for negativo o alcance partirá dele como sendo zero %.
   *
   * Por exemplo:
   *    minValue = -10;
   *    maxValue = 0;
   *    serieValue = -8
   *    O resultado será de 0.20;
   *
   * @param minMaxValues Objeto contendo os valores mínimo e máximo de todas as séries.
   * @param serieValue O valor da série.
   */
  getSeriePercentage(minMaxValues: any, serieValue: number): number {
    const { minValue, maxValue } = minMaxValues;

    const range = maxValue - minValue;
    const displacement = serieValue - minValue;
    const result = displacement / range;

    return isNaN(result) ? 0 : result;
  }

  /**
   * Calcula e retorna uma lista de valores referentes aos textos dos eixos X em relação à quantidade de linhas horizontais.
   *
   * @param minMaxValues Objeto contendo os valores mínimo e máximo de todas as séries.
   * @param gridLines Quantidade de linhas horizontais. Valor default é 5.
   */
  range(minMaxValues: PoChartMinMaxValues, gridLines: number = 5) {
    const { minValue, maxValue } = minMaxValues;

    const result = [];
    const step = this.getGridLineArea(minMaxValues, gridLines);

    for (let index = minValue; index <= maxValue; index = (index * 10 + step * 10) / 10) {
      result.push(index);
    }

    return result;
  }

  /**
   *
   * Verifica se o valor passado é um Integer ou Float.
   *
   * @param number O valor a ser validado
   */
  verifyIfFloatOrInteger(number: number) {
    const notABoolean = typeof number !== 'boolean';
    const notInfinity = number !== Infinity;

    const isInteger = Number(number) === number && number % 1 === 0 && notInfinity;
    const isFloat = Number(number) === number && number % 1 !== 0 && notInfinity;

    return (notABoolean && isInteger) || (notABoolean && isFloat);
  }

  private amountOfGridLines(options: PoChartAxisOptions): number {
    const gridLines = options?.gridLines ?? PoChartGridLines;

    return gridLines && gridLines >= 2 && gridLines <= 10 ? gridLines : PoChartGridLines;
  }

  private getAxisXLabelLongestValue(data: Array<PoChartSerie>, gridLines: number): number {
    const allowNegativeData: boolean = data.every(dataItem => dataItem.type === PoChartType.Line);
    const domain: PoChartMinMaxValues = this.calculateMinAndMaxValues(data, allowNegativeData);
    const axisXLabelsList: Array<number> = this.range(domain, gridLines);

    return this.sortLongestData<number>(axisXLabelsList);
  }

  // Cálculo que retorna o valor obtido de gridLines em relação ao alcance dos valores mínimos e máximos das séries (maxMinValues)
  private getGridLineArea(minMaxValues: PoChartMinMaxValues, gridLines: number) {
    const percentageValue = this.getFractionFromInt(gridLines - 1);
    const { minValue, maxValue } = minMaxValues;
    const result = (percentageValue * (maxValue - minValue)) / 100;

    return result === 0 ? 1 : result;
  }

  // Retorna o valor máximo ou mínimo das séries baseado no tipo passado(type).
  private getDomain(series: Array<any>, type: string) {
    const result = Math[type](
      ...series.map(serie => {
        if (Array.isArray(serie.data)) {
          return Math[type](...serie.data);
        }
      })
    );
    return isNaN(result) ? 0 : result;
  }

  // Retorna a fração do número passado referente à quantidade de linhas no eixo X (gridLines)
  private getFractionFromInt(value: number) {
    return (1 / value) * (100 / 1);
  }

  private sortLongestData<T>(serie: Array<T>): T {
    return serie.sort((longest, current) => {
      return current.toString().length - longest.toString().length;
    })['0'];
  }
}

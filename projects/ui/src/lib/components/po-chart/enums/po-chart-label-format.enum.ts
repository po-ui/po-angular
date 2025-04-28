/**
 * @usedBy PoChartComponent
 *
 * @description
 *
 * *Enum* `PoChartLabelFormat` para especificação dos tipos de formatação do eixo de valor no gráfico.
 */
export enum PoChartLabelFormat {
  /**
   * Os valores serão exibidos no formato numérico com duas casas decimais. Equivalente ao formato `'1.2-2'` da [DecimalPipe](https://angular.io/api/common/DecimalPipe).
   */
  Number = 'number',

  /**
   * Os valores serão exibidos com o símbolo monetário de acordo com a formatação padrão da aplicação, isto é, o valor do token [DEFAULT_CURRENCY_CODE](https://angular.dev/api/core/DEFAULT_CURRENCY_CODE). Para adequar ao padrão numérico brasileiro, é necessário configurar o [LOCALE_ID](https://angular.dev/api/core/LOCALE_ID) da aplicação. A configuração pode ser feita da seguinte forma:
   * ```
   * import { LOCALE_ID } from '@angular/core';
   * import { registerLocaleData } from '@angular/common';
   * import localePt from '@angular/common/locales/pt';
   *
   * registerLocaleData(localePt);
   *
   * @NgModule({
   *   providers: [
   *     { provide: LOCALE_ID, useValue: 'pt-BR' },
   *     { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }
   *   ]
   * })
   * export class AppModule { }
   * ```
   */
  Currency = 'currency'
}

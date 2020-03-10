/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para configuração das colunas do `po-table-detail`.
 */
export interface PoTableDetailColumn {
  /**
   * Formato de exibição do valor da coluna:
   * - Formato para moeda (currency). Exemplos: 'BRL', 'USD'.
   * - Formato para data (date): aceita apenas os caracteres de dia(dd), mês(MM ou mm) e ano (yyyy ou yy),
   * caso não seja informado um formato o mesmo será 'dd/MM/yyyy'. Exemplos: 'dd/MM/yyyy', 'dd-MM-yy', 'mm/dd/yyyy'.
   * - Formato para horário (time): aceita apenas os caracteres de hora(HH), minutos(mm), segundos(ss) e
   *  milisegundos(f-ffffff), os milisegundos são opcionais, caso não seja informado um formato o mesmo será
   * 'HH:mm:ss'. Exemplos: 'HH:mm', 'HH:mm:ss.ffffff', 'HH:mm:ss.ff', 'mm:ss.fff'.
   * - Formato para números (number): aceita um valor seguindo o padrão [**DecimalPipe**](https://angular.io/api/common/DecimalPipe)
   *  para formatação, e caso não seja informado, o número será exibido na sua forma original. Exemplo:
   *
   *  +  Valor de entrada: `50` e valor para formatação: `'1.2-5'` o resultado será: `50.00`
   */
  format?: string;

  /**
   * @optional
   *
   * @description
   *
   * Texto para título da coluna.
   */
  label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Nome identificador da coluna.
   */
  property?: string;

  /**
   * Tipo da coluna.
   *
   * Valores válidos:
   * - `currency`: valores monetários.
   *
   * - `date`: valor de datas.
   *  + Aceita os tipos _string_ e _Date_ padrão do Javascript,
   *  por exemplo: `'2017-11-28'` ou `new Date(2017, 10, 28)`.
   *
   * - `time`: valor de horário.
   * - `number`: valores numéricos.
   *
   * - `dateTime`: valor de data com horário.
   *  + Aceita o tipo _string_ no formato **ISO-8601** extendido **'yyyy-mm-ddThh:mm:ss+|-hh:mm'**
   * e o tipo _Date_ padrão do Javascript, por exemplo: `'2017-11-28T00:00:00-02:00'` ou `new Date(2017, 10, 28)`.
   *
   *  + Aceita o tipo _string_ nos formatos **'HH:mm:ss'** ou **'HH:mm:ss.ffffff'**, por exemplo: `'23:12:45'`.
   *
   * @default `string`
   */
  type?: string;
}

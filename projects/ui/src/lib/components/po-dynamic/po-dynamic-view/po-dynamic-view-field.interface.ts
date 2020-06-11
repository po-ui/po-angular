import { PoDynamicField } from '../po-dynamic-field.interface';

/**
 * @usedBy PoDynamicViewComponent
 *
 * @docsExtends PoDynamicField
 *
 * @description
 *
 * Interface para definição das propriedades dos campos de visualização que serão criados dinamicamente.
 */
export interface PoDynamicViewField extends PoDynamicField {
  /**
   * Indica se o campo será um `po-tag`.
   *
   * @default `false`
   */
  tag?: boolean;

  /**
   * Define uma cor para o campo do tipo *tag*.
   *
   * Valores válidos:
   *  - <span class="dot po-color-01"></span> `color-01`
   *  - <span class="dot po-color-02"></span> `color-02`
   *  - <span class="dot po-color-03"></span> `color-03`
   *  - <span class="dot po-color-04"></span> `color-04`
   *  - <span class="dot po-color-05"></span> `color-05`
   *  - <span class="dot po-color-06"></span> `color-06`
   *  - <span class="dot po-color-07"></span> `color-07`
   *  - <span class="dot po-color-08"></span> `color-08`
   *  - <span class="dot po-color-09"></span> `color-09`
   *  - <span class="dot po-color-10"></span> `color-10`
   *  - <span class="dot po-color-11"></span> `color-11`
   *  - <span class="dot po-color-12"></span> `color-12`
   */
  color?: string;

  /**
   * Define um ícone que será exibido ao lado do valor para o campo do tipo *tag*.
   *
   * > Veja os valores válidos na [biblioteca de ícones](guides/icons).
   */
  icon?: string;

  /**
   * Possibilita a inversão de cores para o campo do tipo `tag`,
   * tornando possível uma visualização de status ativo e inativo.
   *
   * > A cor do texto, do ícone e da borda ficam com a cor utilizada na propriedade `color` ou a cor default,
   * e a cor do fundo fica branca.
   *
   * @default `false`
   */
  inverse?: boolean;

  /**
   * Formato de exibição do valor do campo.
   *
   * Aplicado para casos específicos de acordo com o tipo do campo.
   *
   * **types**:
   * - `currency`: Aceita valores definidos para a propriedade `currencyCode` do
   *  [**CurrencyPipe**](https://angular.io/api/common/CurrencyPipe)
   * + Exemplos: 'BRL', 'USD'.
   * - `date`: Aceita valores definidos para a propriedade `format` do [**DatePipe**](https://angular.io/api/common/DatePipe)
   * e também aceita os caracteres de dia(dd), mês(MM ou mm) e ano (yyyy ou yy),
   * caso não seja informado um formato o mesmo será 'dd/MM/yyyy'. Exemplos: 'dd/MM/yyyy', 'dd-MM-yy', 'mm/dd/yyyy'.
   * - `time`: Aceita apenas os caracteres de hora(HH), minutos(mm), segundos(ss) e
   *  milisegundos(f-ffffff), os milisegundos são opcionais, caso não seja informado um formato o mesmo será
   * 'HH:mm:ss'. Exemplos: 'HH:mm', 'HH:mm:ss.ffffff', 'HH:mm:ss.ff', 'mm:ss.fff'.
   * - `number`: Aceita valores definidos para a propriedade `digitsInfo` do [**DecimalPipe**](https://angular.io/api/common/DecimalPipe)
   *  para formatação, e caso não seja informado, o número será exibido na sua forma original.
   *
   *  + Exemplo: com o valor de entrada: `50` e a valor para formatação: `'1.2-5'` o resultado será: `50.00`.
   */
  format?: string;

  /**
   * Informa a ordem de exibição do campo.
   *
   * Exemplo de utilização:
   *
   * ```
   * [
   *   { property: 'test 1', order: 2 },
   *   { property: 'test 2', order: 1 },
   *   { property: 'test 3' },
   *   { property: 'test 4', order: 3 }
   * ];
   * ```
   *
   * Na exibição a ordem ficará dessa forma:
   * ```
   * [
   *   { property: 'test 2', order: 1 },
   *   { property: 'test 1', order: 2 },
   *   { property: 'test 4', order: 3 },
   *   { property: 'test 3' }
   * ];
   * ```
   *
   * Só serão aceitos valores com números inteiros maiores do que zero.
   *
   * Campos sem `order` ou com valores negativos, zerados ou inválidos
   * serão os últimos a serem renderizados e seguirão o posicionamento dentro do
   * array.
   */
  order?: number;
}

import { PoDynamicField } from '../po-dynamic-field.interface';
import { PoDynamicViewRequest } from './interfaces/po-dynamic-view-request.interface';

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
   * Determina a cor da tag. As maneiras de customizar as cores são:
   * - Hexadeximal, por exemplo `#c64840`;
   * - RGB, como `rgb(0, 0, 165)`;
   * - O nome da cor, por exemplo `blue`;
   * - Usando uma das cores do tema do PO:
   * - Valores válidos:
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
   * Permite que seja exibido em tela, de forma concatenada as propriedades `fieldLabel` + `fieldValue`.
   * A ordem sempre será `fieldLabel` e depois `fieldValue`, não sendo possível alterar.
   *
   * > Propriedade funciona corretamente caso as propriedades `fieldLabel` e `fielValue` sejam válidas.
   *
   * @default `false`
   */
  concatLabelValue?: boolean;

  /**
   * Nome da propriedade do objeto retornado que será utilizado como descrição do campo.
   *
   * O valor padrão é: `label`.
   *
   */
  fieldLabel?: string;

  /**
   * Nome da propriedade do objeto retornado que será utilizado como valor do campo.
   *
   * O valor padrão é: `value`.
   *
   */
  fieldValue?: string;

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
   * Define que a propriedade `property` é uma lista ou um objeto.
   *
   * > Por padrão, espera-se que a lista ou o objeto esteja com as propriedades `label` e `value`.
   * Caso estejam com nomes diferentes, deve-se usar as propriedades `fieldLabel` e `fieldValue`.
   * > É ignorada caso a propriedade `searchService` esteja sendo utilizada.
   *
   * @default `false`
   */
  isArrayOrObject?: boolean;

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
   * e também aceita os caracteres de dia(dd), mês(MM) e ano (yyyy ou yy),
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

  /**
   * Defini o texto alternativo descrevendo a imagem.
   *
   * Exemplo de utilização:
   *
   * ```
   * [
   *   { property: 'imagem 1', image:'string', alt:'string', height:'300'},
   * ];
   * ```
   * **Componentes compatíveis:** `po-image`.
   *
   */
  alt?: string;

  /**
   * Defini o texto alternativo descrevendo a imagem.
   *
   * Exemplo de utilização:
   *
   * ```
   * [
   *   { property: 'imagem 1', image:'string', alt:'string', height:'number'},
   * ];
   * ```
   * **Componentes compatíveis:** `po-image`.
   *
   */
  height?: string;
  /**
   * Possibilita a utilização de imagem.
   *
   * Exemplo de utilização:
   *
   * ```
   * [
   *   { property: 'imagem 1', image:'string', alt:'string', height:'300'},
   * ];
   * ```
   *  * @default `false`
   *
   *  **Componentes compatíveis:** `po-image`.
   */
  image?: boolean;

  /**
   * Lista de opções que podem ser vinculadas à propriedade p-value.
   * Quando uma opção de valor é passada, sua propriedade label será atribuída à propriedade p-value.
   *
   * Exemplo de utilização:
   *
   * ```
   * fields = [
   *     {
   *       property: 'name', options: [
   *         {label: 'Anna', value: '1'},
   *         {label: 'Jhon', value: '2'},
   *         {label: 'Mark', value: '3'}
   *       ]
   *     }
   *   ];
   * ```
   *
   * ```
   * <!-- Passando o valor 2 referente ao Jhon -->
   * <po-dynamic-view [p-fields]="fields" [p-value]="{ name: '2' }"> </po-dynamic-view>
   * ```
   *
   */
  options?: Array<{ label: string; value: string | number }>;

  /**
   * Serviço customizado para um campo em específico.
   * Pode ser ser informada uma URL ou uma instancia do serviço baseado em PoDynamicViewRequest.
   * **Importante:**
   * > A propriedade `property` deve receber um valor válido independente de sua utilização para
   * execução correta.
   * > Para que funcione corretamente, é importante que o serviço siga o
   * [guia de API do PO UI](https://po-ui.io/guides/api).
   */
  searchService?: string | PoDynamicViewRequest;

  /** Texto exibido quando o valor do componente for *true*. */
  booleanTrue?: string;

  /** Texto exibido quando o valor do componente for *false*. */
  booleanFalse?: string;
}

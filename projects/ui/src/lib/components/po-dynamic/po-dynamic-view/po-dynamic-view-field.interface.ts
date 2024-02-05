import { PoComboFilter, PoMultiselectFilter } from '../../po-field';
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
   * Define o formato de exibição para o valor de um campo.
   *
   * - Quando `format` é uma `string`, o formato aplicado depende da propriedade **type** segue como usar cada tipo:
   *   - `currency`: Utiliza códigos de moeda definidos pelo [CurrencyPipe](https://angular.io/api/common/CurrencyPipe).
   *     Exemplos: Use 'BRL' para Real Brasileiro e 'USD' para Dólar Americano.
   *   - `date`: Adota formatos de data especificados pelo [DatePipe](https://angular.io/api/common/DatePipe).
   *     Suporta formatos personalizados, como dia (dd), mês (MM) e ano (yyyy ou yy).
   *     Formato padrão é 'dd/MM/yyyy'. Exemplos: 'dd/MM/yyyy', 'dd-MM-yy', 'mm/dd/yyyy'.
   *   - `time`: Aceita formatos de tempo, incluindo hora (HH), minutos (mm), segundos (ss) e opcionalmente
   *     milisegundos (f-ffffff). Formato padrão é 'HH:mm:ss'. Exemplos: 'HH:mm', 'HH:mm:ss.ffffff', 'HH:mm:ss.ff'.
   *   - `number`: Usa especificações do [DecimalPipe](https://angular.io/api/common/DecimalPipe) para formatação numérica.
   *     Na ausência de um formato específico, o número é exibido como fornecido.
   *     Exemplo: Entrada `50`, formato `'1.2-5'`, resulta em `50.00`.
   *
   * - Quando `format` é um `Array<string>`:
   *   - Cada elemento do array representa uma propriedade do objeto.
   *   - Os valores dessas propriedades são concatenados, separados pelo padrão ' - '.
   *   - Exemplo: Para `format: ["id", "name"]` e um objeto `{ id: 1, name: 'Carlos Diego' }`,
   *     o resultado será `'1 - Carlos Diego'`.
   *
   * @example Para formatar um campo de moeda, use format: "BRL".
   *          Para um campo de data, use format: "dd/MM/yyyy".
   *          Para combinar propriedades de um objeto em um campo, use format: ["id", "name"].
   */
  format?: string | Array<string>;

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
   *  Serviço que será utilizado para buscar os itens e preencher a lista de opções dinamicamente.
   *  Pode ser informada uma URL ou uma instancia do serviço baseado em PoComboFilter.
   *  **Importante**
   *  > Para que funcione corretamente, é importante que o serviço siga o
   *  [guia de API do PO UI](https://po-ui.io/guides/api).
   */
  optionsService?: string | PoComboFilter | PoMultiselectFilter;

  /**
   * Habilita a visualização de múltiplos itens.
   * Útil para exibir dados em formatos semelhantes aos componentes que suportam seleção múltipla.
   */
  optionsMulti?: boolean;

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

  /**
   * Objeto que será enviado como parâmetro nas requisições de busca `searchService` ou `optionsService`
   * utilizadas pelos campos que dependem de serviços para carregar seus dados.
   *
   * Por exemplo, para o parâmetro `{ age: 23 }` a URL da requisição ficaria:
   *
   * ``
   * url + /1?age=23
   * ``
   */
  params?: any;
}

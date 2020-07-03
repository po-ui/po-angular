import { PoTableBoolean } from './po-table-boolean.interface';
import { PoTableColumnIcon } from '../po-table-column-icon/po-table-column-icon.interface';
import { PoTableColumnLabel } from '../po-table-column-label/po-table-column-label.interface';
import { PoTableDetail } from '../po-table-detail/po-table-detail.interface';
import { PoTableSubtitleColumn } from '../po-table-subtitle-footer/po-table-subtitle-column.interface';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para configuração das colunas do `po-table`.
 *
 * As definições das colunas serão aplicadas linha a linha.
 */
export interface PoTableColumn {
  /**
   * Define uma ação na coluna quando o tipo da coluna for `link` ou `icon`.
   *
   * > Quando for do tipo `link` será enviado como primeiro parâmetro o valor da coluna
   * e no segundo parâmetro o objeto completo da linha. Caso tenha sido definido uma ação e um link na coluna, a ação
   * será executada ao invés do link.
   *
   * > Quando for do tipo `icon` enviará o objeto completo da linha e o segundo parâmetro será a definição da coluna.
   */
  action?: Function;

  /**
   * Define um objeto do tipo `PoTableBoolean` para as colunas do tipo _boolean_. Por exemplo:
   *
   * ```
   *  { property: 'approbation', type: 'boolean', boolean: {
   *    trueLabel: 'Accepted', falseLabel: 'Rejected'
   *  }}
   * ```
   *
   * > Caso não seja definido um objeto para colunas do tipo *boolean*,
   * esta exibirá por padrão `Sim` e `Não` de acordo com os valores _booleanos_.
   */
  boolean?: PoTableBoolean;

  /**
   * @optional
   *
   * @description
   *
   * Define a cor que será aplicada no conteúdo da coluna.
   *
   * Valores válidos:
   * - <span class="dot po-color-01"></span> `color-01`
   * - <span class="dot po-color-02"></span> `color-02`
   * - <span class="dot po-color-03"></span> `color-03`
   * - <span class="dot po-color-04"></span> `color-04`
   * - <span class="dot po-color-05"></span> `color-05`
   * - <span class="dot po-color-06"></span> `color-06`
   * - <span class="dot po-color-07"></span> `color-07`
   * - <span class="dot po-color-08"></span> `color-08`
   * - <span class="dot po-color-09"></span> `color-09`
   * - <span class="dot po-color-10"></span> `color-10`
   * - <span class="dot po-color-11"></span> `color-11`
   * - <span class="dot po-color-12"></span> `color-12`
   *
   * > Existe a possibilidade de informar uma função que retorne um dos valores aceitos, serão passados
   * por parâmetro a linha e a coluna atual, por exemplo:
   *
   * ```
   * (row, column) => { row[column] == 'text' ? 'color-03' : 'color-09' }
   * ```
   *
   * > É possível também usá-la na coluna do tipo `icons` para alteração das cores de seu conteúdo conforme exemplo abaixo,
   * contudo, desta forma sobrepõe a cor especificada em cada objeto caso haja:
   *
   * ```
   * { property: 'columnIcon', label: 'Like', type: 'icon', color: 'color-08', icons: [
   *   { value: 'po-icon-star', action: () => this.notification() }
   * ]},
   * ```
   */
  color?: string | Function;

  /**
   * Define um objeto que segue a interface `PoTableDetail`, para as colunas de detalhes. Por exemplo:
   *
   * ```
   * { columns: [{ property: 'package', label: 'Pacote' }], typeHeader: 'top' }
   * ```
   *
   */
  detail?: PoTableDetail;

  /**
   * Função que deve retornar um booleano para habilitar ou desabilitar o *link* e sua ação.
   *
   * > Propriedade disponível nas colunas do tipo `link`.
   */
  disabled?: Function;

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
   *  +  Com o valor de entrada: `50` e a valor para formatação: `'1.2-5'` o resultado será: `50.00`
   */
  format?: string;

  /**
   * @description
   *
   * Define um *array* de objetos para colunas de ícones que irá sobrepor os valores como `action` e `color`
   * definidos na coluna, à partir do *value* da [`PoTableColumnIcon`](documentation/po-table#tableColumnIcon), por exemplo:
   *
   * ```
   *  { property: 'columnIcon', label: 'Icons', type: 'icon', action: this.favorite.bind(this), icons: [
   *    { value: 'delete', icon: 'po-icon-plus', color: 'color-06', action: this.add.bind(this), tooltip: 'Adiciona um novo item' },
   *    { value: 'edit', icon: 'po-icon-edit', action: this.edit.bind(this) },
   *    { value: 'delete', icon: 'po-icon-delete', color: 'color-12', action: this.remove.bind(this) }
   *  ]},
   * ```
   *
   * ```
   *  ...
   *  { id: 1, columnIcon: ['po-icon-edit', 'po-icon-remove', 'po-icon-star'] }
   *  ...
   *
   * ```
   */
  icons?: Array<PoTableColumnIcon>;

  /**
   * Texto para título da coluna.
   *
   * Caso não seja informado, será utilizado como *label* o valor da propriedade *property* com a primeira letra em maiúsculo.
   */
  label?: string;

  /**
   * Define um array de objetos para as colunas de label, onde 'labels' é uma lista de objetos
   * do tipo `PoTableColumnLabel` na qual devem ser definidas os labels. Por exemplo:
   *
   * ```
   * { property: 'flightStatus', label: 'Status', type: 'label', width:'100px', labels: [
   *  { value: 'confirmed', color: 'color-11', label: 'Confirmado', tooltip: 'Flight Status' },
   *  { value: 'delayed', color: 'color-08', label: 'Atrasado', tooltip: 'Flight Status' }
   * }
   * ```
   *
   */
  labels?: Array<PoTableColumnLabel>;

  /**
   * Define o nome da propriedade que conterá o `link` a ser redirecionado.
   *
   * @default link
   */
  link?: string;

  /** Nome identificador da coluna. */
  property?: string;

  /**
   * Define um array de objetos para as colunas de legenda. Onde, `subtitles` é uma lista de objetos do tipo PoTableSubtitle na qual
   * devem ser definidas as opções de legenda. Por exemplo:
   *
   * ```
   * { property: 'flightStatus', label: 'Status', color: 'subtitle', width:'100px', subtitles: [
   *  { value: 'confirmed', color: 'color-11', label: 'Confirmado', content: '1' },
   *  { value: 'delayed', color: 'color-08', label: 'Atrasado', content: '2' }
   * }
   * ```
   * Nesse exemplo a coluna escolhida para legenda é 'flightStatus', se o valor dessa coluna for 'confirmed', o texto da legenda será
   * 'Confirmado'.
   *
   */
  subtitles?: Array<PoTableSubtitleColumn>;

  /**
   * Define um texto de ajuda que será exibido ao passar o *mouse* sobre um texto.
   *
   * > O tooltip só será visível se for uma coluna do tipo *link*.
   *
   * > Caso a propriedade `p-hide-text-overflow` esteja habilitada e o conteúdo da célula exceder a largura da coluna,
   * é ignorado o valor atribuído ao *tooltip* e será exibido justamente o conteúdo da célula.
   */
  tooltip?: string;

  /**
   * Tipo da coluna.
   *
   * Valores válidos:
   * - `boolean`: Exibirá por padrão `Sim` e `Não` de acordo com os valores *booleanos*.
   * > Caso necessite exibir valores diferentes do padrão, deve-se utilizar a propriedade `boolean` desta interface.
   * - `currency`: valores monetários.
   *
   * - `date`: valor de datas.
   *  + Aceita os tipos _string_ e _Date_ padrão do Javascript,
   *  por exemplo: `'2017-11-28'` ou `new Date(2017, 10, 28)`.
   *
   * - `dateTime`: valor de data com horário.
   *  + Aceita o tipo _string_ no formato **ISO-8601** extendido **'yyyy-mm-ddThh:mm:ss+|-hh:mm'**
   * e o tipo _Date_ padrão do Javascript, por exemplo: `'2017-11-28T00:00:00-02:00'` ou `new Date(2017, 10, 28)`.
   *
   * - `detail`: array de objetos para o master-detail.
   * - `icon`: *array* de *string* ou objetos para a coluna de ícones.
   * - `label`: texto com destaque.
   * - `link`: habilita link na coluna para ação ou navegação.
   * - `number`: valores numéricos.
   * - `string`: textos.
   * - `subtitle`: array de objetos para a coluna de legenda.
   *
   * - `time`: valor de horário.
   *  + Aceita o tipo _string_ nos formatos **'HH:mm:ss'** ou **'HH:mm:ss.ffffff'**, por exemplo: `'23:12:45'`.
   * - `cellTemplate`: Indica que a coluna será utilizada como template, em conjunto com o
   * [PoTableCellTemplate](/documentation/po-table-cell-template).
   * - `columnTemplate`: Indica que a coluna será utilizada como template, em conjunto com o
   * [PoTableColumnTemplate](/documentation/po-table-column-template).
   *
   * @default `string`
   */
  type?: string;

  /**
   * @optional
   *
   * @description
   *
   * Controla a exibição da coluna. Caso seja definido um valor falso, a coluna não será exibida mas mas será possível torná-la
   * visível através do **gerenciador de colunas**.
   *
   * > A disponibilidade de visualização pode limitar-se de acordo com a definição de `p-max-columns`.
   *
   * @default `true`
   */
  visible?: boolean;

  /**
   * A largura da coluna pode ser informada em pixels ou porcentagem.
   * > Exemplo: '100px' ou '20%'.
   */
  width?: string;
}

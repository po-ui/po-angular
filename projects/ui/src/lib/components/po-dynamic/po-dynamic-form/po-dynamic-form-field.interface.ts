import { TemplateRef } from '@angular/core';
import {
  PoCheckboxGroupOption,
  PoComboFilter,
  PoComboLiterals,
  PoDatepickerIsoFormat,
  PoDatepickerRangeLiterals,
  PoLookupFilter,
  PoLookupLiterals,
  PoMultiselectFilterMode,
  PoMultiselectLiterals,
  PoSwitchLabelPosition,
  PoUploadLiterals,
  PoUploadFileRestrictions
} from '../../po-field';
import { PoLookupAdvancedFilter } from '../../po-field/po-lookup/interfaces/po-lookup-advanced-filter.interface';
import { PoLookupColumn } from '../../po-field/po-lookup/interfaces/po-lookup-column.interface';
import { PoMultiselectOption } from '../../po-field/po-multiselect/po-multiselect-option.interface';
import { PoSelectOption } from '../../po-field/po-select/po-select-option.interface';
import { ForceOptionComponentEnum } from '../po-dynamic-field-force-component.enum';

import { PoDynamicField } from '../po-dynamic-field.interface';

/**
 * @usedBy PoDynamicFormComponent, PoAdvancedFilterComponent, PoPageDynamicSearchComponent
 *
 * @docsExtends PoDynamicField
 *
 * @description
 *
 * Interface para definição das propriedades dos campos de entrada que serão criados dinamicamente.
 */
export interface PoDynamicFormField extends PoDynamicField {
  /**
   * Define as colunas para utilização da busca avançada. Usada somente em conjunto com a propriedade `searchService`,
   * essa propriedade deve receber um array de objetos que implementam a interface [`PoLookupColumn`](/documentation/po-lookup).
   *
   * > Caso sejam informadas colunas, deve-se obrigatoriamente conter colunas definidas como *label* e *value* para valores
   * de tela e do model respectivamente.
   *
   * **Componentes compatíveis:** `po-radio-group`, `po-lookup`, `po-checkbox-group`.
   */
  columns?: Array<PoLookupColumn> | number;

  /** Define a obrigatoriedade do campo. */
  required?: boolean;

  /**
   * Define se a indicação de campo opcional será exibida.
   *
   * > A indicação não será exibida, se:
   * - O campo for `required`, ou;
   * - Não possuir `help` e `label`.
   */
  optional?: boolean;

  /**
   * Lista de opções que serão exibidos em um componente, podendo selecionar uma opção.
   *
   * **Componentes compatíveis:** `po-select`, `po-radio-group`, `po-checkbox-group`, `po-multiselect`.
   * */
  options?:
    | Array<string>
    | Array<PoSelectOption>
    | Array<PoMultiselectOption>
    | Array<PoCheckboxGroupOption>
    | Array<any>;

  /**
   * Permite que o usuário faça múltipla seleção dentro da lista de opções.
   */
  optionsMulti?: boolean;

  /**
   *  Serviço que será utilizado para buscar os itens e preencher a lista de opções dinamicamente.
   *  Pode ser informada uma URL ou uma instancia do serviço baseado em PoComboFilter.
   *  **Importante**
   *  > Para que funcione corretamente, é importante que o serviço siga o
   *  [guia de API do PO UI](https://po-ui.io/guides/api).
   */
  optionsService?: string | PoComboFilter;

  /**
   * Serviço que será utilizado para realizar a busca avançada. Pode ser utilizado em conjunto com a propriedade `columns`.
   * Pode ser ser informada uma URL ou uma instancia do serviço baseado em PoLookupFilter.
   * **Importante:**
   * > Caso utilizar a propriedade `optionsService` esta propriedade será ignorada.
   * > Para que funcione corretamente, é importante que o serviço siga o
   * [guia de API do PO UI](https://po-ui.io/guides/api).
   */
  searchService?: string | PoLookupFilter;

  /**
   * Máscara para o campo.
   *
   * **Componentes compatíveis:** `po-input`.
   * > também é atribuído ao utilizar a propriedade `type: time`.
   */
  mask?: string;

  /**
   * Define que o valor do componente será conforme especificado na mascára. O valor padrão é `false`.
   *
   * **Componentes compatíveis:** `po-input`.
   * > também é atribuído ao utilizar a propriedade `type: time`.
   * */
  maskFormatModel?: boolean;

  /** Define o ícone que será exibido no início do campo.
   * > Esta propriedade só pode ser utilizado nos campos:
   * - Input;
   * - Number;
   * - Decimal;
   * - Combo;
   * - Password;
   *
   * > Veja a disponibilidade de ícones em [biblioteca de ícones](guides/icons).
   */
  icon?: string | TemplateRef<void>;

  /**  Quantidade máxima de casas decimais.
   *
   * > Esta propriedade só pode ser utilizada quando o `type` for *currency* ou *decimal*.
   */
  decimalsLength?: number;

  /** Quantidade máxima de dígitos antes do separador decimal. O valor máximo permitido é 13
   *
   * > Esta propriedade só pode ser utilizada quando o `type` for *currency* ou *decimal*.
   */
  thousandMaxlength?: number;

  /**
   * Regex para validação do campo.
   *
   * **Componentes compatíveis:** `po-input`, `po-password`.
   * */
  pattern?: string;

  /**
   * Tamanho mínimo de caracteres.
   *
   * **Componentes compatíveis:** `po-input`, `po-number`, `po-decimal`, `po-textarea`, `po-password`.
   * */
  minLength?: number;

  /**
   * Tamanho máximo de caracteres.
   *
   * **Componentes compatíveis:** `po-input`, `po-number`, `po-decimal`, `po-textarea`, `po-password`.
   */
  maxLength?: number;

  /** Desabilita o campo caso informar o valor *true*. */
  disabled?: boolean;

  /** Texto de ajuda. */
  help?: string;

  /** Texto exibido quando o valor do componente for *true*. */
  booleanTrue?: string;

  /** Texto exibido quando o valor do componente for *false*. */
  booleanFalse?: string;

  /**
   * Indica se o `model` receberá o valor formatado pelas propriedades `p-label-on` e `p-label-off` ou
   * apenas o valor puro (sem formatação).
   *
   * O valor padrão é: `false`.
   *
   * > Esta propriedade está disponivel  apenas para o `swicth`.
   */
  formatModel?: boolean;

  /**
   * Valor máximo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date* ou *dateTime*.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-number`, `po-decimal`
   * */
  maxValue?: string | number;

  /**
   * Valor mínimo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date* ou *dateTime*.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-number`, `po-decimal`
   */
  minValue?: string | number;

  /** Quantidade de linhas exibidas no `po-textarea`. */
  rows?: number;

  /** Esconde a informação estilo *password*, pode ser utilizado quando o tipo de dado for *string*. */
  secret?: boolean;

  /**
   * Função ou serviço para validar as **mudanças do campo**.
   *
   * * A propriedade aceita os seguintes tipos:
   * - **String**: Endpoint usado pelo componente para requisição via `POST`.
   * - **Function**: Método que será executado.
   *
   * Ao ser executado, irá receber como parâmetro um objeto com o nome da propriedade
   * alterada e o novo valor, conforme a interface `PoDynamicFormFieldChanged`:
   *
   * ``
   * { property: 'property name', value: 'new value' }
   * ``
   *
   * O retorno desta função deve ser do tipo [PoDynamicFormFieldValidation](documentation/po-dynamic-form#po-dynamic-form-field-validation),
   * onde o usuário poderá determinar as novas propriedades do campo.
   * Por exemplo:
   *
   * ``
   * onChangeField(changeValue): PoDynamicFormFieldValidation {
   *
   * if (changeValue.property === 'birthday' && !this.validate('birthday')) {
   *   return {
   *     value: '',
   *     field: { property: 'birthday', required: true },
   *     focus: true
   *   };
   * }
   * ``
   *
   * Para referenciar a sua função utilize a propriedade `bind`, por exemplo:
   * ``
   * { property: 'state', gridColumns: 6, validate: this.myFunction.bind(this) }
   * ``
   */
  validate?: string | Function;

  /**
   * Objeto que será enviado como parâmetro nas requisições de busca usados pelos componentes `po-lookup` e
   * `po-combo`.
   *
   * Por exemplo, para o parâmetro `{ age: 23 }` a URL da requisição ficaria:
   *
   * ``
   * url + ?age=23&filter=Peter
   * ``
   */
  params?: any;

  /**
   * Mensagem que será apresentada quando o campo ficar inválido.
   *
   * O campo fica inválido quando as seguintes propriedades não forem respeitadas:
   *  - pattern;
   *  - minValue;
   *  - maxValue;
   *
   * > Esta mensagem não é apresentada quando o campo estiver vazio, mesmo que ele seja requerido.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-input`, `po-number`, `po-decimal`, `po-password`.
   */
  errorMessage?: string;

  /**
   * Formato de exibição no campo.
   *
   * Ao utilizar esta propriedade com o `type` *PoDynamicFieldType.Date* ou *PoDynamicFieldType.DateTime*,
   * pode ser utilizada para formatação de exibição da data:
   *
   * Valores válidos:
   *
   * - dd/mm/yyyy
   * - mm/dd/yyyy
   * - yyyy/mm/dd
   *
   *
   * Também pode-se utilizar em conjunto com `searchService`, informando uma lista de propriedades que será utilizado
   * para formatação da exibição no campo, por exemplo: ["id", "name"].
   */
  format?: string | Array<string>;

  /**
   * Nome da propriedade do objeto retornado que será utilizado como descrição do campo.
   *
   * O valor padrão é: `label`.
   *
   * > Esta propriedade pode ser utilizada em conjunto com: `options`, `optionsService` e `searchService`.
   */
  fieldLabel?: string;

  /**
   * Nome da propriedade do objeto retornado que será utilizado como valor do campo.
   *
   * O valor padrão é: `value`.
   *
   * > Esta propriedade pode ser utilizada em conjunto com: `options`, `optionsService` e `searchService`.
   */
  fieldValue?: string;

  /**
   * Informa a ordem de exibição do campo.
   *
   * Exemplo de utilização:
   *
   * ``
   * [
   *   { property: 'test 1', order: 2 },
   *   { property: 'test 2', order: 1 },
   *   { property: 'test 3' },
   *   { property: 'test 4', order: 3 }
   * ];
   * ``
   *
   * Na exibição a ordem ficará dessa forma:
   * ``
   * [
   *   { property: 'test 2', order: 1 },
   *   { property: 'test 1', order: 2 },
   *   { property: 'test 4', order: 3 },
   *   { property: 'test 3' }
   * ];
   * ``
   *
   * Só serão aceitos valores com números inteiros maiores do que zero.
   *
   * Campos sem `order` ou com valores negativos, zerados ou inválidos
   * serão os últimos a serem renderizados e seguirão o posicionamento dentro do
   * array.
   */
  order?: number;

  /** Mensagem que será exibida enquanto o campo não estiver preenchido. */
  placeholder?: string;

  /**
   * Define a localidade a ser utilizada no componente.
   * Por padrão o valor será configurado segundo a o módulo [`I18n`](documentation/po-i18n)
   *
   * Exemplo de utilização:
   * ``
   * [
   *   { property: 'birthday', locale: 'en', type: 'date' },
   *   { property: 'wage', locale: 'ru', type: 'currency' }
   * ];
   * ``
   *
   * > Para ver quais linguagens suportadas acesse [`I18n`](documentation/po-i18n)
   * > A propriedade será repassada para os componentes que suportam a mesma.
   */
  locale?: string;

  /**
   * O controle passa a permitir a entrada de um intervalo ao invés de um único valor.
   *
   * > Atualmente essa propriedade está disponível apenas para o tipo 'date' e 'dateTime'.
   */
  range?: boolean;

  /** Indica que o campo será somente leitura.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-input`, `po-number`, `po-decimal`, `po-select`, `po-textarea`, `po-password`
   */
  readonly?: boolean;

  /**
   * Permite a seleção de múltiplos itens.
   *
   * **Componente compatível:** `po-lookup`, `po-upload`
   */
  multiple?: boolean;

  /** Se verdadeiro, o campo receberá um botão para ser limpo.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-input`, `po-number`, `po-decimal`, `po-combo`, `po-lookup`, `po-password`
   */
  clean?: boolean;

  /**
   * Define a propriedade nativa `autocomplete` do campo como off.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-input`, `po-number`, `po-decimal`, `po-lookup`, `po-password`
   */
  noAutocomplete?: boolean;

  /**
   * Posição de exibição do rótulo do PoSwitch.
   * > Por padrão exibe à direita.
   */
  labelPosition?: PoSwitchLabelPosition;

  /**
   * Permite esconder a função de espiar a senha digitada no `po-password`.
   */
  hidePasswordPeek?: boolean;

  /**
   * Padrão de formatação para saída do model, independentemente do formato de entrada.
   *
   * > Veja os valores válidos no `enumPoDatepickerIsoFormat`.
   *
   * **Componente compatível:** po-datepicker
   */
  isoFormat?: PoDatepickerIsoFormat;

  /**
   * Objeto com as literais usadas para os seguintes componentes: `po-lookup`, `po-multiselect`, `po-combo` e `po-datepicker-range`.
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do PoI18nService ou do browser.
   *
   * **Componentes compatíveis:** `po-lookup`, `po-multiselect`, `po-combo`, `po-datepicker-range`
   */
  literals?: PoLookupLiterals | PoMultiselectLiterals | PoComboLiterals | PoDatepickerRangeLiterals | PoUploadLiterals;

  /**
   * Se verdadeiro ativa a funcionalidade de scroll infinito para o combo ou lookup, ao chegar ao fim da tabela executará nova busca dos dados conforme paginação.
   *
   * **Componentes compatíveis:** `po-combo`, `po-lookup`.
   */
  infiniteScroll?: boolean;

  /**
   * Define o percentual necessário para disparar o evento show-more, que é responsável por carregar mais dados no combo. Caso o valor seja maior que 100 ou menor que 0, o valor padrão será 100%.
   * **Exemplos**
   * `{ infiniteScrollDistance: 80 }`: Quando atingir 80% do scroll do combo, o show-more será disparado.
   *
   * **Componente compatível:** `po-combo`.
   */
  infiniteScrollDistance?: number;

  /**
   * Define que a altura do componente será auto ajustável, possuindo uma altura minima porém a altura máxima será de acordo com o número de itens selecionados e a extensão dos mesmos, mantendo-os sempre visíveis.
   *
   * **Componentes compatíveis:** `po-multiselect`, `po-lookup`.
   */
  autoHeight?: boolean;

  /**
   * Intervalo utilizado no `po-number`.
   */
  step?: number;

  /**
   * Define o modo de pesquisa utilizado no filtro da lista de seleção: `startsWith`, `contains` ou `endsWith`.
   * > Quando utilizar a propriedade p-filter-service esta propriedade será ignorada.
   *
   * **Componentes compatíveis:** `po-multiselect`.
   */
  filterMode?: PoMultiselectFilterMode;

  /**
   * Valor mínimo de caracteres para realizar o filtro no serviço do `po-combo`.
   */
  filterMinlength?: number;

  /**
   * Desabilita o filtro inicial no serviço do `po-combo`, que é executado no primeiro clique no campo.
   */
  disabledInitFilter?: boolean;

  /**
   * Se verdadeiro, desabilitará a busca de um item via TAB no `po-combo`.
   */
  disabledTabFilter?: boolean;

  /**
   * Esta propriedade define em quanto tempo (em milissegundos), aguarda para acionar o evento de filtro após cada pressionamento de tecla. Será utilizada apenas quando houver serviço (`p-filter-service`).
   *
   * **Componentes compatíveis:** `po-combo`, `po-multiselect`.
   */
  debounceTime?: number;

  /**
   * Indica que o evento `p-change` só será disparado ao clicar ou pressionar a tecla "Enter" sobre uma opção selecionada no `po-combo`.
   */
  changeOnEnter?: boolean;

  /**
   * Indica que a lista definida na propriedade p-options será ordenada pela descrição.
   *
   * **Componentes compatíveis:** `po-combo`, po-multiselect
   */
  sort?: boolean;

  /**
   * Placeholder do campo de pesquisa do `po-multiselect`.
   *
   * > Caso o mesmo não seja informado, o valor padrão será traduzido com base no idioma do navegador (pt, es e en).
   */
  placeholderSearch?: string;

  /**
   * Esconde o campo de pesquisa existente dentro do dropdown do `po-multiselect`.
   */
  hideSearch?: boolean;

  /**
   * Indica se o campo "Selecionar todos" do `po-multiselect` será escondido.
   */
  hideSelectAll?: boolean;

  /**
   * Lista de objetos dos campos que serão criados na busca avançada.
   *
   * > Caso não seja passado um objeto ou então ele esteja em branco o link de busca avançada ficará escondido.
   *
   * Exemplo de URL com busca avançada:
   *
   * `url + ?page=1&pageSize=20&name=Tony%20Stark&nickname=Homem%20de%20Ferro`
   *
   * Caso algum parâmetro seja uma lista, a concatenação é feita utilizando vírgula. Exemplo:
   *
   * `url + ?page=1&pageSize=20&name=Tony%20Stark,Peter%20Parker,Gohan`
   */
  advancedFilters?: Array<PoLookupAdvancedFilter>;
  /**
   * pode ser utilizada em conjunto com a propriedade `options` forçando o componente a renderizar um `po-select` ou `po-radio-group`.
   *
   * Valores aceitos:
   * - ForceOptionComponentEnum.radioGroup
   * - ForceOptionComponentEnum.select
   *
   * >Essa propriedade será ignorada caso seja utilizada em conjunto com a propriedade `optionsMulti` e `optionsService`.
   */
  forceOptionsComponentType?: ForceOptionComponentEnum;

  /**
   * Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis.
   *
   * O componente envia como parâmetro um array de string com as colunas visíveis atualizadas.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   *
   * **Componentes compatíveis**: `po-lookup`
   */
  changeVisibleColumns?: Function;

  /**
   * Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.
   *
   * O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   *
   * **Componentes compatíveis**: `po-lookup`
   */
  columnRestoreManager?: Function;

  /**
   * URL que deve ser feita a requisição com os arquivos selecionados.
   *
   * **Componente compatível**: `po-upload`
   */
  url?: string;

  /**
   * Define se o envio do arquivo será automático ao selecionar o mesmo.
   *
   * **Componente compatível**: `po-upload`
   */
  autoUpload?: boolean;

  /**
   * Permite a seleção de diretórios contendo um ou mais arquivos para envio.
   *
   * > A habilitação desta propriedade se restringe apenas à seleção de diretórios.
   *
   * > Definição não suportada pelo browser **Internet Explorer**, todavia será possível a seleção de arquivos padrão.
   *
   * **Componente compatível**: `po-upload`
   */
  directory?: boolean;

  /**
   * Exibe a área onde é possível arrastar e selecionar os arquivos. Quando estiver definida, omite o botão para seleção de arquivos
   * automaticamente.
   *
   * > Recomendamos utilizar apenas um `po-upload` com esta funcionalidade por tela.
   *
   * **Componente compatível**: `po-upload`
   */
  dragDrop?: boolean;

  /**
   * Define em *pixels* a altura da área onde podem ser arrastados os arquivos. A altura mínima aceita é `160px`.
   *
   * > Esta propriedade funciona somente se a propriedade `p-drag-drop` estiver habilitada.
   *
   * **Componente compatível**: `po-upload`
   */
  dragDropHeight?: number;

  /**
   * Objeto que segue a definição da interface `PoUploadFileRestrictions`,
   * que possibilita definir tamanho máximo/mínimo e extensão dos arquivos permitidos.
   *
   * **Componente compatível**: `po-upload`
   */
  restrictions?: PoUploadFileRestrictions;

  /**
   * Objeto que contém os cabeçalhos que será enviado na requisição dos arquivos.
   *
   * **Componente compatível**: `po-upload`
   */
  headers?: { [name: string]: string | Array<string> };

  /**
   * Oculta visualmente as informações de restrições para o upload.
   *
   * **Componente compatível**: `po-upload`
   */
  hideRestrictionsInfo?: boolean;

  /**
   * Omite o botão de seleção de arquivos.
   *
   * > Caso o valor definido seja `true`, caberá ao desenvolvedor a responsabilidade
   * pela chamada do método `selectFiles()` para seleção de arquivos.
   *
   * **Componente compatível**: `po-upload`
   */
  hideSelectButton?: boolean;

  /**
   * Omite o botão de envio de arquivos.
   *
   * > Caso o valor definido seja `true`, caberá ao desenvolvedor a responsabilidade
   * pela chamada do método `sendFiles()` para envio do(s) arquivo(s) selecionado(s).
   *
   * **Componente compatível**: `po-upload`
   */
  hideSendButton?: boolean;

  /**
   * Define se a indicação de campo obrigatório será exibida.
   *
   * > Não será exibida a indicação se:
   * - Não possuir `p-help` e/ou `p-label`.
   */
  showRequired?: boolean;

  /**
   * Evento será disparado quando ocorrer algum erro no envio do arquivo.
   * > Por parâmetro será passado o objeto do retorno que é do tipo `HttpErrorResponse`.
   *
   * **Componente compatível**: `po-upload`
   */
  onError?: Function;

  /**
   * Evento será disparado quando o envio do arquivo for realizado com sucesso.
   * > Por parâmetro será passado o objeto do retorno que é do tipo `HttpResponse`.
   *
   * **Componente compatível**: `po-upload`
   */
  onSuccess?: Function;

  /**
   * Função que será executada no momento de realizar o envio do arquivo,
   * onde será possível adicionar informações ao parâmetro que será enviado na requisição.
   * É passado por parâmetro um objeto com o arquivo e a propriedade data nesta propriedade pode ser informado algum dado,
   * que será enviado em conjunto com o arquivo na requisição, por exemplo:
   *
   * ```
   *   event.data = {id: 'id do usuário'};
   * ```
   *
   * **Componente compatível**: `po-upload`
   */
  onUpload?: Function;
}

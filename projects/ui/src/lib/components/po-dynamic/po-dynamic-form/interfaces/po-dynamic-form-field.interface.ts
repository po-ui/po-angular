import { TemplateRef } from '@angular/core';
import {
  ErrorAsyncProperties,
  PoCheckboxGroupOption,
  PoComboFilter,
  PoComboLiterals,
  PoDatepickerIsoFormat,
  PoDatepickerRangeLiterals,
  PoTimepickerModelFormat,
  PoLookupFilter,
  PoLookupLiterals,
  PoMultiselectFilter,
  PoMultiselectFilterMode,
  PoMultiselectLiterals,
  PoSwitchLabelPosition,
  PoUploadFile,
  PoUploadFileRestrictions,
  PoUploadLiterals
} from '../../../po-field';
import { PoLookupAdvancedFilter } from '../../../po-field/po-lookup/interfaces/po-lookup-advanced-filter.interface';
import { PoLookupColumn } from '../../../po-field/po-lookup/interfaces/po-lookup-column.interface';
import { PoMultiselectOption } from '../../../po-field/po-multiselect/interfaces/po-multiselect-option.interface';
import { PoSelectOption } from '../../../po-field/po-select/po-select-option.interface';
import { PoProgressAction } from '../../../po-progress';
import { ForceBooleanComponentEnum, ForceOptionComponentEnum } from '../../enums/po-dynamic-field-force-component.enum';

import { Observable } from 'rxjs';
import { PoDynamicField } from '../../po-dynamic-field.interface';
import { PoHelperOptions } from '../../../po-helper';
import { PoCalendarRangePreset } from '../../../po-calendar/interfaces/po-calendar-range-preset.interface';

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
   * Evento disparado ao clicar no ícone de ajuda adicional.
   *
   * > Essa propriedade está depreciada e será removida na versão 23.x.x. Recomendamos utilizar a propriedade p-helper que oferece mais recursos e flexibilidade.
   */
  additionalHelp?: Function;

  /**
   * Exibe um ícone de ajuda adicional, com o texto desta propriedade sendo passado para o popover do componente `po-helper`.
   * **Como boa prática, indica-se utilizar um texto com até 140 caracteres.**
   *
   * > Essa propriedade está depreciada e será removida na versão 23.x.x. Recomendamos utilizar a propriedade p-helper que oferece mais recursos e flexibilidade.
   */
  additionalHelpTooltip?: string;

  /**
   * Define que o `listbox` e/ou popover (`p-helper` e/ou `p-error-limit`) serão incluídos no body da
   * página e não dentro do componente. Essa opção é necessária para cenários com containers que possuem scroll ou
   * overflow escondido, garantindo o posicionamento correto de ambos próximo ao elemento.
   *
   * > Quando utilizado com `p-helper`, leitores de tela como o NVDA podem não ler o conteúdo do popover.
   */
  appendBox?: boolean;

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

  /**
   * Função executada quando uma tecla é pressionada enquanto o foco está no componente.
   * Retorna um objeto `KeyboardEvent` com informações sobre a tecla.
   */
  keydown?: Function;

  /** Define a obrigatoriedade do campo. */
  required?: boolean;

  /**
   *
   * Exibe a mensagem setada na propriedade `errorMessage` se o campo estiver vazio e for requerido.
   *
   * > Necessário que a propriedade `required` esteja habilitada.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-input`, `po-number`, `po-decimal`, `po-password`.
   */
  requiredFieldErrorMessage?: boolean;

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
  optionsService?: string | PoComboFilter | PoMultiselectFilter;

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
   * **Componente compatível:** `po-input`.
   * > também é atribuído ao utilizar a propriedade `type: time`.
   */
  mask?: string;

  /**
   * Define que o valor do componente será conforme especificado na mascára. O valor padrão é `false`.
   *
   * **Componente compatível:** `po-input`.
   * > também é atribuído ao utilizar a propriedade `type: time`.
   * */
  maskFormatModel?: boolean;

  /**
   * Controla como o componente aplica as validações de comprimento mínimo (`minLength`) e máximo (`maxLength`) quando há uma máscara (`p-mask`) definida.
   *
   * - Quando `true`, apenas os caracteres alfanuméricos serão contabilizados para a validação dos comprimentos.
   * - Quando `false`, todos os caracteres, incluindo os especiais da máscara, serão considerados na validação.
   *
   * **Componentes compatíveis:** `po-input`, `po-decimal`.
   *
   * > Esta propriedade é ignorada quando utilizada em conjunto com `p-mask-format-model`.
   *
   * Exemplo:
   * ```
   * fields:Array<PoDynamicFormField> = [
   * {
   *   property: 'CNPJ maskNoLengthValidation TRUE',
   *   required: true,
   *   showRequired: true,
   *   mask: '99.999.999/9999-99',
   *   pattern: '([0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9])',
   *   maskNoLengthValidation: true,
   *   maxLength: 14,
   *   minLength: 0
   * }
   * ```
   * - Entrada: `11.111.111/1111-11` → Validação será aplicada somente aos números, ignorando os caracteres especiais.
   */
  maskNoLengthValidation?: boolean;

  /** Define o ícone que será exibido no início do campo.
   * > Esta propriedade só pode ser utilizado nos campos:
   * - Input;
   * - Number;
   * - Decimal;
   * - Combo;
   * - Password;
   *
   * > Veja a disponibilidade de ícones em [biblioteca de ícones](https://po-ui.io/icons).
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

  /** Texto simples que será apresentado como auxílio ao campo ou objeto com as definições do po-helper. */
  helper?: string | PoHelperOptions;

  /** Texto exibido quando o valor do componente for *true*. */
  booleanTrue?: string;

  /** Texto exibido quando o valor do componente for *false*. */
  booleanFalse?: string;

  /** Indica se o status do `model` será escondido visualmente ao lado do switch */
  hideLabelStatus?: boolean;

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
   * Define a direção preferida para exibição do `listbox` em relação ao campo (`top` ou `bottom`).
   * Útil em casos onde o posicionamento automático não se comporta como esperado, como quando o componente está próximo
   * ao final do formulário ou do container visível. Na maioria dos casos, essa direção será respeitada; no entanto,
   * pode ser ajustada automaticamente conforme o espaço disponível na tela.
   *
   * **Componentes compatíveis:** `po-multiselect`, `po-combo`.
   *
   * @default `bottom`
   */
  listboxControlPosition?: 'top' | 'bottom';

  /**
   * Habilita um estado de carregamento no componente, desabilitando-o e exibindo um ícone de carregamento.
   *
   * > Por padrão é `false`.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-number`, `po-decimal`,
   * `po-input`, `po-select`, `po-switch`, `po-combo`, `po-lookup`, `po-multiselect`,
   * `po-textarea`, `po-password`, `po-upload`.
   */
  loading?: boolean;

  /**
   * Valor máximo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date*, *dateTime* ou *time*.
   *
   * > Para `po-timepicker`, o valor deve estar no formato `HH:mm` ou `HH:mm:ss`.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-number`, `po-decimal`, `po-timepicker`
   * */
  maxValue?: string | number;

  /**
   * Valor mínimo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date*, *dateTime* ou *time*.
   *
   * > Para `po-timepicker`, o valor deve estar no formato `HH:mm` ou `HH:mm:ss`.
   *
   * **Componentes compatíveis:** `po-datepicker`, `po-datepicker-range`, `po-number`, `po-decimal`, `po-timepicker`
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
   * ```
   * onChangeField(changeValue): PoDynamicFormFieldValidation {
   *
   * if (changeValue.property === 'birthday' && !this.validate('birthday')) {
   *   return {
   *     value: '',
   *     field: { property: 'birthday', required: true },
   *     focus: true
   *   };
   * }
   * ```
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
   *  - required;
   *
   * > Esta mensagem pode ser exibida quando o campo estiver vazio, caso seja requerido. Em casos de componentes como
   * `po-datepicker`, `po-input`, `po-number`, `po-decimal`, `po-password`, é necessário que a propriedade
   * `requiredFieldErrorMessage` esteja como `true` para que a mensagem seja exibida com o campo vazio. Componentes
   * como `po-datepicker-range`, `po-select`, `po-checkbox-group`, `po-radio-group`, `po-multiselect`, `po-combo`,
   * `po-lookup` e `po-textarea` não é necessário passar a propriedade `requiredFieldErrorMessage`.
   *
   *
   * **Componentes compatíveis:**  `po-checkbox-group`, `po-combo`, `po-datepicker`, `po-datepicker-range`,
   *  `po-decimal`, `po-input`, `po-lookup`, `po-multiselect`, `po-number`, `po-password`, `po-radio-group`, `po-select`, `po-switch`, `po-textarea`.
   */
  errorMessage?: string;

  /**
   * @optional
   *
   * @description
   *
   * Limita a exibição da mensagem de erro a duas linhas e exibe um tooltip com o texto completo.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será limitada a duas linhas
   * e um tooltip será exibido ao passar o mouse sobre a mensagem para mostrar o conteúdo completo.
   *
   * **Componentes compatíveis:** `po-checkbox-group`, `po-combo`, `po-datepicker`, `po-datepicker-range`,
   *  `po-decimal`, `po-input`, `po-lookup`, `po-multiselect`, `po-number`, `po-password`, `po-radio-group`, `po-select`, `po-switch`, `po-textarea`.
   *
   * @default `false`
   */
  errorLimit?: boolean;

  /**
   * Função executada para realizar a validação assíncrona personalizada.
   * Executada ao disparar o output `change` ou `change-model`, dependendo do valor da propriedade `triggerMode`.
   *
   *
   * > Retorna `Observable com o valor true` para sinalizar o erro `false` para indicar que não há erro.
   *
   * **Componente compatível**: `po-datepicker`
   */
  errorAsyncFunction?: (value) => Observable<boolean>;

  /**
   * Realiza alguma validação customizada assíncrona no componente.
   *
   * **Componentes compatíveis:** `po-input`, `po-number`, `po-decimal`, `po-password`.
   */
  errorAsyncProperties?: ErrorAsyncProperties;

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
   * Ao utilizar com o `type` *PoDynamicFieldType.Time*, define o formato de exibição do horário:
   *
   * Valores válidos:
   * - `24`: formato de 24 horas (padrão)
   * - `12`: formato de 12 horas com indicador AM/PM
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
   * Por padrão o valor será configurado segundo o módulo [`I18n`](documentation/po-i18n)
   *
   * Exemplo de utilização:
   * ```
   * [
   *   { property: 'birthday', locale: 'en', type: 'date' },
   *   { property: 'wage', locale: 'ru', type: 'currency' }
   * ];
   * ```
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
   * **Componentes compatíveis:** `po-lookup`, `po-upload`
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
   * Define o formato do valor do horário a ser utilizado no model do `po-timepicker`.
   *
   * > Veja os valores válidos no `PoTimepickerModelFormat`.
   *
   * **Componente compatível:** `po-timepicker`
   */
  modelFormat?: PoTimepickerModelFormat;

  /**
   * Padrão de formatação para saída do model, independentemente do formato de entrada.
   *
   * > Veja os valores válidos no `PoDatepickerIsoFormat`.
   *
   * **Componente compatível:** `po-datepicker`
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
   * Exibe a coluna de segundos no painel do timepicker.
   *
   * @default `false`
   *
   * **Componente compatível:** `po-timepicker`
   */
  showSeconds?: boolean;

  /**
   * Define o intervalo entre os minutos exibidos no painel do timepicker.
   *
   * @default `5`
   *
   * **Componente compatível:** `po-timepicker`
   */
  minuteInterval?: number;

  /**
   * Define o intervalo entre os segundos exibidos no painel do timepicker.
   *
   * @default `1`
   *
   * **Componente compatível:** `po-timepicker`
   */
  secondInterval?: number;

  /**
   * Define o modo de pesquisa utilizado no filtro da lista de seleção: `startsWith`, `contains` ou `endsWith`.
   * > Quando utilizar a propriedade p-filter-service esta propriedade será ignorada.
   *
   * **Componente compatível:** `po-multiselect`.
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
   * Valores aceitos:
   * - ForceBooleanComponentEnum.switch
   * - ForceBooleanComponentEnum.checkbox
   *
   */
  forceBooleanComponentType?: ForceBooleanComponentEnum;

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
   * **Componente compatível**: `po-lookup`
   */
  changeVisibleColumns?: Function;

  /**
   * Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.
   *
   * O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   *
   * **Componente compatível**: `po-lookup`
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
   * Nome do campo de formulário que será enviado para o serviço informado na propriedade `url`.
   *
   * > O valor default é `files`
   *
   * **Componente compatível**: `po-upload`
   */
  formField?: string;

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
   * Exibe a pré-visualização de imagens ao anexá-las.
   *
   * > Propriedade funciona apenas em arquivos de formato de imagem (`.png`, `.jpg`, `.jpeg` e `.gif`).
   *
   * **Componente compatível**: `po-upload`
   */
  showThumbnail?: boolean;

  /**
   * Define uma ação personalizada no componente `po-upload`, adicionando um botão no canto inferior direito
   * de cada barra de progresso associada aos arquivos enviados ou em envio.
   *
   * **Componente compatível**: `po-upload`,
   *
   * **Exemplo de configuração**:
   * ```typescript
   * customAction: {
   *   label: 'Baixar',
   *   icon: 'an-download',
   *   type: 'default',
   *   visible: true,
   *   disabled: false
   * };
   * ```
   */
  customAction?: PoProgressAction;

  /**
   * Evento emitido ao clicar na ação personalizada configurada no `p-custom-action`.
   *
   * **Componente compatível**: `po-upload`,
   *
   * Este evento é emitido quando o botão de ação personalizada é clicado na barra de progresso associada a um arquivo.
   * O arquivo relacionado à barra de progresso será passado como parâmetro do evento, permitindo executar operações específicas para aquele arquivo.
   *
   * **Parâmetro do evento**:
   * - `file`: O arquivo associado ao botão de ação. Este objeto é da classe `PoUploadFile` e contém informações sobre o arquivo, como nome, status e progresso.
   *
   * **Exemplo de uso**:
   * ```typescript
   * customActionClick: (file: PoUploadFile) => {
   *   console.log('Ação personalizada clicada para o arquivo:', file.name);
   *   // Lógica de download ou outra ação relacionada ao arquivo
   * }
   * ```
   */
  customActionClick?: (file: PoUploadFile) => void;

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

  /**
   *
   * Define que o filtro no primeiro clique será removido.
   *
   * > Caso o combo tenha um valor padrão de inicialização, o primeiro clique
   * no componente retornará todos os itens da lista e não apenas o item inicialiazado.
   *
   * **Componente compatível**: `po-combo`
   */
  removeInitialFilter?: boolean;

  /**
   * Define o tamanho dos componentes de formulário no template conforme suas respectivas documentações:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   * - `large`: aplica a medida large de cada componente (disponível para `po-checkbox` e `po-radio-group`).
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  size?: string;

  /**
   * Define qual valor será considerado como inválido para exibir a mensagem da propriedade `p-field-error-message`.
   *
   * > Caso essa propriedade seja definida como `true`, a mensagem de erro será exibida quando o campo estiver ligado(on/true).
   *
   * **Componente compatível**: `po-switch`
   *
   * @default `false`
   */
  invalidValue?: boolean;

  /**
   * Define se o título do campo será exibido de forma compacta.
   *
   * Quando habilitado (`true`), o modo compacto afeta o conjunto composto por:
   * - `po-label`
   * - `p-requirement (showRequired)`
   * - `po-helper`
   *
   * Ou seja, todos os elementos relacionados ao título do campo
   * (rótulo, indicador de obrigatoriedade e componente auxiliar) passam
   * a seguir o comportamento de layout compacto.
   *
   * Também é possível definir esse comportamento de forma global,
   * uma única vez, na folha de estilo geral da aplicação, por meio
   * da customização dos tokens CSS:
   *
   * - `--field-container-title-justify`
   * - `--field-container-title-flex`
   *
   * Exemplo:
   * ```
   * :root {
   *   --field-container-title-justify: flex-start;
   *   --field-container-title-flex: 0 1 auto;
   * }
   * ```
   *
   * Dessa forma, o layout compacto passa a ser o padrão da aplicação,
   * sem a necessidade de definir a propriedade individualmente em cada campo.
   *
   * @default `false`
   *
   * **Compatível com todos os componentes**
   */
  compactLabel?: boolean;

  /**
   * Define o modo de seleção do `po-datepicker`.
   *
   * Valores aceitos:
   * - `'month-year'`: exibe seleção de mês e ano (formato `MM/YYYY`)
   * - `'year'`: exibe seleção apenas de ano (formato `YYYY`)
   *
   * **Componente compatível:** `po-datepicker`
   */
  mode?: 'month-year' | 'year';

  /**
   * Define o limite de anos exibidos na lista de anos do `po-datepicker` nos modos `month-year` e `year`.
   *
   * @default `150`
   *
   * **Componente compatível:** `po-datepicker`
   */
  yearRangeLimit?: number;

  /**
   * Habilita a exibição dos presets padrão de intervalos de data no painel lateral do calendário.
   *
   * Aceita os seguintes valores:
   * - `true`: exibe todos os presets padrão.
   * - `false`: não exibe os presets padrão.
   * - `Array<string>`: exibe apenas os presets padrão cujos labels estejam no array informado.
   *
   * **Componente compatível:** `po-datepicker-range`
   *
   * @default `false`
   */
  rangePresets?: boolean | Array<string>;

  /**
   * Lista de presets customizados de intervalos de data exibidos no painel lateral do calendário.
   *
   * Para utilizar presets customizados, informe um array de objetos que implementam a interface `PoCalendarRangePreset`.
   *
   * **Componente compatível:** `po-datepicker-range`
   */
  rangePresetOptions?: Array<PoCalendarRangePreset>;

  /**
   * Define a ordenação dos presets na lista.
   *
   * Valores aceitos:
   * - `'asc'`: ordenação crescente (passado → futuro)
   * - `'desc'`: ordenação decrescente (futuro → passado)
   *
   * **Componente compatível:** `po-datepicker-range`
   *
   * @default `'asc'`
   */
  rangePresetsOrder?: 'asc' | 'desc';
}

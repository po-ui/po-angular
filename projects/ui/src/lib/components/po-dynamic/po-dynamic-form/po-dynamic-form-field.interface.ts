import { PoLookupColumn } from '../../po-field/po-lookup/interfaces/po-lookup-column.interface';
import { PoMultiselectOption } from '../../po-field/po-multiselect/po-multiselect-option.interface';
import { PoSelectOption } from '../../po-field/po-select/po-select-option.interface';

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
   */
  columns?: Array<PoLookupColumn>;

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

  /** Lista de opções que serão exibidos em um componente, podendo selecionar uma opção. */
  options?: Array<string> | Array<PoSelectOption> | Array<PoMultiselectOption>;

  /**
   * Permite que o usuário faça múltipla seleção dentro da lista de opções.
   *
   * > Caso utilizar a propriedade `optionsService` esta propriedade será ignorada.
   */
  optionsMulti?: boolean;

  /** Serviço que será utilizado para buscar os itens e preencher a lista de opções dinamicamente. */
  optionsService?: string;

  /**
   * Serviço que será utilizado para realizar a busca avançada. Pode ser utilizado em conjunto com a propriedade `columns`.
   *
   * **Importante:**
   * > Caso utilizar a propriedade `optionsService` esta propriedade será ignorada.
   * > Para que funcione corretamente, é importante que o serviço siga o
   * [guia de API da PORTINARI](http://tdn.totvs.com/pages/releaseview.action?pageId=271660444).
   */
  searchService?: string;

  /** Máscara para o campo. */
  mask?: string;

  /** Regex para validação do campo. */
  pattern?: string;

  /** Tamanho mínimo de caracteres. */
  minLength?: number;

  /** Tamanho máximo de caracteres. */
  maxLength?: number;

  /** Desabilita o campo caso informar o valor *true*. */
  disabled?: boolean;

  /** Texto de ajuda. */
  help?: string;

  /** Texto exibido quando o valor do componente for *true*. */
  booleanTrue?: string;

  /** Texto exibido quando o valor do componente for *false*. */
  booleanFalse?: string;

  /** Valor máximo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date* ou *dateTime*. */
  maxValue?: string | number;

  /** Valor mínimo a ser informado no componente, podendo ser utilizado quando o tipo de dado por *number*, *date* ou *dateTime*. */
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
   * ```
   * { property: 'property name', value: 'new value' }
   * ```
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
   * ```
   * { property: 'state', gridColumns: 6, validate: this.myFunction.bind(this) }
   * ```
   */
  validate?: string | Function;

  /**
   * Objeto que será enviado como parâmetro nas requisições de busca usados pelos componentes `po-lookup` e
   * `po-combo`.
   *
   * Por exemplo, para o parâmetro `{ age: 23 }` a URL da requisição ficaria:
   *
   * ```
   * url + ?age=23&filter=Peter
   * ```
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
   */
  errorMessage?: string;
}

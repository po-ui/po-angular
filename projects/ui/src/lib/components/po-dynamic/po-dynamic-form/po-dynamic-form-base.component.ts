import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { PoThemeService } from '../../../services';
import { convertToBoolean, getDefaultSize, validateSize } from '../../../utils/util';
import { PoDynamicFormField } from './interfaces/po-dynamic-form-field.interface';

/**
 *
 * @description
 *
 * Componente para criação de formulários dinâmicos a partir de uma lista de objetos.
 *
 * Também é possível verificar se o formulário está válido e informar valores para a exibição de informações.
 */
@Directive()
export class PoDynamicFormBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Nome da propriedade, atribuída ao `PoDynamicFormField.property`, que iniciará o campo com foco.
   */
  @Input('p-auto-focus') autoFocus?: string;

  /**
   * @description
   *
   * Coleção de objetos que implementam a interface `PoDynamicFormField`, para definição dos campos que serão criados
   * dinamicamente.
   *
   * > Ex: `[ { property: 'name' } ]`
   *
   * Regras de tipagem e criação dos componentes:
   *
   * - Caso o *type* informado seja *boolean* o componente criado será o `po-switch`.
   * - Caso o *type* informado seja *currency* e não seja informado um *mask* ou *pattern* o componente criado será o `po-decimal`,
   * caso seja informado um *mask* ou *pattern* o componente criado será o `po-input`.
   * - Caso o *type* informado seja *number* e não seja informado um *mask* ou *pattern* o componente criado será o `po-number`, caso seja
   * informado um *mask* ou *pattern* o componente criado será o `po-input`.
   * - Caso a lista possua a propriedade `options` e a mesma possua até 3 itens o componente criado será o `po-radio-group`
   * ou `po-checkbox-group` se informar a propriedade `optionsMulti`.
   * - Caso a mesma possua 3 ou mais itens, será criado o componente `po-select` ou, `po-multiselect` se a propriedade `optionsMulti`
   * for verdadeira.
   * - Caso o *type* informado seja *date* ou *datetime* o componente criado será o `po-datepicker`.
   * - Caso seja informado a propriedade `optionsService` o componente criado será o `po-combo`.
   * - Caso o *type* informado seja *time* o componente criado será um `po-input` podendo receber um *mask* para formatar
   * o valor exibido, caso não seja informado um *mask* o componente será criado com a máscara '99:99' por padrão.
   * - Caso a lista possua a propriedade `rows` e esta seja definida com valor maior ou igual a 3 o componente criado será
   * o `po-textarea`, caso o valor da propriedade `rows` seja menor que 3 o componente criado será o `po-input`.
   * - Caso seja informada a propriedade `secret` o componente criado será o `po-password`.
   * - Caso o *type* informado seja *string* o componente criado será o `po-input`.
   * > Ao alterar o valor das `properties`, visibilidade e/ou agrupamentos via container, os `fields` que utilizam serviço podem refazer as chamadas para as API's.
   * @default `[]`
   */
  @Input('p-fields') fields: Array<PoDynamicFormField>;

  /**
   * Objeto que será utilizado como valor para exibir as informações, será recuperado e preenchido através do atributo *property*
   * dos objetos contidos na propridade `p-fields`.
   *
   * Pode iniciar com valor ou apenas com um objeto vazio que será preenchido conforme descrito acima.
   *
   * > Ex: `{ name: 'po' }`
   */
  @Input('p-value') value: any;

  /**
   * @optional
   *
   * @description
   *
   * Na inicialização do componente será repassado o objeto de formulário utilizado no componente,
   * podendo ser utilizado para validações e/ou detecção de mudança dos valores.
   *
   * Portanto existem duas maneiras de recuperar o formulário,
   * através de *template reference* e através do *output*, veja os exemplos abaixo:
   *
   * > *template reference*
   *
   * ```html
   *  <po-dynamic-form #dynamicForm>
   *  </po-dynamic-form>
   *
   *  <po-button p-label="Adicionar" [p-disabled]="dynamicForm?.form.invalid">
   *  </po-button>
   *
   * ```
   *
   * > *Output*
   *
   * ```html
   *  ...
   *  <po-dynamic-form (p-form)="getForm($event)">
   *  </po-dynamic-form>
   *
   *  <po-button p-label="Adicionar" [p-disabled]="dynamicForm?.invalid">
   *  </po-button>
   *  ...
   *
   * ```
   *
   * ```ts
   *  ...
   *
   *  export class AppComponent {
   *
   *    dynamicForm: NgForm;
   *
   *    getForm(form: NgForm) {
   *      this.dynamicForm = form;
   *    }
   *
   *  }
   * ```
   *
   * > Caso a propriedade `p-group-form` for verdadeira não será repassado o formulário, pois o mesmo utilizará
   * o formulário pai.
   */
  @Output('p-form') formOutput: EventEmitter<NgForm> = new EventEmitter<NgForm>();

  /**
   * Função ou serviço que será executado na inicialização do componente.
   *
   * A propriedade aceita os seguintes tipos:
   * - `string`: *Endpoint* usado pelo componente para requisição via `POST`.
   * - `function`: Método que será executado.
   *
   * Ao ser executado, irá receber como parâmetro o objeto informado no `p-value`.
   *
   * O retorno desta função deve ser do tipo [PoDynamicFormLoad](documentation/po-dynamic-form#po-dynamic-form-load),
   * onde o usuário poderá determinar as novas atualizações dos campos, valores e determinar o campo a ser focado.
   *
   * Por exemplo:
   *
   * ```
   * onLoadFields(): PoDynamicFormLoad {
   *
   *   return {
   *     value: { cpf: undefined },
   *     fields: [
   *       { property: 'cpf' }
   *     ],
   *     focus: 'cpf'
   *   };
   * }
   *
   * ```
   * Para referenciar a sua função utilize a propriedade `bind`, por exemplo:
   * ```
   *  [p-load]="onLoadFields.bind(this)"
   * ```
   */
  @Input('p-load') load?: string | Function;

  /**
   * Função ou serviço para validar as **mudanças do formulário**.
   *
   * A propriedade aceita os seguintes tipos:
   * - `string`: *Endpoint* usado pelo componente para requisição via `POST`.
   * - `function`: Método que será executado.
   *
   * Ao ser executado, irá receber como parâmetro um objeto com o nome da propriedade
   * alterada e os valores atualizados do formulario, conforme a interface `PoDynamicFormFieldChanged`
   *
   *
   * O retorno desta função deve ser do tipo [PoDynamicFormValidation](documentation/po-dynamic-form#po-dynamic-form-validation),
   * onde o usuário poderá determinar as novas atualizações dos campos.
   * Por exemplo:
   *
   * ```
   * onChangeFields(changeValue): PoDynamicFormValidation {
   *
   * if (changeValue.property === 'state') {
   *
   *   return {
   *     value: { city: undefined },
   *     fields: [
   *       { property: 'city', options: this.getCity(changeValue.value.state) }
   *     ],
   *     focus: 'city'
   *   };
   * }
   *
   * ```
   * Para referenciar a sua função utilize a propriedade `bind`, por exemplo:
   * ```
   *  [p-validate]="this.myFunction.bind(this)"
   * ```
   *
   * > Se houver uma lista de campos para validação definida em `p-validate-fields`, a propriedade `validate` só receberá o disparo para os campos equivalentes.
   */
  @Input('p-validate') validate?: string | Function;

  /**
   * @optional
   *
   * @description
   *
   * Lista que define os campos que irão disparar o validate do form.
   */
  @Input('p-validate-fields') validateFields?: Array<string>;

  private _componentsSize?: string = undefined;
  private _groupForm?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos componentes de formulário no template:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-components-size') set componentsSize(value: string) {
    this._componentsSize = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   * Ao informar esta propriedade, o componente passará a utilizar o formulário pai para criar os `FormControl`
   * e com isso é possível recuperar o valor do formulário e suas validações a partir do formulário pai.
   *
   * ```html
   * <form #parentForm="ngForm">
   *
   *   <po-dynamic-form p-group-form [p-fields]="fields"></po-dynamic-form>
   *
   *  <po-button p-label="Adicionar" [p-disabled]="parentForm.invalid"></po-button>
   * </form>
   * ```
   */
  @Input('p-group-form') set groupForm(value: boolean) {
    this._groupForm = <any>value === '' ? true : convertToBoolean(value);
  }

  get groupForm(): boolean {
    return this._groupForm;
  }

  /**
   * @optional
   *
   * @description
   *
   * Ao informar esta propriedade, o componente passará a emitir o valor a cada caractere digitado.
   *
   * Pode ser aplicado nos seguintes componentes:
   * - po-input
   * - po-number
   * - po-decimal
   * - po-textarea
   * - po-password
   *
   * Deve informar os campos que deseja receber as emissões na propriedade `p-validate-fields`.
   *
   *
   */
  @Input({ alias: 'p-validate-on-input', transform: convertToBoolean }) validateOnInput: boolean = false;

  constructor(protected poThemeService: PoThemeService) {}
}

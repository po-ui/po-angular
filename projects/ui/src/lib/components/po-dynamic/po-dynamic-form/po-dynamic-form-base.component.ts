import { EventEmitter, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { convertToBoolean } from '../../../utils/util';

import { PoDynamicFormField } from './po-dynamic-form-field.interface';

/**
 *
 * @description
 *
 * Componente para criação de formulários dinâmicos a partir de uma lista de objetos.
 *
 * Também é possível verificar se o formulário está válido e informar valores para a exibição de informações.
 *
 * > Temos uma ferramenta para criação de formulários, onde é possível inicializá-lo através de um JSON.
 * [**Veja aqui**](tools/dynamic-form).
 */
export class PoDynamicFormBaseComponent {

  private _groupForm?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Nome da propriedade, atribuída ao `PoDynamicFormField.property`, que iniciará o campo com foco.
   *
   * > Não é possivel iniciar os componentes abaixo com foco:
   *  - `po-checkbox-group`
   *  - `po-combo`
   *  - `po-radio-group`
   *  - `po-select`
   *  - `po-switch`
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
   * - Caso o *type* informado seja *number* e não seja informado um *mask* ou *pattern* o componente criado será o `po-decimal`, caso seja
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
   *
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
    this._groupForm = <any> value === '' ? true : convertToBoolean(value);
  }

  get groupForm(): boolean {
    return this._groupForm;
  }

}

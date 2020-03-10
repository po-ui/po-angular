import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

const PO_BUTTON_TYPES = ['default', 'primary', 'danger', 'link'];
const PO_BUTTON_TYPE_DEFAULT = 'default';

/**
 * @description
 *
 * O `po-button` permite que o usuário execute ações predefinidas pelo desenvolvedor.
 *
 * Através dos tipos, é possível identificar a importância de cada ação, sendo ela primária (`primary`) ou até mesmo uma
 * ação irreversível (`danger`), como a exclusão de um registro.
 *
 * #### Boas práticas
 *
 * - Evite `labels` extensos que quebram o layout do `po-button`, use `labels` diretos, curtos e intuitivos.
 * - Utilize apenas um `po-button` configurado como `primary` por página.
 * - Para ações irreversíveis use sempre o tipo `danger`.
 */
@Directive()
export class PoButtonBaseComponent {
  private _disabled?: boolean = false;
  private _loading?: boolean = false;
  private _small?: boolean = false;
  private _type?: string = 'default';

  /**
   * @optional
   *
   * @description
   *
   * Label do botão.
   */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Exibe um ícone de carregamento à esquerda do _label_ do botão.
   *
   * > Quando esta propriedade estiver habilitada, desabilitará o botão.
   *
   * @default `false`
   */
  @Input('p-loading') set loading(value: boolean) {
    this._loading = convertToBoolean(value);
  }

  get loading(): boolean {
    return this._loading;
  }

  /**
   * Ícone exibido ao lado esquerdo do label do botão.
   *
   * É possível usar qualquer uma dos ícones da [Biblioteca de ícones](/guides/icons).
   */
  @Input('p-icon') icon?: string;

  /**
   * @optional
   *
   * @description
   *
   * Deixa o botão menor.
   *
   * @default `false`
   */
  @Input('p-small') set small(value: boolean) {
    this._small = <any>value === '' ? true : convertToBoolean(value);
  }
  get small(): boolean {
    return this._small;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o estilo do `po-button`.
   *
   * Valore válidos:
   *  - `default`: estilo padrão do `po-button`.
   *  - `primary`: deixa o `po-button` com destaque, deve ser usado para ações primárias.
   *  - `danger`: deve ser usado para ações que o usuário precisa ter cuidado ao executa-lá.
   *  - `link`: o `po-button` recebe o estilo de um link.
   *
   * @default `default`
   */
  @Input('p-type') set type(value: string) {
    this._type = PO_BUTTON_TYPES.includes(value) ? value : PO_BUTTON_TYPE_DEFAULT;
  }
  get type(): string {
    return this._type;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o `po-button` e não permite que o usuário interaja com o mesmo.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = <any>value === '' ? true : convertToBoolean(value);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  /** Ação que será executada quando o usuário clicar sobre o `po-button`. */
  @Output('p-click') click = new EventEmitter<null>();
}

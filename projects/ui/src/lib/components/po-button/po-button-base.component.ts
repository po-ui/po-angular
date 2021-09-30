import { EventEmitter, Input, Output, Directive, TemplateRef } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { InputBoolean } from '../../decorators';

import { PoButtonType } from './po-button-type.enum';

const PO_BUTTON_TYPES = ['primary', 'secondary', 'tertiary'];
const PO_BUTTON_TYPE_DEFAULT = 'secondary';

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
  /**
   * @optional
   *
   * @description
   *
   * Aplica foco no elemento ao ser iniciado.
   * > Caso mais de um elemento seja configurado com essa propriedade,
   * o último elemento declarado com ela terá o foco.
   *
   * @default `false`
   */
  @Input('p-auto-focus') @InputBoolean() autoFocus: boolean = false;

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
   * Ícone exibido ao lado esquerdo do label do botão.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-button p-icon="po-icon-user" p-label="PO button"></po-button>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, da seguinte forma:
   * ```
   * <po-button p-icon="fa fa-podcast" p-label="PO button"></po-button>
   * ```
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-button [p-icon]="template" p-label="button template ionic"></po-button>
   *
   * <ng-template #template>
   *  <ion-icon style="font-size: inherit" name="heart"></ion-icon>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  @Input('p-icon') icon?: string | TemplateRef<void>;

  /** Ação que será executada quando o usuário clicar sobre o `po-button`. */
  @Output('p-click') click = new EventEmitter<null>();

  private _danger?: boolean = false;
  private _disabled?: boolean = false;
  private _loading?: boolean = false;
  private _small?: boolean = false;
  private _type?: string = 'secondary';

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
   *  - `default`: **Deprecated 16.x.x** Usar `secondary`.
   *  - `danger`: **Deprecated 16.x.x** Usar `secondary` em conjunto com a propriedade `p-danger`.
   *  - `link`: **Deprecated 16.x.x** o `po-button` recebe o estilo de um link.
   *  - `primary`: deixa o `po-button` com destaque, deve ser usado para ações primárias.
   *  - `secondary`: estilo padrão do `po-button`.
   *  - `tertiary`: o `po-button` é exibido sem cor de fundo, recebendo menos destaque entre as ações.
   *
   * @default `secondary`
   */
  @Input('p-type') set type(value: string) {
    this._type = PO_BUTTON_TYPES.includes(value) ? value : PoButtonType[value] ? PoButtonType[value] : PO_BUTTON_TYPE_DEFAULT;

    this.danger = value === 'danger' ? true : this.danger;
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

  /**
   * @optional
   *
   * @description
   *
   * Deve ser usado para ações que o usuário precisa ter cuidado ao executa-lá.
   *
   * > Exibirá o `po-button` no estilo padrão (type = secondary).
   *
   * @default `false`
   */
  @Input('p-danger') @InputBoolean() set danger(value: boolean) {
    this._danger = value;
    if (this.type && value && this.type !== PO_BUTTON_TYPE_DEFAULT) {
      this.type = PO_BUTTON_TYPE_DEFAULT;
    }
  }

  get danger(): boolean {
    return this._danger;
  }
}

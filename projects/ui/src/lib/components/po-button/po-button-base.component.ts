import { EventEmitter, Input, Output, Directive, TemplateRef } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { InputBoolean } from '../../decorators';

import { PoButtonKind } from './po-button-type.enum';

/**
 * @description
 *
 * O `po-button` permite que o usuário execute ações predefinidas pelo desenvolvedor.
 *
 * Através dos tipos, é possível identificar a importância de cada ação.
 *
 * #### Boas práticas
 *
 * - Evite `labels` extensos que quebram o layout do `po-button`, use `labels` diretos, curtos e intuitivos.
 * - Utilize apenas um `po-button` configurado como `primary` por página.
 * - Para ações irreversíveis use sempre a propriedade `p-danger`.
 */
@Directive()
export class PoButtonBaseComponent {
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
  private _kind?: string = PoButtonKind.secondary;

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
   * @deprecated 15.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 15.x.x**. Utilizar `p-kind` no lugar.
   *
   * Define o estilo do `po-button`.
   *
   * Valore válidos:
   *  - `default`: **Deprecated 15.x.x**. Utilizar `p-kind="secondary"`.
   *  - `primary`: deixa o `po-button` com destaque, deve ser usado para ações primárias.
   *  - `danger`: **Deprecated 15.x.x**. Utilizar `p-danger`.
   *  - `link`: **Deprecated 15.x.x**. Utilizar `p-kind="tertiary"`.
   *
   * @default `secondary`
   */
  @Input('p-type') set type(value: string) {
    this.kind = value;
  }
  get type(): string {
    return this.kind;
  }

  /**
   * @optional
   *
   * @description
   *
   * Deve ser usado em ações irreversíveis que o usuário precisa ter cuidado ao executá-la, como a exclusão de um registro.
   *
   * > A propriedade `p-kind="tertiary"` será inativada ao utilizar esta propriedade.
   */

  @Input('p-danger') @InputBoolean() set danger(value: boolean) {
    this._danger = this.kind !== PoButtonKind.tertiary ? value : false;
  }

  get danger(): boolean {
    return this._danger;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o estilo do `po-button`.
   *
   * Valore válidos:
   *  - `primary`: deixa o `po-button` com destaque, deve ser usado para ações primárias.
   *  - `secondary`: estilo padrão do `po-button`.
   *  - `tertiary`: o `po-button` é exibido sem cor do fundo, recebendo menos destaque entre as ações.
   *
   * @default `secondary`
   */
  @Input('p-kind') set kind(value: string) {
    this._kind = PoButtonKind[value] ? PoButtonKind[value] : PoButtonKind.secondary;
  }

  get kind(): string {
    return this._kind;
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
}

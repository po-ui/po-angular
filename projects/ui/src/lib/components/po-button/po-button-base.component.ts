import { EventEmitter, Input, Output, Directive, TemplateRef, HostBinding } from '@angular/core';

import { convertToBoolean } from '../../utils/util';
import { InputBoolean } from '../../decorators';

import { PoButtonKind } from './po-button-kind.enum';
import { PoButtonSize } from './po-button-size.enum';
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
 *
 * #### Acessibilidade tratada no componente
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas pelo proprietário do conteúdo. São elas:
 *
 * - Quando em foco, o botão é ativado usando as teclas de Espaço e Enter do teclado. [W3C WAI-ARIA 3.5 Button - Keyboard Interaction](https://www.w3.org/WAI/ARIA/apg/#keyboard-interaction-3)
 * - A área do foco precisar ter uma espessura de pelo menos 2 pixels CSS e o foco não pode ficar escondido por outros elementos da tela. [WCAG 2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced)
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
  private _kind?: string = PoButtonKind.secondary;
  private _size?: string = PoButtonSize.medium;
  private _small?: boolean = false;

  protected hasSize?: boolean = false;

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
   * @deprecated 16.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 16.x.x**.
   *
   * > Por regras de acessibilidade o botão não terá mais um tamanho menor do que 44px e por isso a propriedade será depreciada.
   * > [Saiba mais](https://animaliads.notion.site/Bot-o-fb3a921e8ba54bd38b39758c24613368)
   *
   * Deixa o botão menor, com 32px de altura.
   *
   * @default `false`
   */
  @Input('p-small')
  @InputBoolean()
  set small(value: boolean) {
    this._small = !this.hasSize ? value : false;

    if (this._small) {
      this._size = 'small';
    }
  }

  get small(): boolean {
    return this._small;
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

  @HostBinding('attr.p-danger')
  @Input('p-danger')
  @InputBoolean()
  set danger(value: boolean) {
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
   * Define o tamanho do `po-button`.
   *
   * Valores válidos:
   * - `medium`: o `po-button` fica do tamanho padrão, com 44px de altura.;
   * - `large`: o `po-button` fica maior, com 56px de altura.;
   *
   * @default `medium`
   *
   */
  @HostBinding('attr.p-size')
  @Input('p-size')
  set size(value: string) {
    const size = this.small ? 'small' : value;

    if (size === 'small') {
      this._size = 'small';
      this._small = true;
    } else {
      this._size = PoButtonSize[size] ? PoButtonSize[size] : PoButtonSize.medium;
      this.hasSize = true;
    }
  }

  get size(): string {
    return this._size;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o estilo do `po-button`.
   *
   * Valores válidos:
   *  - `primary`: deixa o `po-button` com destaque, deve ser usado para ações primárias.
   *  - `secondary`: estilo padrão do `po-button`.
   *  - `tertiary`: o `po-button` é exibido sem cor do fundo, recebendo menos destaque entre as ações.
   *
   * @default `secondary`
   */

  @HostBinding('attr.p-kind')
  @Input('p-kind')
  set kind(value: string) {
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

  /**
   * @optional
   *
   * @description
   *
   * Define um `aria-label` para o `po-button`.
   *
   * Caso esta propriedade não seja informada será considerada a label do botão.
   *
   * > Em caso de botões com apenas ícone a atribuição de valor à esta propriedade é muito importante para acessibilidade.
   */
  @Input('p-aria-label') ariaLabel?: string;
}

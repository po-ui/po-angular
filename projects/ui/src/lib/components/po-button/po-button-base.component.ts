import { Directive, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

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
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                              | Descrição                                             | Valor Padrão                                      |
 * |------------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | `--font-family`                          | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size`                            | Tamanho da fonte                                      | `var(--font-size-default)`                        |
 * | `--font-weight`                          | Peso da fonte                                         | `var(--font-weight-bold)`                         |
 * | `--line-height`                          | Tamanho da label                                      | `var(--line-height-none)`                         |
 * | `--border-radius`                        | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                         |
 * | `--border-width`                         | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-md)`                          |
 * | `--padding`                              | Preenchimento                                         | `0 1em`                                           |                                                                        | ---                                             |
 * | **Danger**                               |                                                       |                                                   |
 * | `--text-color-danger`                    | Cor do texto no estado danger                         | `var(--color-neutral-light-00)`                   |
 * | `--color-button-danger`                  | Cor do botão no estado danger                         | `var(--color-feedback-negative-dark)`             |
 * | `--color-danger-hover`                   | Cor de hover no estado danger                         | `var(--color-feedback-negative-darker)`           |
 * | `--color-danger-pressed`                 | Cor pressionada no estado danger                      | `var(--color-feedback-negative-darkest)`          |
 * | `--background-danger-hover`              | Cor de background de hover no estado danger           | `var(--color-feedback-negative-lighter)`          |
 * | `--border-color-danger-hover`            | Cor da borda de hover no estado danger                | `var(--color-feedback-negative-darkest)`          |
 * | `--background-danger-pressed`            | Cor de background pressionado no estado danger        | `var(--color-feedback-negative-light)`            |
 * | `--background-color-button-danger`&nbsp; | Cor de background do botão no estado danger           | `var(--color-transparent)`                        |
 * | **Default Values**                       |                                                       |                                                   |
 * | `--text-color`                           | Cor do texto                                          | `var(--color-neutral-light-00)`                   |
 * | `--color`                                | Cor principal do botão                                | `var(--color-action-default)`                     |
 * | `--background-color`                     | Cor de background                                     | `var(--color-transparent)`                        |
 * | `--border-color`                         | Cor da borda                                          | `var(--color-transparent)`                        |
 * | `--shadow`                               | Contém o valor da sombra do elemento                  | `var(--shadow-none)`                              |
 * | **Hover**                                |                                                       |                                                   |
 * | `--color-hover`                          | Cor principal no estado hover                         | `var(--color-action-hover)`                       |
 * | `--background-hover`                     | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                   |
 * | `--border-color-hover`                   | Cor da borda no estado hover                          | `var(--color-brand-01-darkest)`                   |
 * | **Focused**                              |                                                       |                                                   |
 * | `--outline-color-focused`                | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
 * | **Pressed**                              |                                                       |                                                   |
 * | `--color-pressed`                        | Cor principal no estado de pressionado                | `var(--color-action-pressed)`                     |
 * | `--background-pressed`                   | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                     |
 * | **Disabled**                             |                                                       |                                                   |
 * | `--text-color-disabled`                  | Cor do texto no estado disabled                       | `var(--color-neutral-dark-70)`                    |
 * | `--color-disabled`                       | Cor principal no estado disabled                      | `var(--color-action-disabled)`                    |
 * | `--background-color-disabled`            | Cor de background no estado disabled                  | `var(--color-transparent)`                        |
 *
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
   * **Deprecated v20.x.x.** É possível usar qualquer um dos ícones da [Biblioteca de ícones](/guides/icons). conforme exemplo abaixo:
   * ```
   * <po-button p-icon="po-icon-user" p-label="PO button"></po-button>
   * ```
   * Utilize os ícones disponíveis na Lib [Phosphor](/guides/icons), conforme exemplo:
   * ```
   * <po-component
   *  [p-property]="[{ label: 'ICON', icon: 'ph ph-user' }]">
   * </po-component>
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
   * @optional
   *
   * @description
   *
   * Deve ser usado em ações irreversíveis que o usuário precisa ter cuidado ao executá-la, como a exclusão de um registro.
   *
   * > A propriedade `p-kind="tertiary"` será inativada ao utilizar esta propriedade.
   */

  @HostBinding('attr.p-danger')
  @Input({ alias: 'p-danger', transform: convertToBoolean })
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
    this._size = PoButtonSize[value] ? PoButtonSize[value] : PoButtonSize.medium;
    this.hasSize = true;
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

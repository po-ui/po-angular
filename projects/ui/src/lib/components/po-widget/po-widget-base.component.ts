import { Directive, EventEmitter, input, Input, Output, TemplateRef } from '@angular/core';

import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoPopupAction } from '../po-popup';
import { PoTagType } from '../po-tag';
import { PoWidgetAvatar } from './interfaces/po-widget-avatar.interface';
import { convertToBoolean, getDefaultSizeFn, isTypeof, uuid, validateSizeFn } from '../../utils/util';
import { validateAvatarSize } from '../po-avatar/po-avatar-base.component';

const PO_WIDGET_TAG_POSITION = ['right', 'top', 'bottom'];
const PO_WIDGET_TAG_POSITION_DEFAULT = 'right';

/**
 *
 * @description
 *
 * O componente `po-widget` é recomendado para exibição de *dashboards*, podendo ser utilizado
 * para incluir vários tipos de conteúdo como: gráficos, tabelas, grids e imagens.
 *
 * Além da exibição de conteúdos, este componente possibilita adicionar ações e um link
 * para ajuda, como também possibilita ser utilizado com ou sem sombra.
 *
 * Para controlar sua largura, é possível utilizar o [Grid System](/guides/grid-system) para um maior
 * controle de seu redimensionamento, assim possibilitando o tratamento para diferentes resoluções.
 *
 * #### Boas práticas
 *
 * Utilize um tamanho mínimo de largura de aproximadamente `18.75rem` no componente.
 *
 * #### Acessibilidade tratada no componente
 *
 * Algumas diretrizes de acessibilidade já são tratadas no componente, internamente, e não podem ser alteradas. São elas:
 * - Utiliza medidas relativas, para se adequar às preferências e necessidades de quem for utilizar o sistema.
 * - Desenvolvido com uso de controles padrões HTML, o que permite a identificação na interface por tecnologias assistivas. (WCAG [4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value))
 * - O foco é visível e possui uma espessura superior a 2 pixels CSS, não ficando escondido por outros elementos da tela. (WCAG [2.4.12: Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced))
 * - Quando selecionável, prevê interação por teclado, podendo ser selecionado através da tecla space (WCAG [2.4.1 - Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard))
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                  | Descrição                                                        | Valor Padrão                                                                |
 * |----------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------|
 * | **Default Values**                           |                                                                  |                                                                             |
 * | `--font-family`                              | Família tipográfica usada                                        | `var(--font-family-theme) `                                                 |
 * | `--font-size`                                | Tamanho da fonte                                                 | `var(--font-size-sm)`                                                       |
 * | `--font-weight`                              | Peso da fonte                                                    | `var(--font-weight-bold)`                                                   |
 * | `--font-color`                               | Cor da fonte                                                     | `var(--color-neutral-dark-95)`                                              |
 * | `--padding` - `@deprecated 21.x.x`           | Preenchimento do componente                                      | `1rem`                                                                      |
 * | `--padding-header`                           | Preenchimento do header                                          | `var(--spacing-sm) var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)`   |
 * | `--padding-body`                             | Preenchimento do body                                            | `var(--spacing-xs) var(--spacing-sm) var(--spacing-xs) var(--spacing-sm)`   |
 * | `--padding-avatar`                           | Preenchimento do avatar                                          | `var(--spacing-sm) 0 var(--spacing-xs) var(--spacing-sm)`                   |
 * | `--padding-footer`                           | Preenchimento do footer                                          | `var(--spacing-xs) var(--spacing-sm) var(--spacing-sm) var(--spacing-sm)`   |
 * | `--border-radius`                            | Contém o valor do raio dos cantos do elemento&nbsp;              | `var(--border-radius-md)`                                                   |
 * | `--border-width`                             | Contém o valor da largura dos cantos do elemento&nbsp;           | `var(--border-width-sm)`                                                    |
 * | `--border-color`                             | Cor da borda                                                     | `var(--color-neutral-light-20)`                                             |
 * | `--background`                               | Cor de background                                                | `var(--color-neutral-light-00)`                                             |
 * | `--shadow`                                   | Contém o valor da sombra do elemento                             | `var(--shadow-md)`                                                          |
 * | **Hover**                                    |                                                                  |                                                                             |
 * | `--border-color-hover`                       | Cor da borda no estado hover                                     | `var(--color-action-hover)`                                                 |
 * | **Focused**                                  |                                                                  |                                                                             |
 * | `--color-focused`                            | Cor principal no estado de focus                                 | `var(--color-action-default)`                                               |
 * | `--outline-color-focused` &nbsp;             | Cor do outline do estado de focus                                | `var(--color-action-focus)`                                                 |
 *
 */
@Directive()
export class PoWidgetBaseComponent {
  private _size?: string = undefined;

  /** Descrição da segunda ação. */
  /**
   * @optional
   *
   * @description
   * Define o label e exibe a ação secundária no footer do componente.
   *
   * > Exibida apenas quando `p-primary-label` estiver definida.
   */
  @Input('p-secondary-label') secondaryLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Caso verdadeiro o botão da ação `p-primary-label` ativará o modo `danger`.
   *
   * > Incompatível com o tipo **tertiary** da propriedade `p-kind-primary-action`.
   *
   * @default `false`
   */
  @Input({ alias: 'p-danger-primary-action', transform: convertToBoolean }) dangerPrimaryAction = false;

  /**
   * @optional
   *
   * @description
   *
   * Caso verdadeiro o botão da ação `p-secondary-label` ativará o modo `danger`.
   *
   * > Incompatível com o tipo **tertiary** da propriedade `p-kind-primary-action`.
   *
   * @default `false`
   */
  @Input({ alias: 'p-danger-secondary-action', transform: convertToBoolean }) dangerSecondaryAction = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o estilo do botão da ação `p-primary-label`, conforme o enum `PoButtonKind`.
   *
   * @default `tertiary`
   */
  @Input('p-kind-primary-action') kindPrimaryAction?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o estilo do botão da ação `p-secondary-label`, conforme o enum `PoButtonKind`.
   *
   * @default `tertiary`
   */
  @Input('p-kind-secondary-action') kindSecondaryAction?: string;

  /**
   * @optional
   *
   * @description
   *
   * Label da tag exibida no header.
   *
   * > Quando a tag atingir uma largura máxima de 15rem (240px), será truncado com reticências.
   * O conteúdo completo poderá ser visualizado ao passar o mouse sobre a tag, por meio do tooltip.
   */
  @Input('p-tag') tagLabel?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo da `p-tag`, conforme o enum **PoTagType**.
   *
   * Valores válidos:
   *  - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
   *  - `warning`: cor amarela que representa aviso ou advertência.
   *  - `danger`: cor vermelha para erro ou aviso crítico.
   *  - `info`: cor azul claro que caracteriza conteúdo informativo.
   *  - `neutral`: cor cinza claro para uso geral.
   *
   * @default `success`
   */
  @Input('p-tag-type') tagType: PoTagType | string;

  /**
   * @optional
   *
   * @description
   *
   * Define o ícone exibido ao lado do label da `p-tag`.
   *
   * É possível usar qualquer um dos ícones da [Biblioteca de ícones PO UI](https://po-ui.io/icons), conforme exemplo:
   * ```
   * <po-widget p-tag-icon="an an-user"></po-widget>
   * ```
   * Também é possível utilizar outras fontes de ícones, por exemplo a biblioteca *Font Awesome*, desde que a biblioteca
   * esteja carregada no projeto:
   * ```
   * <po-widget p-tag-icon="fa fa-podcast"></po-widget>
   * ```
   *
   * Outra opção seria a customização do ícone através do `TemplateRef`, conforme exemplo abaixo:
   * ```
   * <po-widget [p-tag-icon]="template"></po-widget>
   *
   * <ng-template #template>
   *   <i class="fa fa-podcast" style="font-size: inherit;"></i>
   * </ng-template>
   * ```
   * > Para o ícone enquadrar corretamente, deve-se utilizar `font-size: inherit` caso o ícone utilizado não aplique-o.
   */
  @Input('p-tag-icon') tagIcon: string | TemplateRef<void>;

  /**
   * @Input p-tag-position
   *
   * @optional
   *
   * @description
   * Define o posicionamento da `po-tag` no cabeçalho do Widget:
   * - `right`: posicionada no canto superior direito do cabeçalho.
   * - `top`: posicionada à esquerda, acima do título (quando houver).
   * - `bottom`: posicionada à esquerda, abaixo do título (quando houver).
   *
   * @default `right`
   */
  tagPosition = input('right', { alias: 'p-tag-position', transform: this.transformTagPosition });

  /**
   * @optional
   *
   * @description
   *
   * Lista de ações exibidas no header do componente.
   * As propriedades das ações seguem a interface `PoPopupAction`.
   */
  @Input('p-actions') actions: Array<PoPopupAction> = [];

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho dos botões do componente:
   * - `small`: altura de 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura de 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input({ alias: 'p-size' }) set size(value: string) {
    this._size = validateSizeFn(value, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }

  /**
   * @Input p-avatar
   *
   * @optional
   *
   * @description
   *
   * Define o avatar a ser exibido à esquerda no Widget.
   */
  avatar = input<PoWidgetAvatar, PoWidgetAvatar>(undefined, {
    alias: 'p-avatar',
    transform: this.transformAvatar
  });

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando o usuário clicar no componente.
   * > Quando este evento está em uso, uma sombra (shadow) é aplicada automaticamente ao componente.
   */
  @Output('p-click') click: EventEmitter<MouseEvent | KeyboardEvent> = new EventEmitter<MouseEvent | KeyboardEvent>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado quando a propriedade `p-disabled` for alterada.
   */
  @Output('p-on-disabled') onDisabled: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao clicar na ação `p-primary-label`.
   */
  @Output('p-primary-action') primaryAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao clicar na ação `p-secondary-label`.
   */
  @Output('p-secondary-action') secondaryAction: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar em **Configurações** incluído no menu de ações do header.
   */
  @Output('p-setting') setting: EventEmitter<any> = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no título definido em `p-title`.
   */
  @Output('p-title-action') titleAction: EventEmitter<any> = new EventEmitter<any>();

  containerHeight?: string = 'auto';
  id = uuid();

  private _background?: string;
  private _disabled?: boolean = false;
  private _height?: number;
  private _help?: string;
  private _noShadow?: boolean = false;
  private _primary?: boolean = false;
  private _primaryLabel?: string;
  private _title?: string;

  /**
   * @optional
   *
   * @description
   *
   * Define uma imagem de fundo.
   * > Se a imagem escolhida intervir na legibilidade do texto contido no `p-widget`,
   * pode-se utilizar a propriedade `p-primary` em conjunto para que os textos fiquem na cor branca.
   *
   */
  @Input('p-background') set background(value: string) {
    this._background = value && typeof value === 'string' ? value : undefined;
  }

  get background() {
    return this._background;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o componente.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);

    this.onDisabled.emit(this.disabled);
  }

  get disabled() {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do componente.
   * > Caso não seja informado valor, a propriedade irá assumir o tamanho do conteúdo.
   */
  @Input('p-height') set height(value: number) {
    this._height = parseInt(<any>value, 10);
  }

  get height(): number {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Link de ajuda incluído no menu de ações do header.
   */
  @Input('p-help') set help(value: string) {
    this._help = isTypeof(value, 'string') ? value : '';
  }

  get help(): string {
    return this._help;
  }

  /**
   *
   * @optional
   *
   * @description
   *
   * Desabilita a sombra do componente quando o mesmo for clicável.
   * > A sombra é exibida por padrão apenas quando o evento `p-click` está definido.
   *
   * @default `true`
   */
  @Input('p-no-shadow') set noShadow(value: boolean) {
    this._noShadow = <any>value === '' ? true : convertToBoolean(value);
  }

  get noShadow(): boolean {
    return this._noShadow;
  }

  /**
   * @optional
   *
   * @description
   *
   * Opção para que o `po-widget` fique em destaque.
   *
   * @default `false`
   */
  @Input('p-primary') set primary(value: boolean) {
    this._primary = <any>value === '' ? true : convertToBoolean(value);
  }

  get primary(): boolean {
    return this._primary;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o label e exibe a ação primária no footer do componente.
   *
   */
  @Input('p-primary-label') set primaryLabel(value: string) {
    this._primaryLabel = isTypeof(value, 'string') ? value : '';
  }

  get primaryLabel(): string {
    return this._primaryLabel;
  }

  /**
   * @optional
   *
   * @description
   *
   * Título do componente.
   *
   * > Quando o conteúdo exceder o espaço disponível, o texto será truncado com reticências.  O conteúdo completo poderá
   * ser visualizado ao passar o mouse sobre a tag, por meio do tooltip.
   */
  @Input('p-title') set title(value: string) {
    this._title = isTypeof(value, 'string') ? value : '';
  }

  get title(): string {
    return this._title;
  }

  private transformAvatar(value: PoWidgetAvatar | undefined) {
    if (!value) {
      return value;
    }

    const result = { ...value };

    if (result?.size) {
      result.size = validateAvatarSize(result.size);
    }

    if (result?.widthCustomTemplate) {
      const numericValue = Number(result.widthCustomTemplate.replace(/\D/g, ''));
      result.widthCustomTemplate = numericValue ? `${Math.min(numericValue, 50)}%` : undefined;
    }

    return result;
  }

  private transformTagPosition(value: string): string {
    return PO_WIDGET_TAG_POSITION.includes(value) ? value : PO_WIDGET_TAG_POSITION_DEFAULT;
  }
}

import { Directive, HostBinding, HostListener, Input, ViewChild, output } from '@angular/core';

import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageAction } from '../interfaces/po-page-action.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageActionsLayout } from './enums/po-page-actions-layout.enum';
import { PoPageHeaderType } from './enums/po-page-header-type.enum';
import { PoPageDefaultLiterals } from './po-page-default-literals.interface';

export const poPageDefaultLiteralsDefault = {
  en: <PoPageDefaultLiterals>{
    otherActions: 'Other actions'
  },
  es: <PoPageDefaultLiterals>{
    otherActions: 'Otras acciones'
  },
  pt: <PoPageDefaultLiterals>{
    otherActions: 'Outras ações'
  },
  ru: <PoPageDefaultLiterals>{
    otherActions: 'Другие действия'
  }
};

export const backNavigationAriaLabels = {
  en: 'Back',
  es: 'Volver',
  pt: 'Voltar',
  ru: 'Назад'
};

/**
 * @description
 *
 * O `po-page-default` é utilizado como container principal para telas sem um template definido.
 *
 * Oferece suporte a cabeçalhos dinâmicos via `p-page-header-type`, navegação por *breadcrumb*
 * e gerenciamento de ações com agrupamento responsivo via `p-page-actions-layout`.
 *
 * #### Tokens customizáveis
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                        | Descrição                                   | Valor Padrão                          |
 * |----------------------------------------------------|---------------------------------------------|---------------------------------------|
 * | **Página (po-page-default)**                       |                                             |                                       |
 * | `--background`                                     | Background da página (header e body)        | `var(--color-page-background-color-page)` |
 * | **Header (po-page-header)**                        |                                             |                                       |
 * | `--padding`                                        | Espaçamento do header                       | `var(--spacing-xs) var(--spacing-md)` |
 * | `--gap`                                            | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)`                   |
 * | `--gap-actions`                                    | Espaçamento entre as ações                  | `var(--spacing-xs)`                   |
 * | **Header (po-page-header .po-page-header-title)**  |                                             |                                       |
 * | `--font-family`                                    | Família tipográfica do título               | `var(--font-family-theme)`            |
 * | **Content (po-page-content)**                      |                                             |                                       |
 * | `--padding-content`                                | Espaçamento do conteúdo                     | `var(--spacing-xs) var(--spacing-sm)` |
 */
@Directive()
export abstract class PoPageDefaultBaseComponent {
  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  visibleActions: Array<PoPageAction> = [];

  protected language: string;

  private _actions?: Array<PoPageAction> = [];
  private _breadcrumb?: PoBreadcrumb;
  private _componentsSize?: string = undefined;
  private _initialComponentsSize?: string = undefined;
  private _literals: PoPageDefaultLiterals;
  private _pageActionsLayout: string = PoPageActionsLayout.default;
  private _pageHeaderType: string = PoPageHeaderType.primary;
  private _subtitle: string;
  private _title: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a lista de ações que serão exibidas no cabeçalho da página.
   *
   * Recebe um array de objetos que implementam a interface `PoPageAction`.
   *
   * > O comportamento de exibição pode ser customizado através da propriedade `p-page-actions-layout`.
   *
   * @default `[]`
   */
  @Input('p-actions') set actions(actions: Array<PoPageAction>) {
    this._actions = Array.isArray(actions) ? actions : [];

    this.visibleActions = this.getVisibleActions();
    this.setDropdownActions();
  }

  get actions(): Array<PoPageAction> {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o sistema de navegação que indica o caminho da página atual na hierarquia da aplicação.
   *
   * Recebe um objeto que implementa a interface `PoBreadcrumb`.
   *
   * > Compatível com o cabeçalho (`p-page-header-type`) do tipo `primary`.
   */
  @Input('p-breadcrumb') set breadcrumb(value: PoBreadcrumb) {
    this._breadcrumb = value;
    setTimeout(() => this.poPageContent?.recalculateHeaderSize());
  }

  get breadcrumb(): PoBreadcrumb {
    return this._breadcrumb;
  }

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
  set componentsSize(value: string) {
    this._initialComponentsSize = value;
    this.applySizeBasedOnA11y();
  }

  @Input('p-components-size')
  @HostBinding('attr.p-components-size')
  get componentsSize(): string {
    return this._componentsSize ?? getDefaultSizeFn(PoFieldSize);
  }

  /**
   * @optional
   *
   * @description
   *
   * Permite a customização das literais utilizadas no componente.
   *
   * Para customizar, basta passar um objeto parcial ou completo que implemente a interface `PoPageDefaultLiterals`.
   *
   * Exemplo de uso:
   *
   * ```html
   * <po-page-default [p-literals]="customLiterals"></po-page-default>
   * ```
   *
   * ```typescript
   * const customLiterals: PoPageDefaultLiterals = {
   *   otherActions: 'Mais opções'
   * };
   * ```
   *
   * > O valor padrão será traduzido de acordo com o idioma configurado no [`PoI18nService`](/documentation/po-i18n) ou navegador.
   */
  @Input('p-literals') set literals(value: PoPageDefaultLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poPageDefaultLiteralsDefault[poLocaleDefault],
        ...poPageDefaultLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poPageDefaultLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poPageDefaultLiteralsDefault[this.language];
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o layout de exibição das ações no cabeçalho.
   *
   * Aceita valores do enum `PoPageActionsLayout`.
   *
   * > Em telas reduzidas (< 480px) as ações fora do *dropdown* que possuam a propriedade `PoPageAction.icon` definida
   * exibirão apenas o ícone.
   *
   * @default `default`
   */
  @Input('p-page-actions-layout') set pageActionsLayout(value: string | PoPageActionsLayout) {
    const strValue = typeof value === 'string' ? value : '';
    this._pageActionsLayout = PoPageActionsLayout[strValue]
      ? PoPageActionsLayout[strValue]
      : PoPageActionsLayout.default;
  }

  get pageActionsLayout(): string {
    return this._pageActionsLayout;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de cabeçalho da página.
   *
   * Aceita valores do enum `PoPageHeaderType`.
   *
   * @default `primary`
   */
  @Input('p-page-header-type') set pageHeaderType(value: string | PoPageHeaderType) {
    const strValue = typeof value === 'string' ? value : '';
    this._pageHeaderType = PoPageHeaderType[strValue] ? PoPageHeaderType[strValue] : PoPageHeaderType.primary;
    setTimeout(() => this.poPageContent?.recalculateHeaderSize());
  }

  get pageHeaderType(): string {
    return this._pageHeaderType;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o título principal da página.
   */
  @Input('p-title') set title(title: string) {
    this._title = title;
    setTimeout(() => this.poPageContent?.recalculateHeaderSize());
  }

  get title() {
    return this._title;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define um texto de apoio ou informações adicionais logo abaixo do título principal.
   *
   * > Requer que`p-title` esteja definido.
   */
  @Input('p-subtitle') set subtitle(value: string) {
    this._subtitle = value;
    setTimeout(() => this.poPageContent?.recalculateHeaderSize());
  }

  get subtitle(): string {
    return this._subtitle;
  }

  /**
   * @optional
   *
   * @description
   *
   * Evento disparado ao clicar no botão voltar exibido no cabeçalho.
   *
   * > Botão exibido apenas quando a propriedade `p-page-header-type` está configurada como `secondary`.
   */
  back = output<void>({ alias: 'p-back' });

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();

    // Recalcula o height do content após os componentes reagirem à mudança de tema/a11y
    setTimeout(() => this.poPageContent?.recalculateHeaderSize());
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialComponentsSize, PoFieldSize);
    this._componentsSize = size;
  }

  // Seta a lista de ações no dropdown.
  abstract setDropdownActions();

  abstract getVisibleActions();
}

import { Directive, HostBinding, HostListener, Input, output } from '@angular/core';

import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageAction } from '../interfaces/po-page-action.interface';
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

/**
 * @description
 *
 * O componente `po-page-default` é utilizado como o container principal para as telas sem um template definido.
 *
 * #### Tokens customizáveis
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade         | Descrição                                   | Valor Padrão                          |
 * |---------------------|---------------------------------------------|---------------------------------------|
 * | **Header**          |                                             |                                       |
 * | `--padding`         | Espaçamento do header                       | `var(--spacing-xs) var(--spacing-md)` |
 * | `--gap`             | Espaçamento entre os breadcrumbs e o título | `var(--spacing-md)`                   |
 * | `--gap-actions`     | Espaçamento entre as ações                  | `var(--spacing-xs)`                   |
 * | `--font-family`     | Família tipográfica do título               | `var(--font-family-theme)`            |
 * | **Header Secondary**|                                             |                                       |
 * | `--background-secondary`       | Background do header secondary   | `none`                                |
 * | `--padding-secondary`          | Espaçamento do header secondary  | `var(--spacing-sm)`                   |
 * | `--font-size-title-secondary`  | Tamanho da fonte do título       | `var(--font-size-md)`                 |
 * | `--font-weight-title-secondary`| Peso da fonte do título          | `var(--font-weight-semibold)`         |
 * | `--letter-spacing-title-secondary`| Espaçamento entre letras       | `0`                                   |
 * | `--gap-navigation`             | Espaçamento entre o botão voltar e o título | `var(--spacing-xs)`           |
 * | **Header Tertiary** |                                             |                                       |
 * | `--font-weight-title-tertiary` | Peso da fonte do título          | `var(--font-weight-normal)`           |
 * | **Content**         |                                             |                                       |
 * | `--padding-content` | Espaçamento do conteúdo                     | `var(--spacing-xs) var(--spacing-sm)` |
 */
@Directive()
export abstract class PoPageDefaultBaseComponent {
  visibleActions: Array<PoPageAction> = [];

  protected language: string;

  private _actions?: Array<PoPageAction> = [];
  private _componentsSize?: string = undefined;
  private _initialComponentsSize?: string = undefined;
  private _literals: PoPageDefaultLiterals;
  private _pageActionsLayout: string = PoPageActionsLayout.default;
  private _pageHeaderType: string = PoPageHeaderType.primary;
  private _title: string;

  /**
   * @optional
   *
   * @description
   *
   * Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`.
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
   * Objeto com propriedades do breadcrumb.
   *
   * > Compatível apenas com o header `primary`. No header `secondary` o breadcrumb é substituído pelo botão de voltar.
   * No header `tertiary` o breadcrumb não é exibido.
   */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb;

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
   * Objeto com as literais usadas no `po-page-default`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoPageDefaultLiterals = {
   *    otherActions: 'Mais ações'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoPageDefaultLiterals = {
   *    otherActions: 'Ações da página'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-page-default
   *   [p-literals]="customLiterals">
   * </po-page-default>
   * ```
   *
   * > O valor padrão será traduzido de acordo com o idioma configurado no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
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
   * Define o layout das ações do header. Aceita valores do enum `PoPageActionsLayout` ou `string`.
   *
   * Valores válidos:
   * - `default`: comportamento padrão (botões visíveis e dropdown para overflow).
   * - `dropdown`: todas as ações ficam dentro do dropdown.
   * - `mixed`: primeira ação como botão, demais no dropdown. Em telas pequenas (< 480px), a ação exibe
   *   apenas o ícone (customizável via `PoPageAction.icon`).
   *
   * @default `default`
   */
  @Input('p-page-actions-layout') set pageActionsLayout(value: string | PoPageActionsLayout) {
    const strValue = typeof value === 'string' ? value : '';
    this._pageActionsLayout = PoPageActionsLayout[strValue] ? PoPageActionsLayout[strValue] : PoPageActionsLayout.default;
  }

  get pageActionsLayout(): string {
    return this._pageActionsLayout;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de header da página. Aceita valores do enum `PoPageHeaderType` ou `string`.
   *
   * Valores válidos:
   * - `primary`: header padrão com breadcrumb e ações (comportamento atual).
   * - `secondary`: header com botão de voltar (apenas ícone por padrão), sem breadcrumb.
   *   O `kind` dos botões de ação é definido individualmente via `PoPageAction.kind` (padrão: `secondary`).
   * - `tertiary`: header sem botão de navegação e sem breadcrumb.
   *   O `kind` dos botões de ação é definido individualmente via `PoPageAction.kind` (padrão: `secondary`).
   *
   * @default `primary`
   */
  @Input('p-page-header-type') set pageHeaderType(value: string | PoPageHeaderType) {
    const strValue = typeof value === 'string' ? value : '';
    this._pageHeaderType = PoPageHeaderType[strValue] ? PoPageHeaderType[strValue] : PoPageHeaderType.primary;
  }

  get pageHeaderType(): string {
    return this._pageHeaderType;
  }

  /** Título da página. */
  @Input('p-title') set title(title: string) {
    this._title = title;
  }

  get title() {
    return this._title;
  }

  /**
   * @optional
   *
   * @description
   *
   * Subtitulo do Header da página
   */
  @Input('p-subtitle') subtitle: string;

  /**
   * Evento disparado ao clicar no botão de voltar no header `secondary`.
   *
   * ```
   * <po-page-default (p-back)="myBackFunction()">
   * </po-page-default>
   * ```
   */
  back = output<void>({ alias: 'p-back' });

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  @HostListener('window:PoUiThemeChange')
  protected onThemeChange(): void {
    this.applySizeBasedOnA11y();
  }

  private applySizeBasedOnA11y(): void {
    const size = validateSizeFn(this._initialComponentsSize, PoFieldSize);
    this._componentsSize = size;
  }

  // Seta a lista de ações no dropdown.
  abstract setDropdownActions();

  abstract getVisibleActions();
}

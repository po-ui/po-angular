import { Directive, HostBinding, Input, ViewChild } from '@angular/core';

import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoFieldSize } from '../../../enums/po-field-size.enum';
import { getDefaultSizeFn, validateSizeFn } from '../../../utils/util';
import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageAction } from '../interfaces/po-page-action.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
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
 * | **Content**         |                                             |                                       |
 * | `--padding-content` | Espaçamento do conteúdo                     | `var(--spacing-xs) var(--spacing-sm)` |
 */
@Directive()
export abstract class PoPageDefaultBaseComponent {
  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb;

  visibleActions: Array<PoPageAction> = [];

  protected language: string;

  private _actions?: Array<PoPageAction> = [];
  private _componentsSize?: string = undefined;
  private _literals: PoPageDefaultLiterals;
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
   * Define o tamanho dos componentes de formulário no template:
   * - `small`: aplica a medida small de cada componente (disponível apenas para acessibilidade AA).
   * - `medium`: aplica a medida medium de cada componente.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @HostBinding('attr.p-components-size')
  @Input('p-components-size')
  set componentsSize(value: string) {
    this._componentsSize = validateSizeFn(value, PoFieldSize);
  }

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

  /** Título da página. */
  @Input('p-title') set title(title: string) {
    this._title = title;
    setTimeout(() => this.poPageContent.recalculateHeaderSize());
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

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  // Seta a lista de ações no dropdown.
  abstract setDropdownActions();

  abstract getVisibleActions();
}

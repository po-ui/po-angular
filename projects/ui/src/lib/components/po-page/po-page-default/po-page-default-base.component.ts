import { Input, ViewChild, Directive } from '@angular/core';

import { PoLanguageService } from './../../../services/po-language/po-language.service';
import { poLocaleDefault } from './../../../services/po-language/po-language.constant';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageAction } from '../po-page-action.interface';
import { PoPageDefaultLiterals } from './po-page-default-literals.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';

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
 */
@Directive()
export abstract class PoPageDefaultBaseComponent {
  private _actions?: Array<PoPageAction> = [];
  private _literals: PoPageDefaultLiterals;
  private _title: string;

  visibleActions: Array<PoPageAction> = [];

  protected language: string;

  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  /**
   * @optional
   *
   * @description
   *
   * Nesta propriedade deve ser definido um array de objetos que implementam a interface `PoPageAction`.
   */
  @Input('p-actions') set actions(actions: Array<PoPageAction>) {
    this._actions = Array.isArray(actions) ? actions : [];
    this.visibleActions = this.actions.filter(action => action.visible !== false);
    this.setDropdownActions();
  }

  get actions(): Array<PoPageAction> {
    return this._actions;
  }

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb;

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

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

  // Seta a lista de ações no dropdown.
  abstract setDropdownActions();
}

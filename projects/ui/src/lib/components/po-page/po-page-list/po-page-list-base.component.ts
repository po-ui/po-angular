import { Input, Directive, ViewChild } from '@angular/core';

import { poLocaleDefault } from './../../../services/po-language/po-language.constant';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoDisclaimerGroup } from '../../po-disclaimer-group/po-disclaimer-group.interface';
import { PoPageAction } from '../po-page-action.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageFilter } from './../po-page-filter.interface';
import { PoPageListLiterals } from './po-page-list-literals.interface';

export const poPageListLiteralsDefault = {
  en: <PoPageListLiterals>{
    otherActions: 'Other actions'
  },
  es: <PoPageListLiterals>{
    otherActions: 'Otras acciones'
  },
  pt: <PoPageListLiterals>{
    otherActions: 'Outras ações'
  },
  ru: <PoPageListLiterals>{
    otherActions: 'Другие действия'
  }
};

/**
 * @description
 *
 * O componente `po-page-list` é utilizado como o container principal para as telas de listagem de dados,
 * podendo ser apresentado como lista ou tabela.
 *
 * Este componente possibilita realizar filtro dos dados, no qual permite que seja atribuido uma função que será executada no momento
 * da filtragem. Este comportamento pode ser acionado tanto ao *click* do ícone [po-icon-search](/guides/icons)
 * quanto ao pressionar da tecla *ENTER* quando o foco estiver no campo de pesquisa.
 *
 * Para facilitar a manipulação e visualização dos filtros aplicados, é possível também utilizar o componente
 * [`po-disclaimer-group`](/documentation/po-disclaimer-group).
 */
@Directive()
export abstract class PoPageListBaseComponent {
  private _actions?: Array<PoPageAction> = [];
  private _disclaimerGroup?: PoDisclaimerGroup;
  private _literals: PoPageListLiterals;
  private _title: string;

  visibleActions: Array<PoPageAction> = [];

  protected language: string;
  protected resizeListener: () => void;

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

  /**
   * @optional
   *
   * @description
   *
   * Objeto que implementa as propriedades da interface `PoBreadcrumb`.
   */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb;

  /**
   * @optional
   *
   * @description
   *
   * Objeto que implementa as propriedades da interface `PoDisclaimerGroup`.
   */
  @Input('p-disclaimer-group') set disclaimerGroup(value: PoDisclaimerGroup) {
    if (!value) {
      value = <any>{};
    }

    this._disclaimerGroup = value;
  }

  get disclaimerGroup(): PoDisclaimerGroup {
    return this._disclaimerGroup;
  }

  /**
   * @description
   *
   * Objeto que implementa as propriedades da interface `PoPageFilter`.
   */
  @Input('p-filter') filter: PoPageFilter;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-page-list`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoPageListLiterals = {
   *    otherActions: 'Mais ações'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoPageListLiterals = {
   *    otherActions: 'Ações da página'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-page-list
   *   [p-literals]="customLiterals">
   * </po-page-list>
   * ```
   *
   * > O valor padrão será traduzido de acordo com o idioma configurado no [`PoI18nService`](/documentation/po-i18n) ou *browser*.
   */
  @Input('p-literals') set literals(value: PoPageListLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poPageListLiteralsDefault[poLocaleDefault],
        ...poPageListLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poPageListLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poPageListLiteralsDefault[this.language];
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

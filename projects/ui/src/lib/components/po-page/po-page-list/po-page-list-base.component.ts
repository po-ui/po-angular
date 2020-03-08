import { Input, Directive } from '@angular/core';

import { poLocaleDefault } from './../../../utils/util';
import { PoLanguageService } from './../../../services/po-language/po-language.service';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoDisclaimerGroup } from '../../po-disclaimer-group/po-disclaimer-group.interface';
import { PoPageDefaultBaseComponent } from '../po-page-default/po-page-default-base.component';
import { PoPageFilter } from './../po-page-filter.interface';
import { PoPageListLiterals } from './po-page-list-literals.interface';

export const poPageListLiteralsDefault = {
  en: <PoPageListLiterals> {
    otherActions: 'Other actions'
  },
  es: <PoPageListLiterals> {
    otherActions: 'Otras acciones'
  },
  pt: <PoPageListLiterals> {
    otherActions: 'Outras ações'
  },
  ru: <PoPageListLiterals> {
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
export abstract class PoPageListBaseComponent extends PoPageDefaultBaseComponent {

  private _disclaimerGroup?: PoDisclaimerGroup;
  private _literals: PoPageListLiterals;

  protected language: string;
  protected resizeListener: () => void;

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
      value = <any> {};
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

  constructor(languageService: PoLanguageService) {
    super();

    this.language = languageService.getShortLanguage();
  }

}

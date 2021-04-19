import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { PoLanguageService } from '../../../services/po-language/po-language.service';
import { poLocaleDefault } from '../../../services/po-language/po-language.constant';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageDetailLiterals } from './po-page-detail-literals.interface';

export const poPageDetailLiteralsDefault = {
  en: <PoPageDetailLiterals>{
    back: 'Back',
    edit: 'Edit',
    remove: 'Remove'
  },
  es: <PoPageDetailLiterals>{
    back: 'Volver',
    edit: 'Editar',
    remove: 'Eliminar'
  },
  pt: <PoPageDetailLiterals>{
    back: 'Voltar',
    edit: 'Editar',
    remove: 'Remover'
  },
  ru: <PoPageDetailLiterals>{
    back: 'возвращение',
    edit: 'редактировать',
    remove: 'удаление'
  }
};

/**
 * @description
 *
 * O componente **po-page-detail** é utilizado como container principal para a tela de
 * detalhamento de um registro, tendo a possibilidade de usar as ações de "Voltar", "Editar" e "Remover".
 */
@Directive()
export class PoPageDetailBaseComponent {
  private _literals: PoPageDetailLiterals;
  private _title: string;
  private language: string;

  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb: PoBreadcrumb;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-page-detail`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoPageDetailLiterals = {
   *    edit: 'Edição',
   *    remove: 'Exclusão',
   *    back: 'Menu'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoPageDetailLiterals = {
   *    remove: 'Excluir registro permanentemente'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-page-detail
   *   [p-literals]="customLiterals">
   * </po-page-detail>
   * ```
   *
   * > O objeto padrão de literais será traduzido de acordo com o idioma do
   * [`PoI18nService`](/documentation/po-i18n) ou do browser.
   */
  @Input('p-literals') set literals(value: PoPageDetailLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poPageDetailLiteralsDefault[poLocaleDefault],
        ...poPageDetailLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poPageDetailLiteralsDefault[this.language];
    }
  }
  get literals() {
    return this._literals || poPageDetailLiteralsDefault[this.language];
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
   * Evento que será disparado ao clicar no botão de "Voltar".
   *
   * ```
   * <po-page-detail (p-back)="myBackFunction()">
   * </po-page-detail>
   * ```
   *
   * > Caso não utilizar esta propriedade, o botão de "Voltar" não será exibido.
   */
  @Output('p-back') back = new EventEmitter();

  /**
   * Evento que será disparado ao clicar no botão de "Editar".
   *
   * ```
   * <po-page-detail (p-edit)="myEditFunction()">
   * </po-page-detail>
   * ```
   *
   * > Caso não utilizar esta propriedade, o botão de "Editar" não será exibido.
   */
  @Output('p-edit') edit = new EventEmitter();

  /**
   * Evento que será disparado ao clicar no botão de "Remover".
   *
   * ```
   * <po-page-detail (p-remove)="myRemoveFunction()">
   * </po-page-detail>
   * ```
   *
   * > Caso não utilizar esta propriedade, o botão de "Remover" não será exibido.
   */
  @Output('p-remove') remove = new EventEmitter();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }
}

import { Input, ViewChild, Directive } from '@angular/core';

import { browserLanguage, poLocaleDefault } from './../../../utils/util';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageDetailLiterals } from './po-page-detail-literals.interface';

export const poPageDetailLiteralsDefault = {
  en: <PoPageDetailLiterals> {
    back: 'Back',
    edit: 'Edit',
    remove: 'Remove'
  },
  es: <PoPageDetailLiterals> {
    back: 'Volver',
    edit: 'Editar',
    remove: 'Eliminar'
  },
  pt: <PoPageDetailLiterals> {
    back: 'Voltar',
    edit: 'Editar',
    remove: 'Remover'
  },
  ru: <PoPageDetailLiterals> {
    back: 'возвращение',
    edit: 'редактировать',
    remove: 'удаление'
  }
};

/**
 * @description
 *
 * O componente **po-page-detail** é utilizado como container principal para a tela de detalhamento de um registro.
 * Por padrão possui 3 ações, cada ação na tela executa uma função no componente que está utilizando o po-page-detail,
 * são elas:
 *  - Voltar (função: back);
 *  - Editar (função: edit);
 *  - Remover (função: remove);
 *
 * Caso não estiver implementado alguma função, listado anteriormente, o mesmo não será apresentado.
 */
@Directive()
export class PoPageDetailBaseComponent {

  private _literals: PoPageDetailLiterals;
  private _title: string;

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
   *  > O objeto padrão de literais será traduzido de acordo com o idioma do browser (pt, en, es).
   */
  @Input('p-literals') set literals(value: PoPageDetailLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poPageDetailLiteralsDefault[poLocaleDefault],
        ...poPageDetailLiteralsDefault[browserLanguage()],
        ...value
      };
    } else {
      this._literals = poPageDetailLiteralsDefault[browserLanguage()];
    }
  }
  get literals() {
    return this._literals || poPageDetailLiteralsDefault[browserLanguage()];
  }

  /** Título da página. */
  @Input('p-title') set title(title: string) {
    this._title = title;
    setTimeout(() => this.poPageContent.recalculateHeaderSize());
  }

  get title() {
    return this._title;
  }

}

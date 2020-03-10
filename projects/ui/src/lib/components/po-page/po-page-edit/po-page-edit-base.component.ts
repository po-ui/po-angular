import { Input, ViewChild, Directive } from '@angular/core';

import { browserLanguage, poLocaleDefault } from './../../../utils/util';

import { PoBreadcrumb } from '../../po-breadcrumb/po-breadcrumb.interface';
import { PoPageContentComponent } from '../po-page-content/po-page-content.component';
import { PoPageEditLiterals } from './po-page-edit-literals.interface';

export const poPageEditLiteralsDefault = {
  en: <PoPageEditLiterals>{
    cancel: 'Cancel',
    save: 'Save',
    saveNew: 'Save and New'
  },
  es: <PoPageEditLiterals>{
    cancel: 'Cancelar',
    save: 'Guardar',
    saveNew: 'Guardar y Nuevo'
  },
  pt: <PoPageEditLiterals>{
    cancel: 'Cancelar',
    save: 'Salvar',
    saveNew: 'Salvar e Novo'
  },
  ru: <PoPageEditLiterals>{
    cancel: 'отменить',
    save: 'экономить',
    saveNew: 'Сохранить и новый'
  }
};

/**
 * @description
 *
 * O componente **po-page-edit** é utilizado como container principal para tela de edição ou adição de um
 * registro.
 * Por padrão possui 3 ações, cada ação na tela executa uma função no componente que está utilizando o po-page-edit,
 * são elas:
 *  - Cancelar (função: cancel);
 *  - Salvar e Novo (função: saveNew);
 *  - Salvar (função: save);
 *
 * Caso não estiver implementado alguma função, listado anteriormente, o mesmo não será apresentado.
 *
 * Os botões "Salvar" e "Salvar e Novo" podem ser habilitados/desabilitados utilizando a propriedade p-disable-submit.
 * Esta propriedade pode ser utilizada para desabilitar os botões caso exista um formulário inválido na página ou alguma
 * regra de negócio não tenha sido atendida.
 */
@Directive()
export class PoPageEditBaseComponent {
  private _literals: PoPageEditLiterals;
  private _title: string;

  @ViewChild(PoPageContentComponent, { static: true }) poPageContent: PoPageContentComponent;

  /** Objeto com propriedades do breadcrumb. */
  @Input('p-breadcrumb') breadcrumb?: PoBreadcrumb;

  /** Desabilita botões de submissão (save e saveNew) */
  @Input('p-disable-submit') disableSubmit?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Objeto com as literais usadas no `po-page-edit`.
   *
   * Existem duas maneiras de customizar o componente, passando um objeto com todas as literais disponíveis:
   *
   * ```
   *  const customLiterals: PoPageEditLiterals = {
   *    cancel: 'Voltar',
   *    save: 'Confirmar',
   *    saveNew: 'Confirmar e criar um novo'
   *  };
   * ```
   *
   * Ou passando apenas as literais que deseja customizar:
   *
   * ```
   *  const customLiterals: PoPageEditLiterals = {
   *    cancel: 'Cancelar processo'
   *  };
   * ```
   *
   * E para carregar as literais customizadas, basta apenas passar o objeto para o componente.
   *
   * ```
   * <po-page-edit
   *   [p-literals]="customLiterals">
   * </po-page-edit>
   * ```
   *
   *  > O objeto padrão de literais será traduzido de acordo com o idioma do browser (pt, en, es).
   */
  @Input('p-literals') set literals(value: PoPageEditLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poPageEditLiteralsDefault[poLocaleDefault],
        ...poPageEditLiteralsDefault[browserLanguage()],
        ...value
      };
    } else {
      this._literals = poPageEditLiteralsDefault[browserLanguage()];
    }
  }
  get literals() {
    return this._literals || poPageEditLiteralsDefault[browserLanguage()];
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

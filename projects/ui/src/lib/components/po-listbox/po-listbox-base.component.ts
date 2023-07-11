import { Directive, EventEmitter, Input, Output } from '@angular/core';

import { poLocaleDefault } from '../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../services/po-language/po-language.service';
import { InputBoolean } from '../../decorators';
import { PoItemListType } from './enums/po-item-list-type.enum';
import { PoItemListAction } from './po-item-list/interfaces/po-item-list-action.interface';

import { PoItemListOptionGroup } from './po-item-list/interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './po-item-list/interfaces/po-item-list-option.interface';
import { PoListBoxLiterals } from './interfaces/po-listbox-literals.interface';

export const poListBoxLiteralsDefault = {
  en: <PoListBoxLiterals>{
    noItems: 'No items found'
  },
  es: <PoListBoxLiterals>{
    noItems: 'No se encontraron artículos'
  },
  pt: <PoListBoxLiterals>{
    noItems: 'Nenhum item encontrado'
  },
  ru: <PoListBoxLiterals>{
    noItems: 'ничего не найдено'
  }
};

/**
 * @description
 * O componente `po-listbox` é uma caixa suspensa que aparece sobre a interface após ser acionado por um gatilho visível em tela, como o dropdown. Ele apoia trazendo agrupamentos de opções. O componente listbox é composto pelo componente [**PO Item List**](/documentation/po-item-list).
 */
@Directive()
export class PoListBoxBaseComponent {
  private _items: Array<PoItemListOption | PoItemListOptionGroup | any> = [];
  private _type!: PoItemListType;
  private _literals: PoListBoxLiterals;
  private language: string = poLocaleDefault;

  @Input('p-visible') @InputBoolean() visible: boolean = false;

  @Input('p-type') set type(value: string) {
    this._type = PoItemListType[value] ?? 'action';
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Input('p-items') set items(items: Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any>) {
    this._items = Array.isArray(items) ? items : [];
  }

  get items(): Array<PoItemListAction | PoItemListOption | PoItemListOptionGroup | any> {
    return this._items;
  }

  @Input('p-literals') set literals(value: PoListBoxLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poListBoxLiteralsDefault[poLocaleDefault],
        ...poListBoxLiteralsDefault[this.language],
        ...value
      };
    } else {
      this._literals = poListBoxLiteralsDefault[this.language];
    }
  }

  get literals() {
    return this._literals || poListBoxLiteralsDefault[this.language];
  }

  // parâmetro que pode ser passado para o popup ao clicar em um item
  @Input('p-param') param?;

  @Output('p-select-item') selectItem = new EventEmitter<PoItemListOption | PoItemListOptionGroup | any>();

  @Output('p-close') closeEvent = new EventEmitter<any>();

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }
}

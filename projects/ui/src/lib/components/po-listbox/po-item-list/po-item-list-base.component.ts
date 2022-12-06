import { Directive, EventEmitter, HostBinding, Input, Output, TemplateRef } from '@angular/core';
import { InputBoolean } from '../../../decorators';
import { PoItemListType } from '../enums/po-item-list-type.enum';
import { PoItemListAction } from './interfaces/po-item-list-action.interface';
import { PoItemListOptionGroup } from './interfaces/po-item-list-option-group.interface';
import { PoItemListOption } from './interfaces/po-item-list-option.interface';

/**
 * @description
 *
 * O componente `po-item-list` é a menor parte da lista de ação que compõem o componente [**PO Listbox**](/documentation/po-listbox).
 */
@Directive()
export class PoItemListBaseComponent {
  private _label: string;
  private _value: string;
  private _type!: PoItemListType;

  /**
   *
   */
  @HostBinding('attr.p-type')
  @Input('p-type')
  set type(value: string) {
    this._type = PoItemListType[value] ?? 'action';
  }

  get type(): PoItemListType {
    return this._type;
  }

  @Input('p-item') item: PoItemListAction | PoItemListOption | PoItemListOptionGroup | any;

  /** Texto de exibição do item. */
  @Input('p-label') label: string;

  /** Valor do item. */
  @Input('p-value') value: string;

  @Input('p-danger') @InputBoolean() danger: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define o estado como desabilitado.
   *
   * @default `false`
   */
  @Input('p-disabled') @InputBoolean() disabled: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define se a ação está selecionada.
   *
   * @default `false`
   */
  @Input('p-selected') @InputBoolean() selected: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Atribui uma linha separadora acima do item.
   *
   * @default `false`
   */
  @Input('p-separator') @InputBoolean() separator: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define um ícone que será exibido ao lado esquerdo do rótulo.
   */
  @Input('p-icon') icon: string | TemplateRef<void>;

  /**
   * @optional
   *
   * @description
   *
   * Ação a ser realizada ao clicar no item do tipo `option`.
   */
  @Output('p-click-item') clickItem = new EventEmitter<PoItemListAction | any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação a ser realizada ao selecionar no item do type `check`.
   */
  @Output('p-select-item') selectItem = new EventEmitter<PoItemListOption | PoItemListOptionGroup | any>();

  constructor() {}
}

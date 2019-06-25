import { EventEmitter, Input, Output } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

import { PoTagIcon } from './enums/po-tag-icon.enum';
import { PoTagItem } from './interfaces/po-tag-item.interface';
import { PoTagOrientation } from './enums/po-tag-orientation.enum';
import { PoTagType } from './enums/po-tag-type.enum';

const poTagOrientationDefault = PoTagOrientation.Vertical;
const poTagTypeDefault = PoTagType.Info;

/**
 * @description
 *
 * Este componente apresenta um valor em um marcador colorido que pode conter ícone e *label*, as cores são definidas conforme o tipo
 * escolhido.
 * Seu uso é indicado para informações que necessitam de destaque em forma de marcação.
 */
export class PoTagBaseComponent {

  private _icon?: boolean;
  private _orientation?: PoTagOrientation = poTagOrientationDefault;
  private _type?: PoTagType = poTagTypeDefault;

  public readonly poTagOrientation = PoTagOrientation;

  /**
   * @optional
   *
   * @description
   *
   * Texto antes da tag.
   */
  @Input('p-label') label?: string;

  /**
   * @optional
   *
   * @description
   *
   * Apresenta um ícone na tag conforme o tipo:
   * - `danger`: <span class="po-icon po-icon-close"></span>
   * - `info`: <span class="po-icon po-icon-info"></span>
   * - `success`: <span class="po-icon po-icon-ok"></span>
   * - `warning`: <span class="po-icon po-icon-warning"></span>
   *
   * @default `false`
   */
  @Input('p-icon') set icon(value: boolean) {
    this._icon = <any>value === '' ? true : convertToBoolean(value);
  }
  get icon(): boolean {
    return this._icon;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o layout de exibição.
   *
   * @default `vertical`
   */
  @Input('p-orientation') set orientation(value: PoTagOrientation) {
    this._orientation = (<any>Object).values(PoTagOrientation).includes(value) ? value : poTagOrientationDefault;
  }
  get orientation(): PoTagOrientation {
    return this._orientation;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo e determina a cor do `po-tag`.
   *
   * Valores válidos:
   *  - `success`: cor verde utilizada para simbolizar sucesso ou êxito.
   *  - `warning`: cor amarela que representa aviso ou advertência.
   *  - `danger`: cor vermelha para erro ou aviso crítico.
   *  - `info`: cor cinza escuro que caracteriza conteúdo informativo.
   *
   * @default `info`
   */
  @Input('p-type') set type(value: PoTagType) {
    this._type = (<any>Object).values(PoTagType).includes(value) ? value : poTagTypeDefault;
  }
  get type(): PoTagType {
    return this._type;
  }

  /** Texto da tag. */
  @Input('p-value') value: string;

  /**
   * @optional
   *
   * @description
   *
   * Ação que será executada quando o usuário clicar sobre o `po-tag`
   * e que receberá como parâmetro um objeto contendo o valor e tipo de tag.
   */
  @Output('p-click') click?: EventEmitter<any> = new EventEmitter<PoTagItem>();

  get iconFromType() {
    switch (this.type) {
      case PoTagType.Danger: return PoTagIcon.Danger;

      case PoTagType.Info: return PoTagIcon.Info;

      case PoTagType.Success: return PoTagIcon.Success;

      case PoTagType.Warning: return PoTagIcon.Warning;
    }
  }

}

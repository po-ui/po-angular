import { Input, Directive } from '@angular/core';

import { PoInfoOrientation } from './po-info-orietation.enum';
import { getDefaultSizeFn, validateSizeFn } from '../../utils/util';
import { PoFieldSize } from '../../enums/po-field-size.enum';

const poInfoOrientationDefault = PoInfoOrientation.Vertical;

@Directive()
export class PoInfoBaseComponent {
  /** Valor do rótulo a ser exibido. */
  @Input('p-label') label: string;

  /**
   * Ao informar uma URL, o conteúdo será exibido na forma de um *link* e ao ser clicado será redirecionado para a URL informada.
   *
   * > Caso informar `http://` será aberto uma nova aba.
   * Caso informar um caminho relativo, exemplo: `/customers`, será aberto na aba atual.
   *
   */
  @Input('p-url') url?: string;

  /** Valor do conteúdo a ser exibido. */
  @Input('p-value') value?: string;

  public readonly poInfoOrientation = PoInfoOrientation;

  private _labelSize: number;
  private _orientation: PoInfoOrientation = poInfoOrientationDefault;
  private _size?: string = undefined;

  /**
   * @optional
   *
   * @description
   *
   * Quantidade de [colunas](/guides/grid-system) usadas para a exibição da `p-label` quando o componente for
   * utilizado na orientação horizontal.
   *
   * Valores válidos:
   *  - `[1 .. 11]`
   *
   * > A propriedade `p-value` recebe o número de colunas restantes, por exemplo, se definido 3 colunas a mesma assume 9 colunas.
   */
  @Input('p-label-size') set labelSize(value: number) {
    if (isNaN(parseInt(<any>value, 10))) {
      this._labelSize = undefined;
    } else {
      value = parseInt(<any>value, 10);

      this._labelSize = value < 1 || value > 11 ? undefined : value;
    }
  }

  get labelSize(): number {
    return this._labelSize;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o layout de exibição.
   *
   * > Quando definido na horizontal, pode-se utilizar a propriedade `p-label-size` para um maior controle das informações exibidas.
   *
   * @default `vertical`
   */
  @Input('p-orientation') set orientation(value: PoInfoOrientation) {
    this._orientation = (<any>Object).values(PoInfoOrientation).includes(value) ? value : poInfoOrientationDefault;
  }

  get orientation(): PoInfoOrientation {
    return this._orientation;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente entre `small` ou `medium`.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSizeFn(value, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSizeFn(PoFieldSize);
  }
}

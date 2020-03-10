import { Input, Directive } from '@angular/core';

import { convertToBoolean, convertToInt } from '../../utils/util';

/**
 * @description
 *
 * O `po-container` é um componente que visa facilitar o agrupamento de conteúdos.
 * Por padrão o mesmo exibe uma borda, um efeito de sombra ao seu redor e um espaçamento em sua parte interna, os quais
 * podem ser desabilitados. Ao remover sua borda a sombra também será removida. Além disso, sua altura acompanha a
 * quantidade do conteúdo, porém pode ser fixada. Para controlar sua largura, utilize o [Grid System](/guides/grid-system),
 * assim possibilitando o tratamento para diferentes resoluções.
 */
@Directive()
export class PoContainerBaseComponent {
  private _height?: number;
  private _noBorder?: boolean = false;
  private _noPadding?: boolean = false;
  private _noShadow?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Define a altura do `po-container`.
   *
   * > Caso não seja definido um valor, a altura se ajustará de acordo com o conteúdo.
   */
  @Input('p-height') set height(value: number) {
    this._height = convertToInt(value);
  }

  get height(): number {
    return this._height;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita a borda e a sombra em torno do `po-container`.
   *
   * @default `false`
   */
  @Input('p-no-border') set noBorder(value: boolean) {
    this._noBorder = convertToBoolean(value);
  }

  get noBorder(): boolean {
    return this._noBorder;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o espaçamento interno do `po-container`.
   *
   * @default `false`
   */
  @Input('p-no-padding') set noPadding(value: boolean) {
    this._noPadding = convertToBoolean(value);
  }

  get noPadding(): boolean {
    return this._noPadding;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o sombreamento em torno do `po-container`.
   *
   * @default `false`
   */
  @Input('p-no-shadow') set noShadow(value: boolean) {
    this._noShadow = convertToBoolean(value);
  }

  get noShadow(): boolean {
    return this._noShadow;
  }
}

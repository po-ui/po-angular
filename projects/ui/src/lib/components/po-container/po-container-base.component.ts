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
 *
 * #### Propriedades customizáveis
 *
 * | Propriedade                                         | Descrição                                                        | Valor Padrão                                     |
 * |-----------------------------------------------------|------------------------------------------------------------------|--------------------------------------------------|                                                                                                   | ---
 * | **Default Values**                                  |                                                                  |                                                  |
 * | --padding &nbsp;                                    | Preenchimento                                                    | 1rem                                             |
 * | --border-radius &nbsp;                              | Arredondamento da borda &nbsp;                                   | var(--border-radius-md)                          |
 * | --border-color &nbsp;                               | Cor da borda                                                     | var(--color-neutral-light-20)                    |
 * | --background &nbsp;                                 | Cor de background                                                | var(--color-neutral-light-00)                    |
 * | --border-width &nbsp;                               | Espessura do border                                              | var(--border-width-sm)                           |
 */
@Directive()
export class PoContainerBaseComponent {
  private _height?: number;
  private _noBorder?: boolean = false;
  private _noPadding?: boolean = false;

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
}

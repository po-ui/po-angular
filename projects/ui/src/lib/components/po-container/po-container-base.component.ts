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
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (css)
 *
 *
 * | Propriedade                                    | Descrição                                              | Valor Padrão                                     |
 * |------------------------------------------------|--------------------------------------------------------|--------------------------------------------------|
 * | **Default Values**                             |                                                        |                                                  |
 * | `--padding` &nbsp;                             | Preenchimento                                          | `1rem`                                           |
 * | `--border-radius` &nbsp;                       | Contém o valor do raio dos cantos do elemento&nbsp;    | `var(--border-radius-md)`                        |
 * | `--border-width` &nbsp;                        | Contém o valor da largura dos cantos do elemento&nbsp; | `var(--border-width-sm)`                         |
 * | `--border-color` &nbsp;                        | Cor da borda                                           | `var(--color-neutral-light-20)`                  |
 * | `--background` &nbsp;                          | Cor de background                                      | `var(--color-neutral-light-00)`                  |
 *
 * > Para customização dos tokens do componenete, verifique o guia [Customização de cores do tema padrão](https://po-ui.io/guides/colors-customization).
 *
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

  /**
   * @deprecated 16.x.x
   *
   * @optional
   *
   * @description
   *
   * **Deprecated 16.x.x**.
   *
   * Desabilita o sombreamento em torno do `po-container`. Não é mais possível definir shadow para o `po-container` por questões de acessibilidade e usabilidade, por isso não indicamos mais o uso desta propriedade.
   *
   * @default `false`
   */
  @Input('p-no-shadow') noShadow: boolean = false;
}

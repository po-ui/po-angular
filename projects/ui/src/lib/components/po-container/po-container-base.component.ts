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
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                                    | Descrição                                              | Valor Padrão                                     |
 * |------------------------------------------------|--------------------------------------------------------|--------------------------------------------------|
 * | **Default Values - CONTENT **                  |                                                        |                                                  |
 * | `--padding` &nbsp;                             | Preenchimento                                          | `var(--spacing-sm)`                              |
 * | `--border-radius` &nbsp;                       | Contém o valor do raio dos cantos do elemento&nbsp;    | `var(--border-radius-md)`                        |
 * | `--border-width` &nbsp;                        | Contém o valor da largura dos cantos do elemento&nbsp; | `var(--border-width-sm)`                         |
 * | `--border-color` &nbsp;                        | Cor da borda                                           | `var(--color-neutral-light-20)`                  |
 * | `--background` &nbsp;                          | Cor de background                                      | `var(--color-neutral-light-00)`                  |
 * | **Default Values - TITLE **                    |                                                        |                                                  |
 * | `--font-family` &nbsp;                         | Font aplicado ao titulo                                | `var(--font-family-theme)`                       |
 * | `--line-weight` &nbsp;                         | Espessura da Fonte a ser aplicada do titulo            | `var(--font-weight-semibold)`                    |
 * | `--line-height` &nbsp;                         | tamanho da linha do titulo                             | `var(--line-height-md)`                          |
 * | `--text-color` &nbsp;                          | Cor do Texto do titulo                                 | `var(--color-neutral-dark-90)`                   |
 * | `--font-size` &nbsp;                           | Tamanho da fonte do titulo                             | `1.125rem`                                       |
 * | `--letter-spacing` &nbsp;                      | distancia entre letras do titulo                       | `0.017rem`                                       |
 * | `--margin` &nbsp;                              | Margin entre o titulo e o conteudo                     | `0 0 var(--spacing-xs)`                          |
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
   * @optional
   *
   * @description
   *
   * Título do Container.
   */
  @Input('p-title') title: string;
}

import { Input, Directive } from '@angular/core';

import { convertToBoolean } from '../../utils/util';

/**
 * @description
 *
 * O componente `po-tabs` é responsável por agrupar [abas](/documentation/po-tab) dispostas numa linha horizontal,
 * ideal para facilitar a organização de conteúdos.
 *
 * O componente exibirá as abas enquanto houver espaço na tela, caso a aba ultrapasse o limite da tela a mesma será agrupada em um dropdown.
 *
 * > As abas que estiverem agrupadas serão dispostas numa cascata suspensa que será exibida ao clicar no botão.
 *
 * É possível realizar a navegação entre as abas através da tecla SETAS(direita e esquerda) do teclado.
 * Caso uma aba estiver desabilitada, não receberá foco de navegação.
 *
 * #### Boas práticas
 *
 * - Evite utilizar um `po-tabs` dentro de outro `po-tabs`;
 * - Evite utilizar uma quantidade excessiva de abas, pois irá gerar um *scroll* muito longo no `dropdown`;
 * - Evite `labels` extensos para as `tabs` pois podem quebrar seu *layout*, use `labels` diretas, curtas e intuitivas.
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                      |
 * |----------------------------------------|-------------------------------------------------------|---------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                   |
 * | `--background`                         | Cor de background                                     | `var(--color-neutral-light-00)`                   |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                         |
 * | `--color-baseline`                     | Cor para box-shadow                                   | `var(--color-neutral-light-20)`                   |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                        |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                        |
 * | `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-bold)`                         |
 * | **Disabled**                           |                                                       |                                                   |
 * | `--color-disabled`                     | Cor da fonte no estado disabilitado                   | `var(--color-action-disabled)`                    |
 * | `--background-item-disabled`&nbsp;     | Cor de background do item desabilitado                | `var(--color-neutral-light-10)`                   |
 * | **Focused**                            |                                                       |                                                   |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                     | `var(--color-action-focus)`                       |
 * | **Hover**                              |                                                       |                                                   |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-darkest)`                   |
 * | `--background-item-hover`              | Cor de background no estado de hover                  | `var(--color-brand-01-lightest)`                  |
 * | **Selected**                           |                                                       |                                                   |
 * | `--background-item-selected`           | Cor de background do ítem selecionado                 | `var(--color-neutral-light-10)`                   |
 *
 */
@Directive()
export class PoTabsBaseComponent {
  private _small?: boolean = false;

  /**
   * @deprecated 17.x.x
   *
   * @optinal
   *
   * @description
   *
   * Diminui o tamanho das abas.
   *
   * @default `false`
   */
  @Input('p-small') set small(value: boolean) {
    this._small = convertToBoolean(value);
  }

  get small(): boolean {
    return this._small;
  }
}

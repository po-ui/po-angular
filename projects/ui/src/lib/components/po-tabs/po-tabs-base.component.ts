import { Directive, Input } from '@angular/core';
import { PoFieldSize } from '../../enums/po-field-size.enum';
import { PoThemeService } from '../../services/po-theme/po-theme.service';
import { getDefaultSize, validateSize } from '../../utils/util';

/**
 * @description
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                                                       | Valor Padrão                                      |
 * |----------------------------------------|---------------------------------------------------------------------------------|---------------------------------------------------|
 * | **Default Values**                     |                                                                                 |                                                   |
 * | `--background`                         | Cor de background                                                               | `var(--color-transparent)`                        |
 * | `--background-item-default`            | Cor de background do item padrão                                                | `var(--color-transparent)`                        |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;                             | `var(--border-radius-md)`                         |
 * | `--color`                              | Cor da fonte padrão                                                             | `var(--color-action-default)`                     |
 * | `--color-baseline`                     | Cor para box-shadow                                                             | `var(--color-neutral-light-20)`                   |
 * | `--font-family`                        | Família tipográfica usada                                                       | `var(--font-family-theme)`                        |
 * | `--font-size`                          | Tamanho da fonte                                                                | `var(--font-size-default)`                        |
 * | `--font-weight`                        | Peso da fonte                                                                   | `var(--font-weight-bold)`                         |
 * | `--margin-tabs-container-left`         | Margem lateral esquerda do componente quando usado dentro de um `page-default`  | `var(--spacing-md)`                               |
 * | `--margin-tabs-container-right`        | Margem lateral direita do componente quando usado dentro de um `page-default`   | `-16px`                                           |
 * | `--padding-tabs-header`                | Padding do valor lateral das abas                                               | `var(--spacing-sm)`                               |
 * | `--margin-tabs-first-child`            | Margem lateral da primeira aba                                                  | `var(--spacing-md)`                               |
 * | `--margin-tabs-last-child`             | Margem lateral da ultima aba                                                    | `var(--spacing-md)`                               |
 * | **Disabled**                           |                                                                                 |                                                   |
 * | `--color-disabled`                     | Cor da fonte no estado disabilitado                                             | `var(--color-action-disabled)`                    |
 * | `--background-item-disabled`&nbsp;     | Cor de background do item desabilitado                                          | `var(--color-neutral-light-10)`                   |
 * | **Focused**                            |                                                                                 |                                                   |
 * | `--outline-color-focused`              | Cor do outline do estado de focus                                               | `var(--color-action-focus)`                       |
 * | **Hover**                              |                                                                                 |                                                   |
 * | `--color-hover`                        | Cor principal no estado hover                                                   | `var(--color-brand-01-darkest)`                   |
 * | `--background-item-hover`              | Cor de background no estado de hover                                            | `var(--color-brand-01-lightest)`                  |
 * | **Selected**                           |                                                                                 |                                                   |
 * | `--background-item-selected`           | Cor de background do item selecionado                                           | `var(--color-brand-01-lightest)`                  |
 *
 * <br>
 */
@Directive()
export class PoTabsBaseComponent {
  private _size?: string = undefined;

  /**
   * @optional
   *
   * @description
   *
   * Define o tamanho do componente:
   * - `small`: altura dos tabs como 32px (disponível apenas para acessibilidade AA).
   * - `medium`: altura dos tabs como 44px.
   *
   * > Caso a acessibilidade AA não esteja configurada, o tamanho `medium` será mantido.
   * Para mais detalhes, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = validateSize(value, this.poThemeService, PoFieldSize);
  }

  get size(): string {
    return this._size ?? getDefaultSize(this.poThemeService, PoFieldSize);
  }

  constructor(protected poThemeService: PoThemeService) {}
}

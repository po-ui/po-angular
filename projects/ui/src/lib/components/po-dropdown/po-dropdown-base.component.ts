import { Input, Directive, OnInit } from '@angular/core';

import { convertToBoolean } from './../../utils/util';

import { PoDropdownAction } from './po-dropdown-action.interface';
import { PoDropdownSize } from './enums/po-drodown-size.enum';
import { PoThemeService } from '../../services';

/**
 * @description
 *
 * O componente `po-dropdown` pode ser utilizado como um agrupador de ações e / ou opções.
 *
 * > Caso não haja configuração de rotas em sua aplicação, se faz necessário importar o `RouterModule`
 * no módulo principal para o correto funcionamento deste componente:
 *
 * ```
 * import { RouterModule } from '@angular/router';
 *
 * @NgModule({
 *   imports: [
 *     ...
 *     RouterModule.forRoot([]),
 *     PoModule
 *   ],
 *   declarations: [
 *     AppComponent
 *   ],
 *   exports: [],
 *   providers: [],
 *   bootstrap: [
 *     AppComponent
 *   ]
 * })
 * export class AppModule { }
 * ```
 * > Para maiores dúvidas referente à configuração de rotas, acesse em nosso portal /Guias /Começando
 * [/Configurando as rotas do po-menu](/guides/getting-started).
 *
 * #### Tokens customizáveis
 *
 * É possível alterar o estilo do componente usando os seguintes tokens (CSS):
 *
 * > Para maiores informações, acesse o guia [Personalizando o Tema Padrão com Tokens CSS](https://po-ui.io/guides/theme-customization).
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                     |
 * |----------------------------------------|-------------------------------------------------------|--------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                  |
 * | `--font-family`                        | Família tipográfica usada                             | `var(--font-family-theme)`                       |
 * | `--font-size`                          | Tamanho da fonte                                      | `var(--font-size-default)`                       |
 * | `--font-weight`                        | Peso da fonte                                         | `var(--font-weight-bold)`                        |
 * | `--line-height`                        | Tamanho da label                                      | `var(--line-height-none)`                        |
 * | `--color`                              | Cor principal do dropdown                             | `var(--color-action-default)`                    |
 * | `--border-radius`                      | Contém o valor do raio dos cantos do elemento&nbsp;   | `var(--border-radius-md)`                        |
 * | `--border-width`                       | Contém o valor da largura dos cantos do elemento&nbsp;| `var(--border-width-md)`                         |
 * | `--padding`                            | Preenchimento horizontal                              | `0 1em`                                          |
 * | **Hover**                              |                                                       |                                                  |
 * | `--color-hover`                        | Cor principal no estado hover                         | `var(--color-brand-01-darkest)`                  |
 * | `--background-hover`                   | Cor de background no estado hover                     | `var(--color-brand-01-lighter)`                  |
 * | **Focused**                            |                                                       |                                                  |
 * | `--outline-color-focused` &nbsp;       | Cor do outline do estado de focus                     | `var(--color-action-focus)`                      |
 * | **Pressed**                            |                                                       |                                                  |
 * | `--background-pressed` &nbsp;          | Cor de background no estado de pressionado&nbsp;      | `var(--color-brand-01-light)`                    |
 * | **Disabled**                           |                                                       |                                                  |
 * | `--color-disabled`                     | Cor principal no estado disabled                      | `var(--color-action-disabled)`                   |
 *
 */

@Directive()
export class PoDropdownBaseComponent {
  /** Adiciona um rótulo ao `dropdown`. */
  @Input('p-label') label: string;

  icon: string = 'ICON_ARROW_DOWN';
  open: boolean = false;

  private _actions: Array<PoDropdownAction>;
  private _disabled: boolean = false;
  private _size?: string = undefined;

  /** Lista de ações que serão exibidas no componente. */
  @Input('p-actions') set actions(value: Array<PoDropdownAction>) {
    this._actions = Array.isArray(value) ? value : [];
  }

  get actions() {
    return this._actions;
  }

  /**
   * @optional
   *
   * @description
   *
   * Desabilita o campo.
   *
   * @default `false`
   */
  @Input('p-disabled') set disabled(value: boolean) {
    this._disabled = convertToBoolean(value);
  }

  get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @optional
   *
   * @description
   *
   * Permite definir o tamanho do componente.
   *
   * Valores válidos no enum `PoDropdownSize`:
   * - small
   * - medium
   *
   * > A medida `small` **só estará disponível** quando a acessibilidade AA estiver configurada. Caso contrário, mesmo
   * que o tamanho seja definido como `small`, a medida padrão `medium` será mantida. Para mais informações sobre como
   * configurar a acessibilidade AA, consulte a documentação do [po-theme](https://po-ui.io/documentation/po-theme).
   *
   * @default `medium`
   */
  @Input('p-size') set size(value: string) {
    this._size = this.validateSize(value);
  }

  get size(): string {
    return this._size ?? this.getDefaultSize();
  }

  constructor(protected poThemeService: PoThemeService) {}

  private getDefaultSize(): string {
    return this.poThemeService.getA11yDefaultSize() === 'small' ? PoDropdownSize.small : PoDropdownSize.medium;
  }

  private validateSize(value: string): string {
    if (value && Object.values(PoDropdownSize).includes(value as PoDropdownSize)) {
      if (value === PoDropdownSize.small && this.poThemeService.getA11yLevel() !== 'AA') {
        return PoDropdownSize.medium;
      }
      return value;
    }
    return this.poThemeService.getA11yDefaultSize() === 'small' ? PoDropdownSize.small : PoDropdownSize.medium;
  }
}

import { Input, Directive } from '@angular/core';

import { convertToBoolean } from './../../utils/util';

import { PoDropdownAction } from './po-dropdown-action.interface';

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
 * #### Propriedades customizáveis
 *
 * | Propriedade                            | Descrição                                             | Valor Padrão                                    |
 * |----------------------------------------|-------------------------------------------------------|-------------------------------------------------|
 * | **Default Values**                     |                                                       |                                                 |
 * | --font-family                          | Família tipográfica usada                             | var(--font-family-theme)                        |
 * | --font-size                            | Tamanho da fonte                                      | var(--font-size-default)                        |
 * | --font-weight                          | Peso da fonte                                         | var(--font-weight-bold)                         |
 * | --line-height                          | Tamanho da label                                      | var(--line-height-none)                         |
 * | --color                                | Cor do dropdown                                       | var(--color-action-default)                     |
 * | --border-radius                        | Arredondamento da borda                               | var(--border-radius-md)                         |
 * | --border-width                         | Espessura do border                                   | var(--border-width-md)                          |
 * | --padding                              | Preenchimento                                         | 0 1em                                           |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Hover**                              |                                                       |                                                 |
 * | --color-hover                          | Cor de hover                                          | var((--color-brand-01-darkest)                  |
 * | --background-hover                     | Cor de background de hover                            | var(--color-brand-01-lighter)                   |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Focused**                            |                                                       |                                                 |
 * | --outline-color-focused &nbsp;         | Cor do outline do focus                               | var(--color-action-focus)                       |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Pressed**                            |                                                       |                                                 |
 * | --background-pressed &nbsp;            | Cor de background quando pressionado &nbsp; &nbsp;    | var(--color-brand-01-light)                     |
 * | ---                                    | ---                                                   | ---                                             |
 * | **Disabled**                           |                                                       |                                                 |
 * | --color-disabled                       | Cor no estado disabled                                | var(--color-action-disabled)                    |
 */

@Directive()
export class PoDropdownBaseComponent {
  /** Adiciona um rótulo ao `dropdown`. */
  @Input('p-label') label: string;

  icon: string = 'po-icon-arrow-down';
  open: boolean = false;

  private _actions: Array<PoDropdownAction>;
  private _disabled: boolean = false;

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
}

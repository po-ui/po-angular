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
 */

@Directive()
export class PoDropdownBaseComponent {
  private _actions: Array<PoDropdownAction>;
  private _disabled: boolean = false;

  icon: string = 'po-icon-arrow-down';
  open: boolean = false;

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

  /** Adiciona um rótulo ao `dropdown`. */
  @Input('p-label') label: string;
}

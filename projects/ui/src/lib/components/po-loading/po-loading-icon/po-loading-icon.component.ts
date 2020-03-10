import { Component, Input } from '@angular/core';

import { convertToBoolean } from '../../../utils/util';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que exibe um ícone de carregamento de conteúdo. A cor padrão para ele é a primária conforme o tema utilizado.
 * É possível alterá-la para um tom cinza conforme a necessidade.
 */
@Component({
  selector: 'po-loading-icon',
  templateUrl: 'po-loading-icon.component.html'
})
export class PoLoadingIconComponent {
  private _neutralColor: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Definição para cor neutra (cinza) para o ícone de carregamento.
   *
   * @default `false`
   */
  @Input('p-neutral-color') set neutralColor(value: boolean) {
    this._neutralColor = convertToBoolean(value);
  }

  get neutralColor(): boolean {
    return this._neutralColor;
  }
}

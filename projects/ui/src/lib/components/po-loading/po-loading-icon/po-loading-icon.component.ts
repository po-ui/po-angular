import { Component, Input } from '@angular/core';

import { convertToBoolean, uuid } from '../../../utils/util';
import { PoLoadingIconSize } from './po-loading-icon-size-enum';

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
  private _size: string = 'md';
  id = uuid();

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

  /**
   * @optional
   *
   * @description
   *
   * Definição do tamanho do ícone.
   *
   * Valores válidos:
   *  - `xs`: tamanho `extra small`
   *  - `sm`: tamanho `small`
   *  - `md`: tamanho `medium`
   *  - `lg`: tamanho `large`
   *
   * @default `md`
   */
  @Input('p-size') set size(value: string) {
    this._size = PoLoadingIconSize[value] ? PoLoadingIconSize[value] : PoLoadingIconSize.md;
  }

  get size(): string {
    return this._size;
  }
}

import { Directive, Input } from '@angular/core';
import { convertToBoolean } from './../../utils/util';

@Directive()
export class PoOverlayBaseComponent {
  /**
   * @optional
   *
   * @description
   *
   * Define se o *overlay* será aplicado a um *container* ou a página inteira.
   *
   * Para utilizar o componente como um *container*, o elemento pai deverá receber uma posição relativa, por exemplo:
   *
   * ```
   * <div style="position: relative">
   *
   *  <po-chart [p-series]="[{ value: 10, category: 'Example' }]">
   *  </po-chart>
   *
   *  <po-overlay>
   *  </po-overlay>
   * </div>
   * ```
   *
   * @default `false`
   */
  @Input({ alias: 'p-screen-lock', transform: convertToBoolean }) screenLock: boolean = false;
}

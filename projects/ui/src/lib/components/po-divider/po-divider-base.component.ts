import { Input, Directive } from '@angular/core';

/**
 * @description
 *
 * Este componente apresenta uma linha demarcadora de blocos e pode conter um *label*. Seu uso é indicado para definição
 * e organização de informações em uma tela e sua característica é semelhante à tag `<hr>`.
 */
@Directive()
export class PoDividerBaseComponent {
  /** Valor do rótulo a ser exibido. */
  @Input('p-label') label?: string;
}

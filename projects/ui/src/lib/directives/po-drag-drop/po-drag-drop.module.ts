import { NgModule } from '@angular/core';

import { PoDragDirective } from './po-drag.directive';
import { PoDropListDirective } from './po-drop-list.directive';

/**
 * @description
 *
 * Módulo que exporta as diretivas de drag & drop do PO UI:
 * - `PoDropListDirective` (`p-drop-list`) — define um container de drop.
 * - `PoDragDirective` (`p-drag`) — torna um elemento arrastável.
 */
@NgModule({
  imports: [PoDragDirective, PoDropListDirective],
  exports: [PoDragDirective, PoDropListDirective]
})
export class PoDragDropModule {}

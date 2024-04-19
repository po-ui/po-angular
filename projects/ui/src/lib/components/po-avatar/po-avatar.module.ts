import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoIconModule } from '../po-icon';
import { PoAvatarComponent } from './po-avatar.component';

/**
 * @description
 *
 * Módulo do componente po-avatar.
 */
@NgModule({
  imports: [CommonModule, PoIconModule],
  declarations: [PoAvatarComponent],
  exports: [PoAvatarComponent]
})
export class PoAvatarModule {}

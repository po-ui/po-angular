import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoAvatarComponent } from './po-avatar.component';

/**
 * @description
 *
 * Módulo do componente po-avatar.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoAvatarComponent],
  exports: [PoAvatarComponent]
})
export class PoAvatarModule {}

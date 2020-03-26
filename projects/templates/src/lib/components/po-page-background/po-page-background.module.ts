import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoDividerModule, PoFieldModule } from '@po-ui/ng-components';

import { PoPageBackgroundComponent } from './po-page-background.component';

/**
 * @description
 *
 * Módulo do template do po-page-background.
 */
@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, PoDividerModule, PoFieldModule],
  declarations: [PoPageBackgroundComponent],
  exports: [PoPageBackgroundComponent]
})
export class PoPageBackgroundModule {}

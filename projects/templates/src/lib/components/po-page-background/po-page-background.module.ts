import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PoDividerModule, PoFieldModule, PoLogoModule } from '@po-ui/ng-components';

import { PoPageBackgroundComponent } from './po-page-background.component';

/**
 * @description
 *
 * Módulo do template do po-page-background.
 */
@NgModule({
  imports: [CommonModule, FormsModule, RouterModule, PoDividerModule, PoFieldModule, PoLogoModule],
  declarations: [PoPageBackgroundComponent],
  exports: [PoPageBackgroundComponent]
})
export class PoPageBackgroundModule {}

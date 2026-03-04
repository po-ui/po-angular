import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';

import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoListBoxModule } from '../../po-listbox/po-listbox.module';
import { PoHelperModule } from '../../po-helper';
import { PoIconModule } from '../../po-icon/po-icon.module';
import { PoCleanModule } from '../po-clean/po-clean.module';
import { PoLoadingModule } from '../../po-loading/po-loading.module';

import { PoComboComponent } from './po-combo.component';
import { PoComboOptionTemplateDirective } from './po-combo-option-template/po-combo-option-template.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PoFieldContainerModule,
    PoListBoxModule,
    PoHelperModule,
    PoIconModule,
    PoCleanModule,
    PoLoadingModule
  ],
  declarations: [PoComboComponent, PoComboOptionTemplateDirective],
  exports: [PoComboComponent, PoComboOptionTemplateDirective]
})
export class PoComboModule {}

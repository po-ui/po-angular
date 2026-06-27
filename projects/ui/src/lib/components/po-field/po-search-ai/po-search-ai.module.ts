import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { PoButtonModule } from '../../po-button/po-button.module';
import { PoCleanModule } from '../po-clean/po-clean.module';
import { PoFieldContainerModule } from '../po-field-container/po-field-container.module';
import { PoHelperModule } from '../../po-helper';
import { PoIconModule } from '../../po-icon/po-icon.module';
import { PoLoadingModule } from '../../po-loading/po-loading.module';

import { PoSearchAiComponent } from './po-search-ai.component';

/**
 * @description
 * Módulo do componente `po-search-ai`.
 *
 * Pode ser importado de forma independente por qualquer módulo que precise renderizar
 * o campo de busca por IA.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PoButtonModule,
    PoCleanModule,
    PoFieldContainerModule,
    PoHelperModule,
    PoIconModule,
    PoLoadingModule
  ],
  declarations: [PoSearchAiComponent],
  exports: [PoSearchAiComponent]
})
export class PoSearchAiModule {}

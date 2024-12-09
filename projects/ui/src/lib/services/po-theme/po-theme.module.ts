import { NgModule } from '@angular/core';
import { PoThemeService } from './po-theme.service';

/**
 * Módulo responsável por fornecer serviços relacionados ao tema PO.
 */
@NgModule({
  providers: [PoThemeService],
  bootstrap: []
})
export class PoThemeModule {}

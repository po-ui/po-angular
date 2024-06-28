import { NgModule } from '@angular/core';
import { PoThemeService } from './po-theme.service';

/**
 * Módulo responsável por fornecer serviços relacionados ao tema PO.
 */
@NgModule({
  providers: [
    PoThemeService,
    // Fornecer o objeto 'Window' para uso no serviço
    { provide: 'Window', useValue: window }
  ],
  bootstrap: []
})
export class PoThemeModule {}

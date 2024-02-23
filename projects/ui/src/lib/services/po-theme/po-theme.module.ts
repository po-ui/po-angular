import { NgModule } from '@angular/core';
import { PoThemeService } from './po-theme.service';

/**
 * @description
 * Modulo para o serviço po-theme
 */
@NgModule({
  providers: [PoThemeService, { provide: 'Window', useValue: window }],
  bootstrap: []
})
export class PoThemeModule {}

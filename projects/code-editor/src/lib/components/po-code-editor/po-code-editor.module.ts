import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoCodeEditorComponent } from './po-code-editor.component';
import { PoCodeEditorRegister } from './po-code-editor-register.service';
import { PoCodeEditorRegisterable } from './interfaces/po-code-editor-registerable.interface';

/**
 * @description
 *
 * Módulo do componente po-code-editor.
 */
@NgModule({
  imports: [CommonModule],
  declarations: [PoCodeEditorComponent],
  exports: [PoCodeEditorComponent],
  providers: [PoCodeEditorRegister]
})
export class PoCodeEditorModule {
  static forRegister(props: PoCodeEditorRegisterable): ModuleWithProviders<PoCodeEditorModule> {
    return {
      ngModule: PoCodeEditorModule,
      providers: [
        {
          provide: PoCodeEditorRegister,
          useValue: props
        }
      ]
    };
  }
}

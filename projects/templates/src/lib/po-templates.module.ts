import { NgModule } from '@angular/core';

import { PoComponentsModule } from './components/components.module';

@NgModule({
  imports: [
    PoComponentsModule
  ],
  exports: [
    PoComponentsModule
  ]
})
export class PoTemplatesModule { }

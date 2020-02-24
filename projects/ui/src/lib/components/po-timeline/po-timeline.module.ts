import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoTimelineComponent } from './po-timeline.component';

const COMPONENTS = [
    PoTimelineComponent
]

/**
 * @description
 *
 * Módulo do componente po-timeline
 *
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ],
  providers: [],
  schemas: []
})
export class PoTimelineModule { }

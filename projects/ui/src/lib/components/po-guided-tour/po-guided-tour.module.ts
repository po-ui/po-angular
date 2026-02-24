import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoGuidedTourComponent } from './po-guided-tour.component';
import { PoPopoverModule } from '../po-popover/po-popover.module';

@NgModule({
  imports: [
    CommonModule,
    PoPopoverModule
  ],
  declarations: [
    PoGuidedTourComponent
  ],
  exports: [
    PoGuidedTourComponent
  ]
})
export class PoGuidedTourModule { }

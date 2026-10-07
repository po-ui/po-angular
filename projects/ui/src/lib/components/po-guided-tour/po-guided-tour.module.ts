import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoGuidedTourComponent } from './po-guided-tour.component';

@NgModule({
  imports: [
        CommonModule
  ],
  declarations: [
    PoGuidedTourComponent
  ],
  exports: [
    PoGuidedTourComponent
  ]
})
export class PoGuidedTourModule { }

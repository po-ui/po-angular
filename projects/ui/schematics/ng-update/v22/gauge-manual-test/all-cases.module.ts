import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoGaugeModule } from '@po-ui/ng-components';

import { AllGaugeCasesComponent } from './all-cases.component';

@NgModule({
  declarations: [AllGaugeCasesComponent],
  imports: [CommonModule, PoGaugeModule],
  exports: [AllGaugeCasesComponent]
})
export class AllGaugeCasesModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PoStepComponent } from './po-step/po-step.component';
import { PoStepperCircleComponent } from './po-stepper-circle/po-stepper-circle.component';
import { PoStepperComponent } from './po-stepper.component';
import { PoStepperLabelComponent } from './po-stepper-label/po-stepper-label.component';
import { PoStepperStepComponent } from './po-stepper-step/po-stepper-step.component';

/**
 * @description
 * Módulo do componente po-stepper
 */
@NgModule({
  imports: [CommonModule],
  declarations: [
    PoStepComponent,
    PoStepperCircleComponent,
    PoStepperComponent,
    PoStepperLabelComponent,
    PoStepperStepComponent
  ],
  exports: [PoStepComponent, PoStepperComponent]
})
export class PoStepperModule {}

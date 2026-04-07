import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PoModule } from '../../../../ui/src/public-api';

import { Code12541Component } from './code-12541.component';
import { ScenarioHeaderTypesComponent } from './scenarios/header-types/header-types.component';
import { ScenarioLayoutPrimaryComponent } from './scenarios/layout-primary/layout-primary.component';
import { ScenarioLayoutSecondaryComponent } from './scenarios/layout-secondary/layout-secondary.component';
import { ScenarioLayoutTertiaryComponent } from './scenarios/layout-tertiary/layout-tertiary.component';
import { ScenarioActionsCountComponent } from './scenarios/actions-count/actions-count.component';
import { ScenarioActionsKindComponent } from './scenarios/actions-kind/actions-kind.component';
import { ScenarioActionsStatesComponent } from './scenarios/actions-states/actions-states.component';
import { ScenarioPropertiesComponent } from './scenarios/properties/properties.component';
import { ScenarioEdgeCasesComponent } from './scenarios/edge-cases/edge-cases.component';
import { ScenarioBackButtonComponent } from './scenarios/back-button/back-button.component';

@NgModule({
  declarations: [
    Code12541Component,
    ScenarioHeaderTypesComponent,
    ScenarioLayoutPrimaryComponent,
    ScenarioLayoutSecondaryComponent,
    ScenarioLayoutTertiaryComponent,
    ScenarioActionsCountComponent,
    ScenarioActionsKindComponent,
    ScenarioActionsStatesComponent,
    ScenarioPropertiesComponent,
    ScenarioEdgeCasesComponent,
    ScenarioBackButtonComponent
  ],
  imports: [CommonModule, PoModule],
  exports: [Code12541Component]
})
export class Code12541Module {}

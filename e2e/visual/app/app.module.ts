import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { AppComponent } from './app.component';

// Sample components - Buttons & Controls
import { SamplePoButtonBasicComponent } from '../../../projects/ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component';
import { SamplePoButtonGroupBasicComponent } from '../../../projects/ui/src/lib/components/po-button-group/samples/sample-po-button-group-basic/sample-po-button-group-basic.component';

// Sample components - Form Fields
import { SamplePoInputBasicComponent } from '../../../projects/ui/src/lib/components/po-field/po-input/samples/sample-po-input-basic/sample-po-input-basic.component';
import { SamplePoCheckboxBasicComponent } from '../../../projects/ui/src/lib/components/po-field/po-checkbox/samples/sample-po-checkbox-basic/sample-po-checkbox-basic.component';
import { SamplePoSwitchBasicComponent } from '../../../projects/ui/src/lib/components/po-field/po-switch/samples/sample-po-switch-basic/sample-po-switch-basic.component';
import { SamplePoSelectBasicComponent } from '../../../projects/ui/src/lib/components/po-field/po-select/samples/sample-po-select-basic/sample-po-select-basic.component';

// Sample components - Data Display
import { SamplePoTableBasicComponent } from '../../../projects/ui/src/lib/components/po-table/samples/sample-po-table-basic/sample-po-table-basic.component';
import { SamplePoTagBasicComponent } from '../../../projects/ui/src/lib/components/po-tag/samples/sample-po-tag-basic/sample-po-tag-basic.component';

// Sample components - Layout & Navigation
import { SamplePoAccordionBasicComponent } from '../../../projects/ui/src/lib/components/po-accordion/samples/sample-po-accordion-basic/sample-po-accordion-basic.component';
import { SamplePoDividerBasicComponent } from '../../../projects/ui/src/lib/components/po-divider/samples/sample-po-divider-basic/sample-po-divider-basic.component';
import { SamplePoProgressBasicComponent } from '../../../projects/ui/src/lib/components/po-progress/samples/sample-po-progress-basic/sample-po-progress-basic.component';

// Visual test - po-input states (co-located in e2e/visual/po-input/)
import { VisualTestPoInputStatesComponent } from '../po-input/po-input-states.component';

const visualRoutes: Routes = [
  { path: 'visual/po-button-basic', component: SamplePoButtonBasicComponent },
  { path: 'visual/po-button-group-basic', component: SamplePoButtonGroupBasicComponent },
  { path: 'visual/po-input-basic', component: SamplePoInputBasicComponent },
  { path: 'visual/po-checkbox-basic', component: SamplePoCheckboxBasicComponent },
  { path: 'visual/po-switch-basic', component: SamplePoSwitchBasicComponent },
  { path: 'visual/po-select-basic', component: SamplePoSelectBasicComponent },
  { path: 'visual/po-table-basic', component: SamplePoTableBasicComponent },
  { path: 'visual/po-tag-basic', component: SamplePoTagBasicComponent },
  { path: 'visual/po-accordion-basic', component: SamplePoAccordionBasicComponent },
  { path: 'visual/po-divider-basic', component: SamplePoDividerBasicComponent },
  { path: 'visual/po-progress-basic', component: SamplePoProgressBasicComponent },
  { path: 'visual/po-input-states', component: VisualTestPoInputStatesComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SamplePoButtonBasicComponent,
    SamplePoButtonGroupBasicComponent,
    SamplePoInputBasicComponent,
    SamplePoCheckboxBasicComponent,
    SamplePoSwitchBasicComponent,
    SamplePoSelectBasicComponent,
    SamplePoTableBasicComponent,
    SamplePoTagBasicComponent,
    SamplePoAccordionBasicComponent,
    SamplePoDividerBasicComponent,
    SamplePoProgressBasicComponent,
    VisualTestPoInputStatesComponent
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(visualRoutes, {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class VisualAppModule {}

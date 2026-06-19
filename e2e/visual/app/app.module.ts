import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { AppComponent, VisualHomeComponent } from './app.component';

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

// Visual test - po-input states (legacy route, kept for backward compatibility)
import { VisualTestPoInputStatesComponent } from '../po-input/po-input-states.component';

// Visual test - Field state components (co-located in e2e/visual/fields/)
import { VisualTestPoInputFieldStatesComponent } from '../fields/po-input/po-input-states.component';
import { VisualTestPoDecimalStatesComponent } from '../fields/po-decimal/po-decimal-states.component';
import { VisualTestPoEmailStatesComponent } from '../fields/po-email/po-email-states.component';
import { VisualTestPoNumberStatesComponent } from '../fields/po-number/po-number-states.component';
import { VisualTestPoPasswordStatesComponent } from '../fields/po-password/po-password-states.component';
import { VisualTestPoUrlStatesComponent } from '../fields/po-url/po-url-states.component';
import { VisualTestPoLoginStatesComponent } from '../fields/po-login/po-login-states.component';
import { VisualTestPoComboStatesComponent } from '../fields/po-combo/po-combo-states.component';
import { VisualTestPoDatepickerStatesComponent } from '../fields/po-datepicker/po-datepicker-states.component';
import { VisualTestPoDatepickerRangeStatesComponent } from '../fields/po-datepicker-range/po-datepicker-range-states.component';
import { VisualTestPoLookupStatesComponent } from '../fields/po-lookup/po-lookup-states.component';
import { VisualTestPoMultiselectStatesComponent } from '../fields/po-multiselect/po-multiselect-states.component';
import { VisualTestPoSelectStatesComponent } from '../fields/po-select/po-select-states.component';
import { VisualTestPoTextareaStatesComponent } from '../fields/po-textarea/po-textarea-states.component';
import { VisualTestPoRichTextStatesComponent } from '../fields/po-rich-text/po-rich-text-states.component';
import { VisualTestPoUploadStatesComponent } from '../fields/po-upload/po-upload-states.component';
import { VisualTestPoCheckboxStatesComponent } from '../fields/po-checkbox/po-checkbox-states.component';
import { VisualTestPoCheckboxGroupStatesComponent } from '../fields/po-checkbox-group/po-checkbox-group-states.component';
import { VisualTestPoSwitchStatesComponent } from '../fields/po-switch/po-switch-states.component';
import { VisualTestPoRadioGroupStatesComponent } from '../fields/po-radio-group/po-radio-group-states.component';

const visualRoutes: Routes = [
  // Basic sample routes
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
  { path: 'visual/po-input-states', component: VisualTestPoInputStatesComponent },

  // Field state combination routes (e2e/visual/fields/)
  { path: 'visual/fields/po-input-states', component: VisualTestPoInputFieldStatesComponent },
  { path: 'visual/fields/po-decimal-states', component: VisualTestPoDecimalStatesComponent },
  { path: 'visual/fields/po-email-states', component: VisualTestPoEmailStatesComponent },
  { path: 'visual/fields/po-number-states', component: VisualTestPoNumberStatesComponent },
  { path: 'visual/fields/po-password-states', component: VisualTestPoPasswordStatesComponent },
  { path: 'visual/fields/po-url-states', component: VisualTestPoUrlStatesComponent },
  { path: 'visual/fields/po-login-states', component: VisualTestPoLoginStatesComponent },
  { path: 'visual/fields/po-combo-states', component: VisualTestPoComboStatesComponent },
  { path: 'visual/fields/po-datepicker-states', component: VisualTestPoDatepickerStatesComponent },
  { path: 'visual/fields/po-datepicker-range-states', component: VisualTestPoDatepickerRangeStatesComponent },
  { path: 'visual/fields/po-lookup-states', component: VisualTestPoLookupStatesComponent },
  { path: 'visual/fields/po-multiselect-states', component: VisualTestPoMultiselectStatesComponent },
  { path: 'visual/fields/po-select-states', component: VisualTestPoSelectStatesComponent },
  { path: 'visual/fields/po-textarea-states', component: VisualTestPoTextareaStatesComponent },
  { path: 'visual/fields/po-rich-text-states', component: VisualTestPoRichTextStatesComponent },
  { path: 'visual/fields/po-upload-states', component: VisualTestPoUploadStatesComponent },
  { path: 'visual/fields/po-checkbox-states', component: VisualTestPoCheckboxStatesComponent },
  { path: 'visual/fields/po-checkbox-group-states', component: VisualTestPoCheckboxGroupStatesComponent },
  { path: 'visual/fields/po-switch-states', component: VisualTestPoSwitchStatesComponent },
  { path: 'visual/fields/po-radio-group-states', component: VisualTestPoRadioGroupStatesComponent },

  // Landing page
  { path: '', component: VisualHomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    VisualHomeComponent,
    // Basic samples
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
    VisualTestPoInputStatesComponent,
    // Field state components
    VisualTestPoInputFieldStatesComponent,
    VisualTestPoDecimalStatesComponent,
    VisualTestPoEmailStatesComponent,
    VisualTestPoNumberStatesComponent,
    VisualTestPoPasswordStatesComponent,
    VisualTestPoUrlStatesComponent,
    VisualTestPoLoginStatesComponent,
    VisualTestPoComboStatesComponent,
    VisualTestPoDatepickerStatesComponent,
    VisualTestPoDatepickerRangeStatesComponent,
    VisualTestPoLookupStatesComponent,
    VisualTestPoMultiselectStatesComponent,
    VisualTestPoSelectStatesComponent,
    VisualTestPoTextareaStatesComponent,
    VisualTestPoRichTextStatesComponent,
    VisualTestPoUploadStatesComponent,
    VisualTestPoCheckboxStatesComponent,
    VisualTestPoCheckboxGroupStatesComponent,
    VisualTestPoSwitchStatesComponent,
    VisualTestPoRadioGroupStatesComponent
  ],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(visualRoutes, {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class VisualAppModule {}

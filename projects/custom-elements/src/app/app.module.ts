import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DoBootstrap, NgModule, Injector, inject, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { createCustomElement } from '@angular/elements';

import {
  PoButtonComponent,
  PoButtonGroupComponent,
  PoCheckboxComponent,
  PoComboComponent,
  PoDatepickerComponent,
  PoInputComponent,
  PoRadioGroupComponent,
  PoSelectComponent
} from '../../../ui/src/lib';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule],
  providers: [provideExperimentalZonelessChangeDetection(), provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule implements DoBootstrap {
  private readonly _injector = inject(Injector);

  public ngDoBootstrap() {
    const elements = [
      { selector: 'po-button', component: PoButtonComponent },
      { selector: 'po-button-group', component: PoButtonGroupComponent },
      { selector: 'po-checkbox', component: PoCheckboxComponent },
      { selector: 'po-combo', component: PoComboComponent },
      { selector: 'po-datepicker', component: PoDatepickerComponent },
      { selector: 'po-input', component: PoInputComponent },
      { selector: 'po-radio-group', component: PoRadioGroupComponent },
      { selector: 'po-select', component: PoSelectComponent }
    ];

    elements.forEach(({ selector, component }) => {
      if (!customElements.get(selector)) {
        const element = createCustomElement(component, { injector: this._injector });
        customElements.define(selector, element);
      }
    });
  }
}

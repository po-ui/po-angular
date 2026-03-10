import { DoBootstrap, Injector, NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FormsModule } from '@angular/forms';

import { PoButtonModule } from '../../ui/src/lib/components/po-button/po-button.module';
import { PoButtonComponent } from '../../ui/src/lib/components/po-button/po-button.component';

import { PoFieldModule } from '../../ui/src/lib/components/po-field/po-field.module';
import { PoInputComponent } from '../../ui/src/lib/components/po-field/po-input/po-input.component';
import { PoDatepickerComponent } from '../../ui/src/lib/components/po-field/po-datepicker/po-datepicker.component';
import { PoComboComponent } from '../../ui/src/lib/components/po-field/po-combo/po-combo.component';
import { PoLookupComponent } from '../../ui/src/lib/components/po-field/po-lookup/po-lookup.component';

import { PoIconModule } from '../../ui/src/lib/components/po-icon/po-icon.module';
import { PoLoadingModule } from '../../ui/src/lib/components/po-loading/po-loading.module';
import { PoCalendarModule } from '../../ui/src/lib/components/po-calendar/po-calendar.module';
import { PoServicesModule } from '../../ui/src/lib/services/services.module';

/**
 * Mapeamento dos componentes PO UI para Custom Elements (Web Components).
 *
 * Cada entrada define:
 * - component: a classe do componente Angular
 * - selector: o nome do tag HTML para o Custom Element
 */
const PO_ELEMENTS = [
  { component: PoButtonComponent, selector: 'po-button' },
  { component: PoInputComponent, selector: 'po-input' },
  { component: PoDatepickerComponent, selector: 'po-datepicker' },
  { component: PoComboComponent, selector: 'po-combo' },
  { component: PoLookupComponent, selector: 'po-lookup' }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    PoButtonModule,
    PoFieldModule,
    PoIconModule,
    PoLoadingModule,
    PoCalendarModule,
    PoServicesModule
  ]
})
export class PoElementsModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    for (const entry of PO_ELEMENTS) {
      if (!customElements.get(entry.selector)) {
        const element = createCustomElement(entry.component, { injector: this.injector });
        customElements.define(entry.selector, element);
      }
    }

    console.log('[po-elements] Web Components registrados:', PO_ELEMENTS.map(e => e.selector).join(', '));
  }
}

platformBrowserDynamic()
  .bootstrapModule(PoElementsModule, {
    applicationProviders: [provideZoneChangeDetection()]
  })
  .catch(err => console.error('[po-elements] Erro ao inicializar:', err));

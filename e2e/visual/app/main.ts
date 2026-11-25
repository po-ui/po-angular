import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { VisualAppModule } from './app.module';

platformBrowserDynamic()
  .bootstrapModule(VisualAppModule, { applicationProviders: [provideZoneChangeDetection()] })
  .catch(err => console.error('Error in visual-app bootstrap:', err));

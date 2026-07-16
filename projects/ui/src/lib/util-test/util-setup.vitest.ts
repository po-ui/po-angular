import 'zone.js';
import 'zone.js/testing';

import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, provideZoneChangeDetection } from '@angular/core';

@NgModule({
  providers: [provideZoneChangeDetection()]
})
class AppTestingModule {}

// Initialize the Angular testing environment (same as test.ts in Karma)
TestBed.initTestEnvironment([BrowserTestingModule, AppTestingModule], platformBrowserTesting(), {
  teardown: { destroyAfterEach: false }
});

// Global beforeEach equivalent to util-setup.spec.ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
  });
});

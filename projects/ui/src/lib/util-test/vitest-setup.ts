import 'zone.js';
import 'zone.js/testing';

import { NgModule, provideZoneChangeDetection, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { beforeEach } from 'vitest';

@NgModule({
  providers: [provideZoneChangeDetection()]
})
class AppTestingModule {}

getTestBed().initTestEnvironment([BrowserTestingModule, AppTestingModule], platformBrowserTesting(), {
  teardown: { destroyAfterEach: false }
});

beforeEach(async () => {
  TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
  });
});

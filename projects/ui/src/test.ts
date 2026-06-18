// This file is required by karma.conf.js and loads recursively all the .spec and framework files

// zone.js is loaded for the test environment to support fakeAsync/tick test helpers.
// The library itself does NOT depend on zone.js at runtime.
// import 'zone.js';
// import 'zone.js/testing';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({
  providers: [
    // provideZoneChangeDetection()
  ]
})
class AppTestingModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserTestingModule, AppTestingModule], platformBrowserTesting(), {
  teardown: { destroyAfterEach: false }
});

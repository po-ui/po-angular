// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js';
import 'zone.js/testing';

import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

@NgModule({
  providers: [provideZoneChangeDetection()]
})
class AppTestingModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserTestingModule, AppTestingModule], platformBrowserTesting(), {
  teardown: { destroyAfterEach: false }
});

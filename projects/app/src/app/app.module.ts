import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@portinari/portinari-ui';

import { AppComponent } from './app.component';
// tslint:disable-next-line: max-line-length
import { SamplePoMenuHumanResourcesComponent } from 'projects/ui/src/lib/components/po-menu/samples/sample-po-menu-human-resources/sample-po-menu-human-resources.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SamplePoMenuHumanResourcesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    PoModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

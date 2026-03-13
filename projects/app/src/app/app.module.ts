import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { Dthfui11105Component } from './dthfui-11105/dthfui-11105.component';
import { PoModalModule } from 'projects/ui/src/lib';
import { AppRoutingModule } from './app.routing.module';
import { PoSampleComponent } from './dthfui-11105/components/poSample/poSample-component';
import { PoLookup2Component } from './dthfui-11105/components/poLookup/poLookup-component';
import { PoDynamicComponent } from './dthfui-11105/components/poDynamic/poDynamic-component';
import { Dthfui11105PoTableComponent } from './dthfui-11105/components/poTable/poTable-component';
import { PoPageDynamicTableModule } from '@po-ui/ng-templates';
import { Dthfui11105PoTableLabsComponent } from './dthfui-11105/components/PoTable_labs/poTable-labs.component';

@NgModule({
  declarations: [
    AppComponent,
    Dthfui11105Component,
    PoSampleComponent,
    PoLookup2Component,
    PoDynamicComponent,
    Dthfui11105PoTableComponent,
    Dthfui11105PoTableLabsComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([], {}),
    PoModule,
    PoPageDynamicTableModule,
    PoModalModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

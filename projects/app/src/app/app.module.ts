import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { PoModule } from '@po-ui/ng-components';
import { PoModule } from 'projects/ui/src/lib';
import { PoTemplatesModule } from '@po-ui/ng-templates'; // <-- Usar isso para dist compilada
// import { PoTemplatesModule } from 'projects/templates/src/lib'; // <-- Source direto (desenvolvimento)

import { AppComponent } from './app.component';
import { Dthfui12553Component } from './dthfui-12253/dthfui-12553.component';
import { Dthfui12554Component } from './dthfui-12554/dthfui-12554.component';

@NgModule({
  declarations: [AppComponent, Dthfui12553Component, Dthfui12554Component],
  bootstrap: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], {}),
    PoModule,
    PoTemplatesModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

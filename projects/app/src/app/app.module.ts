import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@portinari/portinari-ui';

import { AppComponent } from './app.component';
// import { PoModule } from 'projects/ui/src/lib/po.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([]),
    PoModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

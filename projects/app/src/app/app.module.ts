import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../../projects/ui/src/lib/po.module';

import { AppComponent } from './app.component';
import { AccountService } from './account.service';

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
  bootstrap: [AppComponent],
  providers: [
    AccountService
  ]
})
export class AppModule { }

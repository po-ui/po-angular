import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { Code12541Module } from './code-12541/code-12541.module';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule, Code12541Module],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

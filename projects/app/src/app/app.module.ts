import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { MockAiSearchInterceptor } from './services/mock-ai-search.service';
import { MockEmployeesInterceptor } from './services/mock-employees.service';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MockEmployeesInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MockAiSearchInterceptor, multi: true }
  ]
})
export class AppModule {}

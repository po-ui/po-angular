import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuService } from './menu.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  exports: [],
  bootstrap: [AppComponent],
  imports: [BrowserModule, SharedModule, AppRoutingModule],
  providers: [MenuService, provideHttpClient(withXhr(), withInterceptorsFromDi())]
})
export class AppModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuService } from './menu.service';
import { AppearancePopoverComponent } from './shared/appearance-popover/appearance-popover.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, AppearancePopoverComponent],
  exports: [],
  bootstrap: [AppComponent],
  imports: [BrowserModule, SharedModule, AppRoutingModule],
  providers: [MenuService, provideHttpClient(withXhr(), withInterceptorsFromDi())]
})
export class AppModule {}

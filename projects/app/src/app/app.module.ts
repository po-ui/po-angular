import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { AppearancePopoverComponent } from './appearance-popover/appearance-popover.component';
import { ThemeShowcaseComponent } from './theme-showcase/theme-showcase.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], {}),
    PoModule,
    ThemeShowcaseComponent,
    AppearancePopoverComponent
  ],
  providers: [provideHttpClient(withXhr(), withInterceptorsFromDi())]
})
export class AppModule {}

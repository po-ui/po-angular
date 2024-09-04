import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PoModule } from '../../../ui/src/lib';
import { SamplePoToasterLabsComponent } from './sample-po-toaster-labs.component';

@NgModule({
  declarations: [AppComponent, SamplePoToasterLabsComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

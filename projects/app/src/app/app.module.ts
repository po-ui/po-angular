import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { inject, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoMenuItem, PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { SamplePoMenuHumanResourcesService } from 'projects/ui/src/lib/components/po-menu/samples/sample-po-menu-human-resources/sample-po-menu-human-resources.service';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

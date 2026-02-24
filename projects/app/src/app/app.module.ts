import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';
import { AppComponent } from './app.component';
import { PoGuidedTourComponent } from '../../../../ui/src/lib/components/po-guided-tour/po-guided-tour.component';

@NgModule({
  declarations: [
    AppComponent,
    PoGuidedTourComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([], {}),
    PoModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

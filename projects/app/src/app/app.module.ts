import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';

import { SamplePoButtonBasicComponent } from '../../../ui/src/lib/components/po-button/samples/sample-po-button-basic/sample-po-button-basic.component';
import { SamplePoButtonLabsComponent } from '../../../ui/src/lib/components/po-button/samples/sample-po-button-labs/sample-po-button-labs.component';
import { SamplePoButtonSocialNetworkComponent } from '../../../ui/src/lib/components/po-button/samples/sample-po-button-social-network/sample-po-button-social-network.component';

@NgModule({
  declarations: [
    AppComponent,
    SamplePoButtonBasicComponent,
    SamplePoButtonLabsComponent,
    SamplePoButtonSocialNetworkComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      [
        { path: 'button/basic', component: SamplePoButtonBasicComponent },
        { path: 'button/labs', component: SamplePoButtonLabsComponent },
        { path: 'button/social-network', component: SamplePoButtonSocialNetworkComponent }
      ],
      {}
    ),
    PoModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

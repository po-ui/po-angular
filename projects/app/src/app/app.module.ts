import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//import { PoModule } from '@po-ui/ng-components';
import { PoModule } from '../../../ui/src/lib';
import { PoTemplatesModule } from '../../../templates/src/lib';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SamplePoDynamicFormRegisterComponent } from '../../../ui/src/lib/components/po-dynamic/po-dynamic-form/samples/sample-po-dynamic-form-register/sample-po-dynamic-form-register.component';

@NgModule({
  declarations: [AppComponent, SamplePoDynamicFormRegisterComponent ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([], {}),
    PoModule,
    PoTemplatesModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

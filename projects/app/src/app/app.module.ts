import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '@po-ui/ng-components';

import { AppComponent } from './app.component';
import { SamplePoTextareaEmailComponent } from '../../../ui/src/lib/components/po-field/po-textarea/samples/sample-po-textarea-email/sample-po-textarea-email.component';

@NgModule({
  declarations: [AppComponent, SamplePoTextareaEmailComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
    PoModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

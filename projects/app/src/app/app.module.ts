import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PoModule } from './../../../ui/src/lib';
import { PoTemplatesModule } from './../../../templates/src/lib';

import { AppComponent } from './app.component';
import { PoPageJobSchedulerModule } from '../../../templates/src/lib/components/po-page-job-scheduler/po-page-job-scheduler.module';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([], {}),
    PoModule,
    PoTemplatesModule,
    PoPageJobSchedulerModule,
    FormsModule
  ]
})
export class AppModule {}

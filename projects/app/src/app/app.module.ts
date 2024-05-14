import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/lib';

import { AppComponent } from './app.component';
import { SamplePoTableAirfareComponent } from 'projects/ui/src/lib/components/po-table/samples/sample-po-table-airfare/sample-po-table-airfare.component'
@NgModule({
  declarations: [AppComponent, SamplePoTableAirfareComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, RouterModule.forRoot([], {}), PoModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

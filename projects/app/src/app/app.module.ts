import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PoModule } from '@po-ui/ng-components';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, PoModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

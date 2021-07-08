import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// import { PoModule } from '@po-ui/ng-components';
import { PoModule } from '../../../ui/src/lib';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, PoModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

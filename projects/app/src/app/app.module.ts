import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PoModule } from '../../../../dist/ng-components';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }), PoModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

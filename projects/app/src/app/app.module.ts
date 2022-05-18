import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

//import { PoModule } from '@po-ui/ng-components';
import { PoModule } from '../../../ui/src/lib';
import { PoTemplatesModule } from '../../../templates/src/lib';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }), PoModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

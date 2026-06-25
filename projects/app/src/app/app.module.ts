import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoModule } from '../../../ui/src/public-api';

import { AppComponent } from './app.component';
import { AppPoSearchAiWithAiComponent } from './sample-po-search-ai-with-ai/sample-po-search-ai-with-ai.component';

@NgModule({
  declarations: [AppComponent, AppPoSearchAiWithAiComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

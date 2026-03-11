import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { SkeletonLabsComponent } from './skeleton-labs/skeleton-labs.component';
import { SkeletonTransitionDemoComponent } from './skeleton-transition-demo/skeleton-transition-demo.component';
import { PoModule } from 'projects/ui/src/lib';

@NgModule({
  declarations: [AppComponent, CardComponent, SkeletonLabsComponent, SkeletonTransitionDemoComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {}

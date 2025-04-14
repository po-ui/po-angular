import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { PoModule } from '@po-ui/ng-components';
import { AppComponent } from './app.component';
import { PoModule } from 'projects/ui/src/lib';
import { provideAnimations } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot([], {}), PoModule],
  providers: [provideHttpClient(withInterceptorsFromDi()), provideAnimations()]
})
export class AppModule {}

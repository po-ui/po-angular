import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableComponent } from './resizable/resizable.component';
import { MyResizeDirective } from './my-resize.directive';
import { FrozenColumnDirective } from './frozen.directive';

//import { PoModule } from '@po-ui/ng-components';
import { PoModule, PoI18nModule, PoI18nConfig } from '../../../ui/src/lib';
import { PoTemplatesModule } from '../../../templates/src/lib';

import { AppComponent } from './app.component';
import { generalEn } from './general-en';

const i18nConfig: PoI18nConfig = {
  default: {
    language: 'en',
    context: 'general',
    cache: true
  },
  contexts: {
    general: {},
    hcm: {
      url: 'http://10.1.1.1/api/translations/hcm/'
    }
  }
};

@NgModule({
  declarations: [AppComponent, MyResizeDirective, ResizableComponent, FrozenColumnDirective],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule,
    PoTemplatesModule,
    HttpClientModule,
    RouterModule.forRoot([], {}),
    PoModule,
    PoI18nModule.config(i18nConfig)
  ],
  bootstrap: [AppComponent],
  providers: []
})
export class AppModule {}

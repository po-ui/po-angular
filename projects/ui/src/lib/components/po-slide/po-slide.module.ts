import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoContainerModule } from '../po-container/po-container.module';
import { PoIconModule } from '../po-icon';

import { PoSlideCirclesComponent } from './po-slide-circles/po-slide-circles.component';
import { PoSlideComponent } from './po-slide.component';
import { PoSlideContentTemplateDirective } from './directives/po-slide-content-template.directive';
import { PoSlideControlComponent } from './po-slide-control/po-slide-control.component';
import { PoSlideItemComponent } from './po-slide-item/po-slide-item.component';

/**
 * @description
 *
 * Módulo do componente `po-slide`.
 *
 * > Para o correto funcionamento do componente `po-slide`, deve ser importado o módulo `BrowserAnimationsModule` no
 * > módulo principal da sua aplicação.
 *
 * Módulo da aplicação:
 * ```
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { PoModule } from '@po-ui/ng-components';
 * ...
 *
 * @NgModule({
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     ...
 *     PoModule
 *   ],
 *   declarations: [
 *     AppComponent,
 *     ...
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 *
 * Em aplicações Standalone, utilize a seguinte configuração para o bootstrap:
 *
 * ```
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { AppComponent } from './app.component';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [importProvidersFrom(BrowserAnimationsModule)]
 * }).catch(err => console.error(err));
 * ```
 */
@NgModule({
  imports: [CommonModule, RouterModule, PoContainerModule, PoIconModule],
  declarations: [
    PoSlideCirclesComponent,
    PoSlideComponent,
    PoSlideControlComponent,
    PoSlideContentTemplateDirective,
    PoSlideItemComponent
  ],
  exports: [PoSlideComponent, PoSlideContentTemplateDirective],
  providers: [],
  schemas: []
})
export class PoSlideModule {}

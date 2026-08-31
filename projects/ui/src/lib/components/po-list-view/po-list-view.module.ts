import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PoButtonModule } from '../po-button/po-button.module';
import { PoIconModule } from '../po-icon/po-icon.module';
import { PoModalModule } from '../po-modal/po-modal.module';
import { PoPopupModule } from '../po-popup/po-popup.module';
import { PoProgressCircleComponent } from '../po-progress/po-progress-circle/po-progress-circle.component';
import { PoWidgetModule } from '../po-widget/po-widget.module';
import { PoCheckboxModule } from './../po-field/po-checkbox/po-checkbox.module';
import { PoRadioModule } from './../po-field/po-radio/po-radio.module';

import { PoListViewComponent } from './po-list-view.component';
import { PoListViewContentTemplateDirective } from './po-list-view-content-template/po-list-view-content-template.directive';
import { PoListViewDetailTemplateDirective } from './po-list-view-detail-template/po-list-view-detail-template.directive';
import { PoContainerModule } from '../po-container/po-container.module';

/**
 * @description
 *
 * Módulo do componente `po-list-view`.
 *
 * > Para o correto funcionamento das animações do componente `po-list-view`, você deve prover
 * > as animações na inicialização da sua aplicação.
 *
 * Em aplicações Standalone (padrão recomendado):
 * ```
 * import { provideAnimations } from '@angular/platform-browser/animations';
 * import { bootstrapApplication } from '@angular/platform-browser';
 * import { AppComponent } from './app.component';
 *
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideAnimations(),
 *     // ou provideAnimationsAsync() para lazy loading das animações
 *   ]
 * }).catch(err => console.error(err));
 * ```
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PoButtonModule,
    PoIconModule,
    PoPopupModule,
    PoModalModule,
    PoCheckboxModule,
    PoRadioModule,
    PoContainerModule,
    PoWidgetModule,
    PoProgressCircleComponent
  ],
  declarations: [PoListViewComponent, PoListViewContentTemplateDirective, PoListViewDetailTemplateDirective],
  exports: [PoListViewComponent, PoListViewContentTemplateDirective, PoListViewDetailTemplateDirective],
  providers: [],
  schemas: []
})
export class PoListViewModule {}

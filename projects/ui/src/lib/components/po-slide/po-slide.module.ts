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

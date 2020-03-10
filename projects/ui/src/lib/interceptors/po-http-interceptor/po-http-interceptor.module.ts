import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { PoAccordionModule } from '../../components/po-accordion/po-accordion.module';
import { PoModalModule } from '../../components/po-modal/po-modal.module';
import { PoNotificationModule } from '../../services/po-notification/po-notification.module';
import { PoNotificationService } from './../../services/po-notification/po-notification.service';
import { PoTagModule } from '../../components/po-tag/po-tag.module';

import { PoHttpInterceptorDetailComponent } from './po-http-interceptor-detail/po-http-interceptor-detail.component';
import { PoHttpInterceptorService } from './po-http-interceptor.service';

@NgModule({
  imports: [CommonModule, PoAccordionModule, PoModalModule, PoNotificationModule, PoTagModule],
  declarations: [PoHttpInterceptorDetailComponent],
  providers: [
    PoHttpInterceptorService,
    PoNotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PoHttpInterceptorService,
      multi: true
    }
  ]
})
export class PoHttpInterceptorModule {}

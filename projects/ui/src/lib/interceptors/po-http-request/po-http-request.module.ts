import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { PoLoadingModule } from '../../components/po-loading/po-loading.module';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoHttpRequesControltService } from './po-http-request-control-service';
import { PoHttpRequestInterceptorService } from './po-http-request-interceptor.service';

@NgModule({
  imports: [PoLoadingModule],
  providers: [
    PoHttpRequesControltService,
    PoHttpRequestInterceptorService,
    PoComponentInjectorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PoHttpRequestInterceptorService,
      multi: true
    }
  ]
})
export class PoHttpRequestModule {}

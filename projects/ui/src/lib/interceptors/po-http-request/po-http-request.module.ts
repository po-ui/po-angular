import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoHttpRequesControltService } from './po-http-request-control-service';
import { PoHttpRequestInterceptorService } from './po-http-request-interceptor.service';

import { PoLoadingComponent } from '../../components/po-loading/po-loading.component';
import { PoLoadingOverlayComponent } from '../../components/po-loading/po-loading-overlay/po-loading-overlay.component';

@NgModule({
  providers: [
    PoHttpRequesControltService,
    PoHttpRequestInterceptorService,
    PoComponentInjectorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PoHttpRequestInterceptorService,
      multi: true
    }
  ],
  entryComponents: [PoLoadingOverlayComponent, PoLoadingComponent]
})
export class PoHttpRequestModule { }

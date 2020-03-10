import { NgModule } from '@angular/core';

import { PoHttpInterceptorModule } from './po-http-interceptor/po-http-interceptor.module';
import { PoHttpRequestModule } from './po-http-request/po-http-request.module';

@NgModule({
  declarations: [],
  imports: [PoHttpInterceptorModule, PoHttpRequestModule],
  exports: [PoHttpInterceptorModule, PoHttpRequestModule],
  providers: [],
  bootstrap: []
})
export class PoInterceptorsModule {}

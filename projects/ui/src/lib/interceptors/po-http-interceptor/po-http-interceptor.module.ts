import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { PoDialogService } from './../../services/po-dialog/po-dialog.service';
import { PoNotificationService } from './../../services/po-notification/po-notification.service';
import { PoHttpInterceptorService } from './po-http-interceptor.service';

@NgModule({
  providers: [
    PoHttpInterceptorService,
    PoDialogService,
    PoNotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PoHttpInterceptorService,
      multi: true
    }
  ]
})
export class PoHttpInterceptorModule { }

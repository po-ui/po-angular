import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoHttpInterceptorBaseService } from './po-http-interceptor-base.service';

import { PoDialogService } from './../../services/po-dialog/po-dialog.service';
import { PoNotificationService } from './../../services/po-notification/po-notification.service';
import { PoComponentInjectorService } from './../../services/po-component-injector/po-component-injector.service';

import { PoHttpInterceptorService } from './po-http-interceptor.service';

describe('PoHttpInterceptor', () => {

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        PoNotificationService,
        PoDialogService,
        PoComponentInjectorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PoHttpInterceptorService,
          multi: true
        }
      ]
    });
  });

  it('should be created', () => {
    const notification = TestBed.get(PoNotificationService);
    const dialog = TestBed.get(PoDialogService);

    const service = new PoHttpInterceptorService(notification, dialog);

    expect(service instanceof PoHttpInterceptorService).toBeTruthy();
    expect(service instanceof PoHttpInterceptorBaseService).toBeTruthy();
  });
});

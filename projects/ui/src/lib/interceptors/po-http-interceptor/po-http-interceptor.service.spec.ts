import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from './../../util-test/util-expect.spec';
import { PoComponentInjectorService } from './../../services/po-component-injector/po-component-injector.service';
import { PoNotificationService } from './../../services/po-notification/po-notification.service';

import { PoHttpInterceptorBaseService } from './po-http-interceptor-base.service';
import { PoHttpInterceptorService } from './po-http-interceptor.service';

describe('PoHttpInterceptor', () => {
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        PoNotificationService,
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
    const notification = TestBed.inject(PoNotificationService);
    const componentInjector = TestBed.inject(PoComponentInjectorService);

    const service = new PoHttpInterceptorService(notification, componentInjector);

    expect(service instanceof PoHttpInterceptorService).toBeTruthy();
    expect(service instanceof PoHttpInterceptorBaseService).toBeTruthy();
  });
});

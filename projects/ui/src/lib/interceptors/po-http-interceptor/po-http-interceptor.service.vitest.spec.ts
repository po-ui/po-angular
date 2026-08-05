import { describe, it, expect, beforeEach } from 'vitest';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { PoComponentInjectorService } from './../../services/po-component-injector/po-component-injector.service';
import { PoNotificationService } from './../../services/po-notification/po-notification.service';

import { PoHttpInterceptorBaseService } from './po-http-interceptor-base.service';
import { PoHttpInterceptorService } from './po-http-interceptor.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';

describe('PoHttpInterceptor', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        PoNotificationService,
        PoComponentInjectorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PoHttpInterceptorService,
          multi: true
        }
      ]
    }).compileComponents();
  });

  it('should be created', () => {
    const notification = TestBed.inject(PoNotificationService);
    const componentInjector = TestBed.inject(PoComponentInjectorService);
    const languageService = TestBed.inject(PoLanguageService);

    const service = new PoHttpInterceptorService(notification, componentInjector, languageService);

    expect(service instanceof PoHttpInterceptorService).toBeTruthy();
    expect(service instanceof PoHttpInterceptorBaseService).toBeTruthy();
  });
});

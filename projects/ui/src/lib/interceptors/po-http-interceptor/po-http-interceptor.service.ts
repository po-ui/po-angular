import { Injectable } from '@angular/core';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoNotificationService } from './../../services/po-notification/po-notification.service';

import { PoHttpInterceptorBaseService } from './po-http-interceptor-base.service';

/**
 * @docsExtends PoHttpInterceptorBaseService
 *
 * @example
 * <example name='po-http-interceptor-labs' title='Portinari Http Interceptor Labs'>
 *  <file name='sample-po-http-interceptor-labs.component.ts'> </file>
 *  <file name='sample-po-http-interceptor-labs.component.html'> </file>
 * </example>
 */
@Injectable()
export class PoHttpInterceptorService extends PoHttpInterceptorBaseService {
  constructor(notification: PoNotificationService, componentInjector: PoComponentInjectorService) {
    super(componentInjector, notification);
  }
}

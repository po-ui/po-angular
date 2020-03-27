import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoLoadingModule } from '../../components/po-loading/po-loading.module';
import { PoLoadingOverlayComponent } from '../../components/po-loading/po-loading-overlay/po-loading-overlay.component';

import { PoHttpRequesControltService } from './po-http-request-control-service';
import { PoHttpRequestInterceptorService } from './po-http-request-interceptor.service';
import { PoHttpRequestModule } from '../../interceptors/po-http-request/po-http-request.module';

describe('PoHttpRequestInterceptorService: ', () => {
  const mockErrorResponse = { status: 404, statusText: 'Bad Request' };
  const mockUsers = [{ name: 'Bob' }, { name: 'Juliette' }];

  let httpRequestInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PoHttpRequestModule],
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
    });

    httpRequestInterceptor = TestBed.inject(PoHttpRequestInterceptorService);

    httpRequestInterceptor['pendingRequests'] = 0;
  });

  it('should be created', () => {
    expect(httpRequestInterceptor).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('getCountPendingRequests: should return observable when call `getCountPendingRequests` method.', () => {
      const observable = httpRequestInterceptor.getCountPendingRequests();

      expect(observable instanceof Observable).toBeTruthy();
    });

    it('intercept: should return `throwError` when call `catch` method.', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        spyOn(httpRequestInterceptor, <any>'setCountPendingRequests');
        spyOn(httpRequestInterceptor, <any>'setCountOverlayRequests');

        http.get('/data').subscribe(
          res => {},
          error => {
            expect(error.statusText).toBe(mockErrorResponse.statusText);
            expect(error.status).toBe(mockErrorResponse.status);
          }
        );

        httpMock.expectOne('/data').flush({}, mockErrorResponse);
        httpMock.verify();
      }
    ));

    it('setCountPendingRequests: should update property `pendingRequests` when call request with header param false.', () => {
      const requestNoHeaderParam = createHttpRequest('X-PO-No-Count-Pending-Requests', 'false');

      httpRequestInterceptor['pendingRequests'] = 1;

      httpRequestInterceptor['setCountPendingRequests'](true, requestNoHeaderParam);

      expect(httpRequestInterceptor['pendingRequests']).toBe(2);
    });

    it('setCountPendingRequests: shouldn`t update property `pendingRequests` when call request with header param true.', () => {
      const requestNoHeaderParam = createHttpRequest('X-PO-No-Count-Pending-Requests', 'true');

      httpRequestInterceptor['pendingRequests'] = 1;

      httpRequestInterceptor['setCountPendingRequests'](true, requestNoHeaderParam);

      expect(httpRequestInterceptor['pendingRequests']).toBe(1);
    });

    it('setCountPendingRequests: shouldn`t update property `pendingRequests` when call request without header param.', () => {
      const requestNullHeaderParam = createHttpRequest('', '');

      httpRequestInterceptor['pendingRequests'] = 5;

      httpRequestInterceptor['setCountPendingRequests'](false, requestNullHeaderParam);

      expect(httpRequestInterceptor['pendingRequests']).toBe(4);
    });

    it('setCountOverlayRequests: should update property `overlayRequests` when call request with header param true.', () => {
      const requestNoHeaderParam = createHttpRequest('X-PO-Screen-Lock', 'true');

      httpRequestInterceptor['overlayRequests'] = 1;

      httpRequestInterceptor['setCountOverlayRequests'](true, requestNoHeaderParam);

      expect(httpRequestInterceptor['overlayRequests']).toBe(2);
    });

    it('setCountOverlayRequests: shouldn`t update property `overlayRequests` when call request with header param false.', () => {
      const requestNoHeaderParam = createHttpRequest('X-PO-Screen-Lock', 'false');

      httpRequestInterceptor['overlayRequests'] = 1;

      httpRequestInterceptor['setCountOverlayRequests'](true, requestNoHeaderParam);

      expect(httpRequestInterceptor['overlayRequests']).toBe(1);
    });

    it('setCountOverlayRequests: shouldn`t update property `overlayRequests` when call request without header param.', () => {
      const requestNullHeaderParam = createHttpRequest('', '');

      httpRequestInterceptor['overlayRequests'] = 0;

      httpRequestInterceptor['setCountOverlayRequests'](false, requestNullHeaderParam);

      expect(httpRequestInterceptor['overlayRequests']).toBe(0);
    });

    it(`setCountOverlayRequests: should update property 'overlayRequests' to '0' when call request with header
      param true and isIncrement is false.`, () => {
      const requestNullHeaderParam = createHttpRequest('X-PO-Screen-Lock', 'true');

      httpRequestInterceptor['overlayRequests'] = 1;

      httpRequestInterceptor['setCountOverlayRequests'](false, requestNullHeaderParam);

      expect(httpRequestInterceptor['overlayRequests']).toBe(0);
    });

    it(`requestCloneWithoutHeaderParam: should call 'headers.delete' when call
        request with 'X-PO-No-Count-Pending-Requests' header param.`, () => {
      const requestWithHeaderParam = createHttpRequest('X-PO-No-Count-Pending-Requests', 'true');
      const readerParams = ['X-PO-No-Count-Pending-Requests', 'true'];

      spyOn(requestWithHeaderParam.headers, 'delete');

      httpRequestInterceptor['requestCloneWithoutHeaderParam'](readerParams, requestWithHeaderParam);

      expect(requestWithHeaderParam.headers.delete).toHaveBeenCalled();
    });

    it(`requestCloneWithoutHeaderParam: should call 'headers.delete' when call
        request with 'X-PO-Screen-Lock' header param.`, () => {
      const requestWithHeaderParam = createHttpRequest('X-PO-Screen-Lock', 'true');
      const readerParams = ['X-PO-Screen-Lock', 'true'];

      spyOn(requestWithHeaderParam.headers, 'delete');

      httpRequestInterceptor['requestCloneWithoutHeaderParam'](readerParams, requestWithHeaderParam);

      expect(requestWithHeaderParam.headers.delete).toHaveBeenCalled();
    });

    it(`requestCloneWithoutHeaderParam: should not call 'headers.delete' when header param is undefiend.`, () => {
      const requestWithHeaderParam = createHttpRequest('X-PO-Screen-Lock', 'false');
      const readerParams = [];

      spyOn(requestWithHeaderParam.headers, 'delete');

      httpRequestInterceptor['requestCloneWithoutHeaderParam'](readerParams, requestWithHeaderParam);

      expect(requestWithHeaderParam.headers.delete).not.toHaveBeenCalled();
    });

    it('buildLoading: should create `PoLoadingOverlayComponent` when `loadingOverlayComponent` is undefined.', () => {
      const componentRef = { instance: { screenLock: undefined, changeDetector: { detectChanges: () => {} } } };
      httpRequestInterceptor['loadingOverlayComponent'] = undefined;

      spyOn(httpRequestInterceptor.poComponentInjector, 'createComponentInApplication').and.returnValue(componentRef);

      httpRequestInterceptor['buildLoading']();

      expect(httpRequestInterceptor.poComponentInjector.createComponentInApplication).toHaveBeenCalledWith(
        PoLoadingOverlayComponent
      );
    });

    it('buildLoading: shouldn`t create `PoLoadingOverlayComponent` when `loadingOverlayComponent` is defined', () => {
      httpRequestInterceptor['loadingOverlayComponent'] = PoLoadingOverlayComponent;

      spyOn(httpRequestInterceptor.poComponentInjector, 'createComponentInApplication');

      httpRequestInterceptor['buildLoading']();

      expect(httpRequestInterceptor.poComponentInjector.createComponentInApplication).not.toHaveBeenCalled();
    });

    it('buildLoading: should call `detectChanges`.', () => {
      const componentRef = { instance: { screenLock: undefined, changeDetector: { detectChanges: () => {} } } };
      httpRequestInterceptor['loadingOverlayComponent'] = undefined;

      spyOn(componentRef.instance.changeDetector, 'detectChanges').and.callThrough();
      spyOn(httpRequestInterceptor.poComponentInjector, 'createComponentInApplication').and.returnValue(componentRef);

      httpRequestInterceptor['buildLoading']();

      expect(componentRef.instance.changeDetector.detectChanges).toHaveBeenCalled();
    });

    it(`destroyLoading: should destroy component when 'loadingOverlayComponent' is defined.`, () => {
      httpRequestInterceptor['loadingOverlayComponent'] = PoLoadingOverlayComponent;

      spyOn(httpRequestInterceptor.poComponentInjector, 'destroyComponentInApplication');

      httpRequestInterceptor['destroyLoading']();

      expect(httpRequestInterceptor.poComponentInjector.destroyComponentInApplication).toHaveBeenCalledWith(
        PoLoadingOverlayComponent
      );
      expect(httpRequestInterceptor['loadingOverlayComponent']).toBeUndefined();
    });

    it(`destroyLoading: shouldn't destroy component when 'loadingOverlayComponent' is undefined.`, () => {
      httpRequestInterceptor['loadingOverlayComponent'] = undefined;

      spyOn(httpRequestInterceptor.poComponentInjector, 'destroyComponentInApplication');

      httpRequestInterceptor['destroyLoading']();

      expect(httpRequestInterceptor.poComponentInjector.destroyComponentInApplication).not.toHaveBeenCalled();
    });
  });

  describe('Properties: ', () => {
    it('pendingRequests: should increment `pendingRequests` when receive a request with success.', inject(
      [HttpClient, HttpTestingController],
      (http: HttpClient, httpMock: HttpTestingController) => {
        http.get('/data').subscribe();
        httpMock.expectOne('/data').flush(mockUsers);

        expect(httpRequestInterceptor['pendingRequests']).toEqual(0);
      }
    ));
  });
});

function createHttpRequest(headerParam: string, value: string) {
  return new HttpRequest('GET', '', null, {
    headers: new HttpHeaders().set(headerParam, value)
  });
}

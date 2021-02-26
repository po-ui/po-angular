import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HTTP_INTERCEPTORS,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';

import { PoHttpInterceptorDetail } from './po-http-interceptor-detail/po-http-interceptor-detail.interface';
import { PoHttpInterceptorModule } from './po-http-interceptor.module';
import { PoHttpInterceptorService } from './po-http-interceptor.service';

import { PoToasterOrientation } from '../../services/po-notification/po-toaster/po-toaster-orientation.enum';

const mockNotification = {
  success: (message: string) => {},
  error: (message: string, orientation: PoToasterOrientation, actionLabel: string, action: Function) => {}
};

describe('PoHttpInterceptorBaseService', () => {
  let response: any;
  let errResponse: HttpErrorResponse;

  let mockErrorResponse;
  let mockWarningResponse;
  let mockInfoResponse;
  let mockErrorServerNotResponding;
  let mockSuccessResponse;
  let poErrorMessage;
  let messages;
  let service;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PoHttpInterceptorModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        PoComponentInjectorService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: PoHttpInterceptorService,
          multi: true
        }
      ]
    });
  });

  beforeEach(() => {
    mockErrorResponse = { status: 404, statusText: 'Bad Request' };
    mockWarningResponse = { status: 102, statusText: 'Processing', type: 'warning' };
    mockInfoResponse = { status: 102, statusText: 'Processing', type: 'info' };
    mockErrorServerNotResponding = { status: 0, statusText: 'Server not responding' };
    mockSuccessResponse = { status: 200, statusText: 'Success' };
    poErrorMessage = { message: 'erro po', code: '1', detailedMessage: '', details: [{}], helpUrl: '' };
    messages = { type: 'success', message: 'po', code: '2' };
    service = TestBed.inject(PoHttpInterceptorService);
  });

  it('should show success notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      const actionLabel = undefined;
      const action = undefined;

      spyOn(service.notification, 'success');

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );
      httpMock.expectOne('/data').flush({ _messages: messages }, mockSuccessResponse);

      expect(service.notification.success).toHaveBeenCalledWith({ message: messages.message, actionLabel, action });
    }
  ));

  it('should show success notifications', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'success');

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush({ _messages: [messages, messages] }, mockSuccessResponse);

      expect(service.notification.success).toHaveBeenCalledTimes(4);
    }
  ));

  it('should not show invalid type notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      messages.type = 'invalid type';

      spyOn(mockNotification, 'success');

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush({ _messages: messages }, mockSuccessResponse);

      expect(mockNotification.success).not.toHaveBeenCalled();
    }
  ));

  it('should not show notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(mockNotification, 'success');

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush({ invalid_message_object: messages }, mockSuccessResponse);

      expect(mockNotification.success).not.toHaveBeenCalled();
    }
  ));

  it('should show error notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'error');

      poErrorMessage.details = undefined;
      poErrorMessage.detailedMessage = undefined;

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockErrorResponse);

      expect(service.notification.error).toHaveBeenCalledWith({
        message: poErrorMessage.message,
        actionLabel: undefined,
        action: undefined
      });
    }
  ));

  it('should show warning notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'warning');

      poErrorMessage.details = undefined;
      poErrorMessage.detailedMessage = undefined;
      poErrorMessage.type = 'warning';

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockWarningResponse);

      expect(service.notification.warning).toHaveBeenCalledWith({
        message: poErrorMessage.message,
        actionLabel: undefined,
        action: undefined
      });
    }
  ));

  it('should show information notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'information');

      poErrorMessage.details = undefined;
      poErrorMessage.detailedMessage = undefined;
      poErrorMessage.type = 'information';

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockInfoResponse);

      expect(service.notification.information).toHaveBeenCalledWith({
        message: poErrorMessage.message,
        actionLabel: undefined,
        action: undefined
      });
    }
  ));

  it('should show error notification when return invalid type', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'error');

      poErrorMessage.details = undefined;
      poErrorMessage.detailedMessage = undefined;
      poErrorMessage.type = 'angular';

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockErrorResponse);

      expect(service.notification.error).toHaveBeenCalledWith({
        message: poErrorMessage.message,
        actionLabel: undefined,
        action: undefined
      });
    }
  ));

  it('should show error notification with details', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'error');

      poErrorMessage.details = [{ code: '1', message: 'detalhe' }];

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockErrorResponse);

      // TODO: Validar notification function
      expect(service.notification.error).toHaveBeenCalledWith({
        message: poErrorMessage.message,
        actionLabel: service.literals.details,
        action: jasmine.any(Function)
      });
    }
  ));

  it('should show error notification with help url', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'error');

      poErrorMessage.details = undefined;
      poErrorMessage.detailedMessage = undefined;
      poErrorMessage.helpUrl = 'http://po.com.br';

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockErrorResponse);

      // TODO: Validar help Url
      expect(service.notification.error).toHaveBeenCalledWith({
        message: poErrorMessage.message,
        actionLabel: service.literals.help,
        action: jasmine.any(Function)
      });
    }
  ));

  it('should show error notification if server not responding', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(service.notification, 'error');

      poErrorMessage.details = undefined;
      poErrorMessage.detailedMessage = undefined;

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockErrorServerNotResponding);

      expect(service.notification.error).toHaveBeenCalledWith({
        message: service.literals.serverNotResponse,
        actionLabel: service.literals.details,
        action: jasmine.any(Function)
      });
    }
  ));

  it('should not show error notification', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      spyOn(mockNotification, 'error');

      http.get('/data').subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(mockErrorResponse, mockErrorResponse);

      expect(mockNotification.error).not.toHaveBeenCalled();
    }
  ));

  it('should open external help url', () => {
    spyOn(window, 'open');

    const helpUrl = 'https://fakeUrlPo.com.br';

    service['generateUrlHelpFunction'](helpUrl)();

    expect(window.open).toHaveBeenCalledWith(helpUrl, '_blank');
  });

  it('should not show notification when defined noErrorNotification with value true', inject(
    [HttpClient, HttpTestingController],
    (http: HttpClient, httpMock: HttpTestingController) => {
      const headers = { 'X-PO-No-Error': 'true' };

      spyOn(mockNotification, 'error');

      http.get('/data', { headers: headers }).subscribe(
        res => (response = res),
        err => (errResponse = err)
      );

      httpMock.expectOne('/data').flush(poErrorMessage, mockErrorResponse);

      expect(mockNotification.error).not.toHaveBeenCalled();
    }
  ));

  it('hasNoErrorParam should return true when the param `X-PO-No-Error` value is true in header of request', () => {
    const requestWithTrueValue = createHttpRequest('X-PO-No-Error', 'true');
    const requestWithUpperCaseValue = createHttpRequest('X-PO-NO-ERROR', 'TRUE');

    expect(service['hasNoErrorParam'](requestWithTrueValue)).toBeTruthy();
    expect(service['hasNoErrorParam'](requestWithUpperCaseValue)).toBeTruthy();
  });

  it('hasNoErrorParam should return false when the param `X-PO-No-Error` value is false in header of request', () => {
    const requestWipoalseValue = createHttpRequest('X-PO-No-Error', 'false');
    const requestWithWhitespaceValue = createHttpRequest('X-PO-No-Error', '');

    expect(service['hasNoErrorParam'](requestWipoalseValue)).toBeFalsy();
    expect(service['hasNoErrorParam'](requestWithWhitespaceValue)).toBeFalsy();
  });

  it('hasNoErrorParam should return false when request param is undefined', () => {
    const hasNoErrorParam = service['hasNoErrorParam'](undefined);
    expect(hasNoErrorParam).toBeFalsy();
  });

  describe('Methods:', () => {
    it('hasNoMessageParam should return true if `X-PO-No-Error` value is true in request header', () => {
      ['true', 'TRUE'].forEach(value => {
        const request = createHttpRequest('X-PO-No-Message', value);
        expect(service['hasNoMessageParam'](request)).toBeTruthy(true);
      });
    });

    it('hasNoMessageParam should return false if `X-PO-No-Error` value is falsy in request header', () => {
      ['false', 'FALSE', ''].forEach(value => {
        const request = createHttpRequest('X-PO-No-Message', value);
        expect(service['hasNoMessageParam'](request)).toBeFalsy(false);
      });
    });

    it('hasNoMessageParam should return false if request parameter is undefined', () => {
      const hasNoMessageParam = service['hasNoMessageParam'](undefined);
      expect(hasNoMessageParam).toBeFalsy();
    });

    it('createModal: should create instance of `PoHttpInterceptorDetail`, set detail, subscribe to closed, and call open.', () => {
      const detail: PoHttpInterceptorDetail = { code: 'code', detailedMessage: 'detailed message', message: 'message' };

      const detailComponentFake = {
        instance: {
          detail: '',
          title: '',
          closed: { subscribe: callback => callback() },
          open: () => {}
        }
      };

      spyOn(service['componentInjector'], 'createComponentInApplication').and.returnValue(detailComponentFake);
      spyOn(service, 'destroyModal');
      spyOn(detailComponentFake.instance, <any>'open');

      service['createModal'](detail);

      const detailComponent = service['httpInterceptorDetailComponent'];

      expect(service['componentInjector'].createComponentInApplication).toHaveBeenCalled();
      expect(service['destroyModal']).toHaveBeenCalled();
      expect(detailComponentFake.instance['open']).toHaveBeenCalled();
      expect(detailComponent.instance.detail).toEqual([detail]);
    });

    it('createModal: should create instance of `PoHttpInterceptorDetail` with details array', () => {
      const detail: PoHttpInterceptorDetail = {
        code: 'code',
        detailedMessage: 'detailed message',
        message: 'message',
        details: [
          { code: 'detail code', detailedMessage: 'detailed message', message: 'detail message' },
          { code: 'detail code', detailedMessage: 'detailed message', message: 'detail message 2' }
        ]
      };

      const expectedDetails = [
        { code: 'code', detailedMessage: 'detailed message', message: 'message', details: detail.details },
        { code: 'detail code', detailedMessage: 'detailed message', message: 'detail message' },
        { code: 'detail code', detailedMessage: 'detailed message', message: 'detail message 2' }
      ];

      const detailComponentFake = {
        instance: {
          detail: '',
          title: '',
          closed: { subscribe: callback => callback() },
          open: () => {}
        }
      };

      spyOn(service['componentInjector'], 'createComponentInApplication').and.returnValue(detailComponentFake);
      spyOn(service, 'destroyModal');
      spyOn(detailComponentFake.instance, <any>'open');

      service['createModal'](detail);

      const detailComponent = service['httpInterceptorDetailComponent'];

      expect(service['componentInjector'].createComponentInApplication).toHaveBeenCalled();
      expect(service['destroyModal']).toHaveBeenCalled();
      expect(detailComponentFake.instance['open']).toHaveBeenCalled();
      expect(detailComponent.instance.detail).toEqual(expectedDetails);
    });

    it('destroyModal: should destroy detail component if httpInterceptorDetailComponent is defined', () => {
      service.createModal({});

      spyOn(service.componentInjector, 'destroyComponentInApplication');

      service['destroyModal']();

      expect(service.httpInterceptorDetailComponent).toBeUndefined();
      expect(service.componentInjector.destroyComponentInApplication).toHaveBeenCalled();
    });

    it('destroyModal: shouldn`t call destroyComponentInApplication if httpInterceptorDetailComponent is undefined', () => {
      service.httpInterceptorDetailComponent = undefined;

      spyOn(service.componentInjector, 'destroyComponentInApplication');

      service['destroyModal']();

      expect(service.componentInjector.destroyComponentInApplication).not.toHaveBeenCalled();
    });

    it('generateDetailModal: should call createModal if modal isn`t created', () => {
      service.httpInterceptorDetailComponent = undefined;

      spyOn(service, <any>'createModal');

      service.generateDetailModal({})();

      expect(service['createModal']).toHaveBeenCalled();
    });

    it('generateDetailModal: shouldn`t call createModal if modal is created', () => {
      service['createModal']({});

      spyOn(service, <any>'createModal');

      service.generateDetailModal()();

      expect(service['createModal']).not.toHaveBeenCalled();
    });

    it('cloneRequestWithoutParameters: should return request without `X-PO-No-Error` and `X-PO-No-Message`', () => {
      const headers = new HttpHeaders()
        .append('X-PO-No-Error', 'true')
        .append('X-PO-No-Message', 'false')
        .append('other-header', 'test');

      const expectedHeaders = new HttpHeaders().append('other-header', 'test');

      const request = new HttpRequest('GET', 'http://fakeUrlPo.com', { headers });

      const expectedRequest = new HttpRequest('GET', 'http://fakeUrlPo.com', {
        headers: expectedHeaders
      });

      const result = service.cloneRequestWithoutParameters(request);

      expect(result.headers.keys()).toEqual(expectedRequest.headers.keys());
    });

    it('processResponse: shouldn`t call showNotification if hasNoMessageParam is true', () => {
      spyOn(service, 'hasNoMessageParam').and.returnValue(true);
      spyOn(service, <any>'showNotification');

      const request = new HttpRequest('GET', 'http://fakeUrlPo.com', { headers: new HttpHeaders() });
      response = new HttpResponse({
        body: { items: [], _messages: 'test' },
        headers: new HttpHeaders().append('X-PO-No-Message', 'true')
      });

      service.processResponse(response, request);

      expect(service['showNotification']).not.toHaveBeenCalled();
    });

    it('processResponse: should call showNotification if hasNoMessageParam is false, body and _messages are true', () => {
      spyOn(service, 'hasNoMessageParam').and.returnValue(false);
      spyOn(service, <any>'showNotification');

      const request = new HttpRequest('GET', 'http://fakeUrlPo.com', { headers: new HttpHeaders() });
      response = new HttpResponse({
        body: { items: [], _messages: 'test' },
        headers: new HttpHeaders()
      });

      service.processResponse(response, request);

      expect(service['showNotification']).toHaveBeenCalled();
    });

    it('showNotification: shouldn`t call notification if no has message', () => {
      response = { message: '', code: '200', type: 'information' };

      spyOn(service.notification, <any>'information');

      service.showNotification(response);

      expect(service.notification.information).not.toHaveBeenCalled();
    });

    it('showNotification: should call notification if has message', () => {
      response = { message: 'Created with success', code: '200', type: 'success' };

      spyOn(service.notification, <any>'success');

      service.showNotification(response);

      expect(service.notification.success).toHaveBeenCalled();
    });
  });
});

function createHttpRequest(headerParam: string, value: string) {
  return new HttpRequest('GET', '', null, {
    headers: new HttpHeaders().set(headerParam, value)
  });
}

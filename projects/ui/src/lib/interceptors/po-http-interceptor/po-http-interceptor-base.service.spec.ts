import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, HttpHeaders, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';

import { configureTestSuite } from './../../util-test/util-expect.spec';

import { PoHttpInterceptorBaseService } from './po-http-interceptor-base.service';
import { PoToasterOrientation } from '../../services/po-notification/po-toaster/po-toaster-orientation.enum';

const mockNotification = {
  success: (message: string) => { },
  error: (message: string, orientation: PoToasterOrientation, actionLabel: string, action: Function) => { }
};

const mockDialog = {
  alert: (title: string, message: string, ok: Function) => { }
};

@Injectable()
class PoHttpInterceptor extends PoHttpInterceptorBaseService {
  constructor() {
    super(mockNotification, mockDialog);
  }
}

describe('PoHttpInterceptorBaseService', () => {

  let response: any;
  let errResponse: HttpErrorResponse;

  let mockErrorResponse;
  let mockErrorServerNotResponding;
  let mockSuccessResponse;
  let portinariErrorMessage;
  let messages;
  let service: PoHttpInterceptor;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: PoHttpInterceptor,
        multi: true
      }]
    });
  });

  beforeEach(() => {
    mockErrorResponse = { status: 404, statusText: 'Bad Request' };
    mockErrorServerNotResponding = { status: 0, statusText: 'Server not responding' };
    mockSuccessResponse = { status: 200, statusText: 'Success' };
    portinariErrorMessage = { message: 'erro portinari', code: '1', detailedMessage: '', details: [{}], helpUrl: '' };
    messages = { type: 'success', message: 'portinari', code: '2' };
    service = new PoHttpInterceptor();
  });

  it('should show success notification',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      const actionLabel = undefined;
      const action = undefined;

      spyOn(mockNotification, 'success');

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush({ _messages: messages }, mockSuccessResponse);

      expect(mockNotification.success).toHaveBeenCalledWith({ message: messages.message, actionLabel, action });
    }));

  it('should show success notifications',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'success');

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush({ _messages: [messages, messages] }, mockSuccessResponse);

      expect(mockNotification.success).toHaveBeenCalledTimes(2);
    }));

  it('should not show invalid type notification',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      messages.type = 'invalid type';

      spyOn(mockNotification, 'success');

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush({ _messages: messages }, mockSuccessResponse);

      expect(mockNotification.success).not.toHaveBeenCalled();
    }));

  it('should not show notification',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'success');

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush({ invalid_message_object: messages }, mockSuccessResponse);

      expect(mockNotification.success).not.toHaveBeenCalled();
    }));

  it('should show error notification',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'error');

      portinariErrorMessage.details = undefined;
      portinariErrorMessage.detailedMessage = undefined;

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush(portinariErrorMessage, mockErrorResponse);

      expect(mockNotification.error).toHaveBeenCalledWith(
        { message: portinariErrorMessage.message, actionLabel: undefined, action: undefined });
    }));

  it('should show error notification with details',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'error');

      portinariErrorMessage.details = [{ code: '1', message: 'detalhe' }];

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush(portinariErrorMessage, mockErrorResponse);

      // TODO: Validar notification function
      expect(mockNotification.error).toHaveBeenCalledWith(
        {
          message: portinariErrorMessage.message, actionLabel: 'Detalhes', action: jasmine.any(Function)
        });
    }));

  it('should show error notification with help url',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'error');

      portinariErrorMessage.details = undefined;
      portinariErrorMessage.detailedMessage = undefined;
      portinariErrorMessage.helpUrl = 'http://po.portinari.com.br';

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush(portinariErrorMessage, mockErrorResponse);

      // TODO: Validar help Url
      expect(mockNotification.error).toHaveBeenCalledWith(
        {
          message: portinariErrorMessage.message, actionLabel: 'Ajuda', action: jasmine.any(Function)
        });
    }));

  it('should show error notification if server not responding',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'error');

      portinariErrorMessage.details = undefined;
      portinariErrorMessage.detailedMessage = undefined;

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush(portinariErrorMessage, mockErrorServerNotResponding);

      expect(mockNotification.error).toHaveBeenCalledWith(
        { message: 'Servidor não está respondendo.', actionLabel: 'Detalhes', action: jasmine.any(Function) });
    }));

  it('should not show error notification',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {

      spyOn(mockNotification, 'error');

      http.get('/data').subscribe(res => response = res, err => errResponse = err);

      httpMock.expectOne('/data').flush(mockErrorResponse, mockErrorResponse);

      expect(mockNotification.error).not.toHaveBeenCalled();
    }));

  it('should open external help url', () => {

    spyOn(window, 'open');

    const helpUrl = 'https://google.com.br';

    service['generateUrlHelpFunction'](helpUrl)();

    expect(window.open).toHaveBeenCalledWith(helpUrl, '_blank');
  });

  it('should open dialog detail', () => {

    spyOn(mockDialog, 'alert');

    service['generateDialogDetailFunction'](portinariErrorMessage, portinariErrorMessage.message)();

    expect(mockDialog.alert).toHaveBeenCalledWith({
      title: portinariErrorMessage.code, message: portinariErrorMessage.message, ok: undefined
    });
  });

  it('should open dialog detail without help', () => {

    spyOn(mockDialog, 'alert');

    portinariErrorMessage.helpUrl = undefined;

    service['generateDialogDetailFunction'](portinariErrorMessage, portinariErrorMessage.message)();

    expect(mockDialog.alert).toHaveBeenCalledWith({
      title: portinariErrorMessage.code, message: portinariErrorMessage.message, ok: undefined
    });
  });

  it('should not show notification when defined noErrorNotification with value true',
    inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    const headers = { 'X-Portinari-No-Error': 'true' };

    spyOn(mockNotification, 'error');

    http.get('/data', { headers: headers }).subscribe(res => response = res, err => errResponse = err);

    httpMock.expectOne('/data').flush(portinariErrorMessage, mockErrorResponse);

    expect(mockNotification.error).not.toHaveBeenCalled();
  }));

  it('hasNoErrorParam should return true when the param `X-Portinari-No-Error` value is true in header of request', () => {

    const requestWithTrueValue = createHttpRequest('X-Portinari-No-Error', 'true');
    const requestWithUpperCaseValue = createHttpRequest('X-PORTINARI-NO-ERROR', 'TRUE');

    expect(service['hasNoErrorParam'](requestWithTrueValue)).toBeTruthy();
    expect(service['hasNoErrorParam'](requestWithUpperCaseValue)).toBeTruthy();
  });

  it('hasNoErrorParam should return false when the param `X-Portinari-No-Error` value is false in header of request', () => {

    const requestWipoalseValue = createHttpRequest('X-Portinari-No-Error', 'false');
    const requestWithWhitespaceValue = createHttpRequest('X-Portinari-No-Error', '');

    expect(service['hasNoErrorParam'](requestWipoalseValue)).toBeFalsy();
    expect(service['hasNoErrorParam'](requestWithWhitespaceValue)).toBeFalsy();
  });

  it('hasNoErrorParam should return false when request param is undefined', () => {

    const hasNoErrorParam = service['hasNoErrorParam'](undefined);
    expect(hasNoErrorParam).toBeFalsy();
  });

});

function createHttpRequest(headerParam: string, value: string) {
  return new HttpRequest('GET', '', null, {
    headers: new HttpHeaders().set(headerParam, value)
  });
}

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoDynamicViewService } from './po-dynamic-view.service';

describe('PoDynamicViewService:', () => {
  let httpMock: HttpTestingController;
  let poDynamicViewService: PoDynamicViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoDynamicViewService]
    });

    poDynamicViewService = TestBed.inject(PoDynamicViewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poDynamicViewService).toBeTruthy();
    expect(poDynamicViewService instanceof PoDynamicViewService).toBeTruthy();
  });

  describe('Methods', () => {
    it('onLoad: should call POST method with `url` and `value`', () => {
      const url = 'url';
      const value = {};
      const expectedResponse = { value: {}, fields: [] };

      poDynamicViewService.onLoad(url, value).then(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${url}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });

    it(`getObjectByValue: should return the request response and create request with url, headers and 'filterParams' correctly`, fakeAsync(() => {
      poDynamicViewService['url'] = 'http://url.com';
      const filterParams = { name: 'test' };
      const value = 'test/encoding';
      const expectedResponse = { user: 'test' };

      spyOn(poDynamicViewService, <any>'validateParams').and.returnValue(filterParams);

      poDynamicViewService.getObjectByValue(value, filterParams).subscribe(response => {
        expect(poDynamicViewService['validateParams']).toHaveBeenCalledWith(filterParams);
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(
        httpRequest =>
          httpRequest.url === 'http://url.com/test%2Fencoding' &&
          httpRequest.method === 'GET' &&
          httpRequest.params.get('name') === 'test'
      );

      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush(expectedResponse);
      tick();
    }));

    it(`getObjectByValue: should call 'validateParams' and set its return as the request parameter`, () => {
      poDynamicViewService['url'] = 'http://url.com';
      const filterParams = { name: 'test' };
      const value = '1';

      spyOn(poDynamicViewService, <any>'validateParams').and.returnValue(filterParams);

      poDynamicViewService.getObjectByValue(value, filterParams).subscribe(() => {
        expect(poDynamicViewService['validateParams']).toHaveBeenCalledWith(filterParams);
      });

      httpMock.expectOne(httpRequest => httpRequest.params.get('name') === 'test').flush({});
    });

    it(`getObjectByValue: should call 'validateParams' with 'multiple' is true and array of value and set its return as the request parameter`, () => {
      poDynamicViewService['url'] = 'http://url.com';
      poDynamicViewService['multiple'] = true;
      const filterParams = { name: 'test' };
      const value = [1, 2];

      spyOn(poDynamicViewService, <any>'validateParams').and.returnValue(filterParams);

      poDynamicViewService.getObjectByValue(value, filterParams).subscribe(() => {
        expect(poDynamicViewService['validateParams']).toHaveBeenCalledWith(filterParams);
      });

      httpMock.expectOne(httpRequest => httpRequest.params.get('name') === 'test').flush({ items: [] });
    });

    it('setConfig: should set `url` to the value of the parameter', () => {
      poDynamicViewService['url'] = undefined;
      const paramValue = 'http://url.com.br';

      poDynamicViewService.setConfig(paramValue);

      expect(poDynamicViewService['url']).toBe(paramValue);
    });

    it('validateParams: should return param if it`s a object', () => {
      const param = { key: 'value' };

      expect(poDynamicViewService['validateParams'](param)).toEqual(param);
    });

    it('validateParams: should return undefined if it isn`t an object', () => {
      let param: any;

      param = 'value';
      expect(poDynamicViewService['validateParams'](param)).toBe(undefined);

      param = 1;
      expect(poDynamicViewService['validateParams'](param)).toBe(undefined);

      param = false;
      expect(poDynamicViewService['validateParams'](param)).toBe(undefined);

      param = ['value'];
      expect(poDynamicViewService['validateParams'](param)).toBe(undefined);
    });
  });
});

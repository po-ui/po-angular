import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PoLookupFilterService } from './po-lookup-filter.service';

describe('PoLookupFilterService', () => {
  let service: PoLookupFilterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoLookupFilterService]
    });

    service = TestBed.inject(PoLookupFilterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service instanceof PoLookupFilterService).toBeTruthy();
  });

  describe('Methods:', () => {
    it(`getFilteredItems: should return the request response and create request with url, page, pageSize, filter, 
    headers and params correctly`, fakeAsync(() => {
      service['url'] = 'http://url.com';
      const page = 1;
      const pageSize = 20;
      const filter = 'name';
      const filterParams = { name: 'test' };
      const expectedResponse = { user: 'test' };

      service
        .getFilteredItems({ filter, page, pageSize, filterParams })
        .subscribe(response => expect(response).toEqual(expectedResponse));

      const req = httpMock.expectOne(httpRequest => {
        return (
          httpRequest.url === service['url'] &&
          httpRequest.method === 'GET' &&
          httpRequest.params.get('page') === <any>page &&
          httpRequest.params.get('pageSize') === <any>pageSize &&
          httpRequest.params.get('filter') === 'name' &&
          httpRequest.params.get('name') === 'test'
        );
      });

      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush(expectedResponse);
      tick();
    }));

    it(`getFilteredItems: should call 'validateParams' and set its return as the request parameter`, () => {
      service['url'] = 'http://url.com';
      const page = 1;
      const pageSize = 20;
      const filter = undefined;
      const filterParams = { name: 'test' };

      spyOn(service, <any>'validateParams').and.returnValue(filterParams);

      service.getFilteredItems({ filter, page, pageSize, filterParams }).subscribe(() => {
        expect(service['validateParams']).toHaveBeenCalledWith(filterParams);
      });

      httpMock.expectOne(httpRequest => httpRequest.params.get('name') === 'test').flush({});
    });

    it(`getObjectByValue: should return the request response and create request with url, headers and 'filterParams' correctly`, fakeAsync(() => {
      service['url'] = 'http://url.com';
      const filterParams = { name: 'test' };
      const value = 'test/encoding';
      const expectedResponse = { user: 'test' };

      spyOn(service, <any>'validateParams').and.returnValue(filterParams);

      service.getObjectByValue(value, filterParams).subscribe(response => {
        expect(service['validateParams']).toHaveBeenCalledWith(filterParams);
        expect(response).toEqual(expectedResponse);
      });

      const req = httpMock.expectOne(httpRequest => {
        return (
          httpRequest.url === 'http://url.com/test%2Fencoding' &&
          httpRequest.method === 'GET' &&
          httpRequest.params.get('name') === 'test'
        );
      });

      expect(req.request.headers.get('X-PO-No-Message')).toBe('true');

      req.flush(expectedResponse);
      tick();
    }));

    it(`getObjectByValue: should call 'validateParams' and set its return as the request parameter`, () => {
      service['url'] = 'http://url.com';
      const filterParams = { name: 'test' };
      const value = '1';

      spyOn(service, <any>'validateParams').and.returnValue(filterParams);

      service.getObjectByValue(value, filterParams).subscribe(() => {
        expect(service['validateParams']).toHaveBeenCalledWith(filterParams);
      });

      httpMock.expectOne(httpRequest => httpRequest.params.get('name') === 'test').flush({});
    });

    it('setUrl: should set `url` to the value of the parameter', () => {
      service['url'] = undefined;
      const paramValue = 'http://url.com.br';

      service.setUrl(paramValue);

      expect(service['url']).toBe(paramValue);
    });

    it('validateParams: should return param if it`s a object', () => {
      const param = { key: 'value' };

      expect(service['validateParams'](param)).toEqual(param);
    });

    it('validateParams: should return undefined if it isn`t an object', () => {
      let param: any;

      param = 'value';
      expect(service['validateParams'](param)).toBe(undefined);

      param = 1;
      expect(service['validateParams'](param)).toBe(undefined);

      param = false;
      expect(service['validateParams'](param)).toBe(undefined);

      param = ['value'];
      expect(service['validateParams'](param)).toBe(undefined);
    });
  });
});

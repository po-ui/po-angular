import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { PoHttpClientService } from './po-http-client.service';
import { PoHttpRequestType } from './po-http-request-type.enum';
import { PoHttpRequestData } from './interfaces/po-http-request-data.interface';

describe('PoHttpClientService', () => {
  let poHttpClientService: PoHttpClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoHttpClientService]
    });

    poHttpClientService = TestBed.inject(PoHttpClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poHttpClientService instanceof PoHttpClientService).toBeTruthy();
  });

  describe('Methods: ', () => {
    const headerMock = { name: 'header name', value: 'header value' };
    const bodyMock = { value: 'body value' };

    it('createRequest: should call createHttpHeaders and httpClient.request with GET method, url, body and headers', done => {
      const httpHeadersMock = new HttpHeaders().set(headerMock.name, headerMock.value);

      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.GET,
        headers: [headerMock],
        body: bodyMock
      };

      spyOn(poHttpClientService, <any>'createHttpHeaders').and.returnValue(httpHeadersMock);

      poHttpClientService['createRequest'](poHttpOperationDataMock).subscribe(response => {
        expect(response instanceof HttpResponse).toBeTruthy();
        expect(poHttpClientService['createHttpHeaders']).toHaveBeenCalledWith(poHttpOperationDataMock.headers);
        done();
      });

      httpMock
        .expectOne(httpRequest => {
          return (
            httpRequest.url === poHttpOperationDataMock.url &&
            httpRequest.method === PoHttpRequestType.GET &&
            httpRequest.headers.get(headerMock.name) === headerMock.value &&
            httpRequest.body === poHttpOperationDataMock.body
          );
        })
        .flush({});
    });

    it('delete: should call createRequest with poHttpOperationData without headers', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.DELETE,
        headers: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.delete(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it(`delete: should call createRequest with poHttpOperationData`, done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.DELETE,
        headers: [headerMock]
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.delete(poHttpOperationDataMock.url, poHttpOperationDataMock.headers).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('get: should call createRequest with poHttpOperationData without header', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.GET,
        headers: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.get(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('get: should call createRequest with poHttpOperationData', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.GET,
        headers: [headerMock]
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.get(poHttpOperationDataMock.url, poHttpOperationDataMock.headers).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('head: should call createRequest with poHttpOperationData without header', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.HEAD,
        headers: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.head(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('head: should call createRequest with poHttpOperationData', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.HEAD,
        headers: [headerMock]
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.head(poHttpOperationDataMock.url, poHttpOperationDataMock.headers).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('options: should call createRequest with poHttpOperationData', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.OPTIONS,
        headers: [headerMock]
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.options(poHttpOperationDataMock.url, poHttpOperationDataMock.headers).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('options: should call createRequest with poHttpOperationData without header', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.OPTIONS,
        headers: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.options(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('patch: should call createRequest with poHttpOperationData', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.PATCH,
        headers: [headerMock],
        body: bodyMock
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService
        .patch(poHttpOperationDataMock.url, poHttpOperationDataMock.body, poHttpOperationDataMock.headers)
        .subscribe(response => {
          expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
          done();
        });
    });

    it('patch: should call createRequest with poHttpOperationData without body and header', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.PATCH,
        headers: undefined,
        body: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.patch(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('post: should call createRequest with poHttpOperationData', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.POST,
        headers: [headerMock],
        body: bodyMock
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService
        .post(poHttpOperationDataMock.url, poHttpOperationDataMock.body, poHttpOperationDataMock.headers)
        .subscribe(response => {
          expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
          done();
        });
    });

    it('post: should call createRequest with poHttpOperationData without body and header', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.POST,
        headers: undefined,
        body: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.post(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('put: should call createRequest with poHttpOperationData', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.PUT,
        headers: [headerMock],
        body: bodyMock
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService
        .put(poHttpOperationDataMock.url, poHttpOperationDataMock.body, poHttpOperationDataMock.headers)
        .subscribe(response => {
          expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
          done();
        });
    });

    it('put: should call createRequest with poHttpOperationData without body and header', done => {
      const poHttpOperationDataMock: PoHttpRequestData = {
        url: 'http://url-test.com',
        method: PoHttpRequestType.PUT,
        headers: undefined,
        body: undefined
      };

      spyOn(poHttpClientService, <any>'createRequest').and.returnValue(of({}));

      poHttpClientService.put(poHttpOperationDataMock.url).subscribe(response => {
        expect(poHttpClientService['createRequest']).toHaveBeenCalledWith(poHttpOperationDataMock);
        done();
      });
    });

    it('createHttpHeaders: should return HttpHeaders equal the headerMock', () => {
      const result = poHttpClientService['createHttpHeaders']([headerMock]);
      const httpHeadersMock = new HttpHeaders().append(headerMock.name, headerMock.value);

      expect(result).toEqual(httpHeadersMock);
    });

    it('createHttpHeaders: should return HttpHeaders equal the [] when array of headers is empty', () => {
      const result = poHttpClientService['createHttpHeaders']([]);

      expect(result.keys()).toEqual([]);
    });

    it('createHttpHeaders: should return HttpHeaders equal the [] when array of headers is undefined', () => {
      const result = poHttpClientService['createHttpHeaders'](undefined);

      expect(result.keys()).toEqual([]);
    });
  });
});

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';

import { PoPageDynamicService, poPageDynamicLiterals } from './po-page-dynamic.service';
import { PoPageDynamicTableMetaData } from '../../components';

describe('PoPageDynamicService:', () => {
  let poPageDynamicService: PoPageDynamicService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageDynamicService]
    });

    poPageDynamicService = TestBed.inject(PoPageDynamicService);
    httpMock = TestBed.inject(HttpTestingController);

    poPageDynamicService['language'] = 'en';
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(poPageDynamicService instanceof PoPageDynamicService).toBeTruthy();
  });

  describe('Methods: ', () => {
    it('configServiceApi:should config the endpoint', () => {
      poPageDynamicService.configServiceApi({ endpoint: '/test' });
      expect(poPageDynamicService['endpoint']).toBe('/test');
      poPageDynamicService.configServiceApi();
      expect(poPageDynamicService['endpoint']).toBeUndefined();
    });

    describe('getMetadata:', () => {
      it('should get metadata from api at a specific metadata url', fakeAsync(() => {
        poPageDynamicService.configServiceApi({ endpoint: '/test', metadata: '/metadataTest' });

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>().subscribe(response => {
          expect(response.version).toBe('1');
          expect(response.title).toBe('Teste');
        });

        const req = httpMock.expectOne(request => request.url === '/metadataTest?type=list&version=');

        req.flush({
          version: '1',
          title: 'Teste'
        });
        tick();
      }));

      it('should get metadata from api at /metadata?type=list', fakeAsync(() => {
        poPageDynamicService.configServiceApi({ endpoint: '/test' });

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>().subscribe(response => {
          expect(response.version).toBe('1');
          expect(response.title).toBe('Teste');
        });

        const req = httpMock.expectOne(request => request.url === '/test/metadata?type=list&version=');

        req.flush({
          version: '1',
          title: 'Teste'
        });
        tick();
      }));

      it('should get metadata from cache when the api return the same version', fakeAsync(() => {
        poPageDynamicService.configServiceApi({ endpoint: '/test' });

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>('custom').subscribe();

        const reqNoCache = httpMock.expectOne(request => request.url === '/test/metadata?type=custom&version=');

        reqNoCache.flush({
          version: '1',
          title: 'Teste'
        });

        tick();

        httpMock.verify();

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>('custom').subscribe(response => {
          expect(response.version).toBe('1');
          expect(response.title).toBe('Teste');
        });

        const req = httpMock.expectOne(request => request.url === '/test/metadata?type=custom&version=1');

        req.flush({
          version: '1'
        });

        tick();
      }));

      it(`should call notification.warning, get metadata title and throw error if
        catch error from api and haven't cache`, () => {
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

        let errorResponse;
        let successResponse;

        poPageDynamicService.configServiceApi({ endpoint: '/test' });

        const { errorRenderPage, notPossibleLoadMetadataPage } = poPageDynamicLiterals[
          poPageDynamicService['language']
        ];

        const spyNotificationWarning = spyOn(poPageDynamicService['notification'], 'warning');

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>().subscribe(
          response => (successResponse = response),
          error => (errorResponse = error)
        );

        const req = httpMock.expectOne(request => request.url === '/test/metadata?type=list&version=');
        req.flush('Invalid request parameters', mockErrorResponse);

        expect(successResponse.title).toBe(errorRenderPage);
        expect(spyNotificationWarning).toHaveBeenCalledWith(notPossibleLoadMetadataPage);
        expect(errorResponse instanceof HttpErrorResponse).toBe(true);
      });

      it(`should get metadata cache if catch error from api`, fakeAsync(() => {
        const mockCache = { version: '1', title: 'Custom Title' };
        const mockErrorResponse = { status: 400, statusText: 'Bad Request' };

        let errorResponse;
        let successResponse;

        poPageDynamicService.configServiceApi({ endpoint: '/test' });

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>('custom').subscribe();

        httpMock.expectOne(request => request.url === '/test/metadata?type=custom&version=').flush(mockCache);

        tick();

        httpMock.verify();

        poPageDynamicService.getMetadata<PoPageDynamicTableMetaData>('custom').subscribe(
          response => (successResponse = response),
          error => (errorResponse = error)
        );

        httpMock
          .expectOne(request => request.url === '/test/metadata?type=custom&version=1')
          .flush('Invalid request parameters', mockErrorResponse);

        expect(successResponse.title).toBe(mockCache.title);
        expect(errorResponse).toBe(undefined);
      }));
    });

    it('deleteResource:should delete a resource.', fakeAsync(() => {
      poPageDynamicService.configServiceApi({ endpoint: '/test' });

      poPageDynamicService.deleteResource(1).subscribe();

      const req = httpMock.expectOne(request => request.url === '/test/1');

      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

      req.flush({});
      tick();
    }));

    it('deleteResources:should delete a array of resources.', fakeAsync(() => {
      poPageDynamicService.configServiceApi({ endpoint: '/test' });

      poPageDynamicService.deleteResources([1, 2, 3]).subscribe();

      const req = httpMock.expectOne(request => request.url === '/test');

      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');
      expect(req.request.body).toEqual([1, 2, 3]);

      req.flush({});
      tick();
    }));
    describe('getResources', () => {
      it('should get a array of resources with params.', fakeAsync(() => {
        const params = new HttpParams().set('name', 'mario');
        poPageDynamicService.configServiceApi({ endpoint: '/test' });
        poPageDynamicService.getResources(params).subscribe();

        const req = httpMock.expectOne(request => request.url === '/test');

        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');
        expect(req.request.params.get('name')).toBe('mario');

        req.flush({});
        tick();
      }));

      it('should get a array of resources without params.', fakeAsync(() => {
        poPageDynamicService.configServiceApi({ endpoint: '/test' });
        poPageDynamicService.getResources().subscribe();

        const req = httpMock.expectOne(request => request.url === '/test');

        expect(req.request.method).toBe('GET');
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');
        expect(req.request.params.toString()).toBeFalsy();
        req.flush({});
        tick();
      }));
    });

    it('getResource:should get a resources.', fakeAsync(() => {
      poPageDynamicService.configServiceApi({ endpoint: '/test' });

      poPageDynamicService.getResource(3).subscribe();

      const req = httpMock.expectOne(request => request.url === '/test/3');

      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

      req.flush({});
      tick();
    }));

    it('createResource:should create a resources.', fakeAsync(() => {
      poPageDynamicService.configServiceApi({ endpoint: '/test' });

      poPageDynamicService.createResource({ 'name': 'mario' }).subscribe();

      const req = httpMock.expectOne(request => request.url === '/test');

      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');
      expect(req.request.body).toEqual({ 'name': 'mario' });

      req.flush({});
      tick();
    }));

    it('updateResource:should update a resources.', fakeAsync(() => {
      poPageDynamicService.configServiceApi({ endpoint: '/test' });

      poPageDynamicService.updateResource(1, { 'name': 'mario' }).subscribe();

      const req = httpMock.expectOne(request => request.url === '/test/1');

      expect(req.request.method).toBe('PUT');
      expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');
      expect(req.request.body).toEqual({ 'name': 'mario' });

      req.flush({});
      tick();
    }));
  });
});

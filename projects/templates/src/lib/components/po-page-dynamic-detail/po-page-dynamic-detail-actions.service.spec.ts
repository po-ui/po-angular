import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoPageDynamicDetailActionsService } from './po-page-dynamic-detail-actions.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PoPageDynamicDetailActionsService', () => {
  let service: PoPageDynamicDetailActionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageDynamicDetailActionsService]
    });

    service = TestBed.inject(PoPageDynamicDetailActionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service instanceof PoPageDynamicDetailActionsService).toBeTruthy();
  });

  describe('Methods', () => {
    describe('BeforeBack', () => {
      it('should get data from a api', fakeAsync(() => {
        service.beforeBack('/teste/back').subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/teste/back');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

        req.flush({
          newUrl: '/newurl',
          allowAction: true
        });

        tick();
      }));

      it('should get data from a function', fakeAsync(() => {
        const testFn = () => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });

        service.beforeBack(testFn).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeBack(testFn).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });
  });
});

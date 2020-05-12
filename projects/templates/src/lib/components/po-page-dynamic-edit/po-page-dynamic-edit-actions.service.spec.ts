import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PoPageDynamicEditActionsService } from './po-page-dynamic-edit-actions.service';

describe('PoPageDynamicEditActions:', () => {
  let service: PoPageDynamicEditActionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoPageDynamicEditActionsService]
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageDynamicEditActionsService]
    });

    service = TestBed.inject(PoPageDynamicEditActionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service instanceof PoPageDynamicEditActionsService).toBeTruthy();
  });

  describe('Methods: ', () => {
    describe('beforeCancel', () => {
      it('should get data from a api', fakeAsync(() => {
        service.beforeCancel('/test/cancel').subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/test/cancel');
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

        service.beforeCancel(testFn).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeCancel(testFn).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('beforeSave:', () => {
      const resource = { name: 'Mario' };

      it('should get data from a api', fakeAsync(() => {
        service.beforeSave('/newSave', resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/newSave');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(resource);
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

        req.flush({
          newUrl: '/newurl',
          allowAction: true
        });

        tick();
      }));

      it('should get data from a function', fakeAsync(() => {
        const testFn = resourceTest => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeSave(spyObj.testFn, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(resource);
        });

        tick();
      }));

      it('should get data from a function if resource is null', fakeAsync(() => {
        const testFn = resourceTest => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeSave(spyObj.testFn, null).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith({});
        });

        tick();
      }));

      it('shouldn`t get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeSave(testFn, resource).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });
  });
});

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
      const id = '1';

      it('should get data from a api', fakeAsync(() => {
        service.beforeSave('/newSave', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/newSave/1');
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
        const testFn = (userResource, userId) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeSave(spyObj.testFn, id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(resource, id);
        });

        tick();
      }));

      it('should get data from a function if resource is null', fakeAsync(() => {
        const testFn = (userResource, userId) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeSave(spyObj.testFn, id, null).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith({}, id);
        });

        tick();
      }));

      it('shouldn`t get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeSave(testFn, id, resource).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('beforeSaveNew:', () => {
      const resource = { name: 'Mario' };
      const id = '1';

      it('should get data from a api', fakeAsync(() => {
        service.beforeSaveNew('/newSave', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/newSave/1');
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
        const testFn = (userResource, userId) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeSaveNew(spyObj.testFn, id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(resource, id);
        });

        tick();
      }));

      it('should get data from a function if resource is null', fakeAsync(() => {
        const testFn = (userResource, userId) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeSaveNew(spyObj.testFn, id, null).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith({}, id);
        });

        tick();
      }));

      it('shouldn`t get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeSaveNew(testFn, id, resource).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });
  });
});

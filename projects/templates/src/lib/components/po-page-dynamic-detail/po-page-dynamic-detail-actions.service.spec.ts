import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { PoPageDynamicDetailActionsService } from './po-page-dynamic-detail-actions.service';

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

    describe('beforeRemove:', () => {
      const resource = { name: 'Name' };
      const id = '1';

      it('should get data from a api', fakeAsync(() => {
        service.beforeRemove('/test/remove', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/test/remove/1');
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
        const testFn = (userId, userResource) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeRemove(spyObj.testFn, id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(id, resource);
        });

        tick();
      }));

      it('should get data from a function if resource is null', fakeAsync(() => {
        const testFn = (userId, resourceTest) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeRemove(spyObj.testFn, id, null).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(id, {});
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeRemove(testFn, id, resource).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('beforeEdit:', () => {
      const resource = { name: 'Name' };
      const id = '1';

      it('should get data from a api', fakeAsync(() => {
        service.beforeEdit('/test/edit', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/test/edit/1');
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
        const testFn = (userId, userResource) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeEdit(spyObj.testFn, id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(id, resource);
        });

        tick();
      }));

      it('should get data from a function if resource is null', fakeAsync(() => {
        const testFn = (userId, resourceTest) => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });
        const spyObj = {
          testFn
        };

        const spy = spyOn(spyObj, 'testFn').and.callThrough();

        service.beforeEdit(spyObj.testFn, id, null).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(id, {});
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeEdit(testFn, id, resource).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('executeAction', () => {
      const resource = { name: 'Name' };
      const id = '1';

      it('should get data from a function', fakeAsync(() => {
        const action = () => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });

        service['executeAction']<{ newUrl: string; allowAction: boolean }>({ action, resource }).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
        });

        tick();
      }));

      it('should return empty object if action is undefined', fakeAsync(() => {
        const action = undefined;

        service['executeAction']({ action }).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));

      it('should get data from a api with `ID` and `resource`', fakeAsync(() => {
        const action = '/test/remove';

        service['executeAction']<{ newUrl: string; allowAction: boolean }>({ action, resource, id }).subscribe(
          response => {
            expect(response.newUrl).toBe('/newurl');
            expect(response.allowAction).toBeTrue();
          }
        );

        const req = httpMock.expectOne(request => request.url === '/test/remove/1');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(resource);
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

        req.flush({
          newUrl: '/newurl',
          allowAction: true
        });

        tick();
      }));

      it('should get data from a api without `ID` and `resource`', fakeAsync(() => {
        const action = '/test/new';

        service['executeAction']<{ newUrl: string; allowAction: boolean }>({ action }).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/test/new');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

        req.flush({
          newUrl: '/newurl',
          allowAction: true
        });

        tick();
      }));
    });
  });
});

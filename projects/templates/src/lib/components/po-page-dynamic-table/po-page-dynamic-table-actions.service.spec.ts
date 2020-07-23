import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PoPageDynamicTableActionsService } from './po-page-dynamic-table-actions.service';

describe('PoPageDynamicTableActionsService:', () => {
  let service: PoPageDynamicTableActionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageDynamicTableActionsService]
    });

    service = TestBed.inject(PoPageDynamicTableActionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service instanceof PoPageDynamicTableActionsService).toBeTruthy();
  });

  describe('Methods: ', () => {
    describe('beforeNew:', () => {
      it('should get data from a api', fakeAsync(() => {
        service.beforeNew('/teste/new').subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/teste/new');
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

        service.beforeNew(testFn).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeNew(testFn).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('beforeDetail:', () => {
      const id = '5';

      const resource = {
        name: 'Gabriel',
        age: 3
      };

      it('should get data from a api', fakeAsync(() => {
        service.beforeDetail('/teste/new', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === `/teste/new/${id}`);
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
        const testFn = () => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });

        service.beforeDetail(testFn, id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeDetail(testFn, '1', {}).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('beforeRemove:', () => {
      const id = '5';

      const resource = {
        name: 'Gabriel',
        age: 3
      };

      it('should get data from a api', fakeAsync(() => {
        service.beforeRemove('/teste/new', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === `/teste/new/${id}`);
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
        const testFn = () => ({
          newUrl: '/newurlfromfunction',
          allowAction: true
        });

        service.beforeRemove(testFn, id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeRemove(testFn, '1', {}).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('beforeRemoveAll:', () => {
      const resources = [
        {
          name: 'Gabriel',
          age: 3
        },
        {
          name: 'Mario',
          age: 5
        }
      ];

      it('should get data from a api', fakeAsync(() => {
        service.beforeRemoveAll('/teste/remove', resources).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === `/teste/remove`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(resources);
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
          allowAction: true,
          resources
        });

        service.beforeRemoveAll(testFn, resources).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(response.resources).toEqual(resources);
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeRemoveAll(testFn, [{}]).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });

    describe('customAction:', () => {
      const resource = {
        name: 'User',
        age: 40
      };

      it('should send resource to api', fakeAsync(() => {
        service.customAction('/customAction', resource).subscribe();

        const req = httpMock.expectOne(request => request.url === `/customAction`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(resource);
        expect(req.request.headers.get('X-PO-SCREEN-LOCK')).toBe('true');

        req.flush({});

        tick();
      }));

      it('should send resource to function', done => {
        const testFn = jasmine.createSpy('customAction');

        service.customAction(testFn, resource).subscribe(() => {
          expect(testFn).toHaveBeenCalledWith(resource);
          done();
        });
      });

      it('should send empty array to function if resource is undefined', done => {
        const testFn = jasmine.createSpy('customAction');

        service.customAction(testFn).subscribe(() => {
          expect(testFn).toHaveBeenCalledWith([]);
          done();
        });
      });
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

    describe('beforeDuplicate:', () => {
      const resource = { name: 'Name' };
      const id = '1';

      it('should get data from a api', fakeAsync(() => {
        service.beforeDuplicate('/test/duplicate', id, resource).subscribe(response => {
          expect(response.newUrl).toBe('/newurl');
          expect(response.allowAction).toBeTrue();
        });

        const req = httpMock.expectOne(request => request.url === '/test/duplicate/1');
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

        service.beforeDuplicate(spyObj.testFn, id, resource).subscribe(response => {
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

        service.beforeDuplicate(spyObj.testFn, id, null).subscribe(response => {
          expect(response.newUrl).toBe('/newurlfromfunction');
          expect(response.allowAction).toBeTrue();
          expect(spy).toHaveBeenCalledWith(id, {});
        });

        tick();
      }));

      it('should not get data from undefined', fakeAsync(() => {
        const testFn = undefined;
        service.beforeDuplicate(testFn, id, resource).subscribe(response => {
          expect(response).toEqual({});
        });

        tick();
      }));
    });
  });
});

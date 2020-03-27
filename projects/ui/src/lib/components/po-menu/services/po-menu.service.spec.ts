import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { PoMenuService } from './po-menu.service';

describe('PoMenuService:', () => {
  let menuService: PoMenuService;
  let httpMock: HttpTestingController;

  const mockURL = 'https://po-ui.io/sample/api/menus';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoMenuService]
    });

    menuService = TestBed.inject(PoMenuService);
    httpMock = TestBed.inject(HttpTestingController);

    menuService['_url'] = 'https://po-ui.io/sample/api/menus';
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Methods:', () => {
    const itemsFiltered = [{ label: 'Menu', link: '/menu' }];
    const expectedResponse = {
      items: itemsFiltered
    };
    const search = 'menu';

    it('configProperties: should set url', () => {
      const url = 'http://po.com.br';

      menuService.configProperties(url);

      expect(menuService.url).toBe(url);
    });

    it('getFilteredData: should call `http.get` and return items filtered', done => {
      menuService['_url'] = 'https://po-ui.io/sample/api/menus';

      menuService.getFilteredData(search).subscribe(response => {
        expect(response).toEqual(itemsFiltered);
        done();
      });

      httpMock
        .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
        .flush(expectedResponse);
    });

    it('getFilteredData: should call `http.get` with search and params', done => {
      const params = { product: 'hcm' };

      const filterParams = {
        search,
        ...params
      };

      const spyHttpGet = spyOn(menuService['http'], 'get').and.callThrough();

      menuService.getFilteredData(search, params).subscribe(response => {
        expect(response).toEqual(itemsFiltered);
        expect(spyHttpGet).toHaveBeenCalledWith(menuService.url, { params: filterParams });
        done();
      });

      httpMock
        .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
        .flush(expectedResponse);
    });
  });
});

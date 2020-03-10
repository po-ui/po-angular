import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { PoBreadcrumbFavoriteService } from './po-breadcrumb-favorite.service';

describe('PoBreadcrumbFavoriteService:', () => {
  let breadcrumbFavoriteService: PoBreadcrumbFavoriteService;
  let httpMock: HttpTestingController;

  const params = { name: 'Marie', age: '38' };
  const item = { label: 'Documentation', link: 'documentation/' };
  const statusBreadcrumbItem = { isFavorite: false, url: 'link-breadcrumb/123' };
  const bodyResquest = {
    isFavorite: false,
    url: item.link,
    params: params
  };
  const mockURL = 'favorite/test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoBreadcrumbFavoriteService]
    });

    breadcrumbFavoriteService = TestBed.inject(PoBreadcrumbFavoriteService);
    httpMock = TestBed.inject(HttpTestingController);

    breadcrumbFavoriteService.configService(mockURL, params, item);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should set values initial service', () => {
    expect(breadcrumbFavoriteService.url).toEqual(mockURL);
    expect(breadcrumbFavoriteService.bodyParams).toEqual(bodyResquest);
  });

  it('should return the favorite status of breadcrumb item', done => {
    breadcrumbFavoriteService.getFavorite().subscribe(response => {
      expect(response).toEqual(statusBreadcrumbItem);
      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.url === mockURL && req.method === 'GET')
      .flush(statusBreadcrumbItem);
  });

  it('should set breadcrumb item with favorite', done => {
    statusBreadcrumbItem.isFavorite = true;

    breadcrumbFavoriteService.sendStatusFavorite(true).subscribe(response => {
      expect(response).toEqual(statusBreadcrumbItem);
      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.body.params === params && req.url === mockURL && req.method === 'POST')
      .flush(statusBreadcrumbItem);
  });

  it('should set breadcrumb item with unfavorite', done => {
    statusBreadcrumbItem.isFavorite = false;

    breadcrumbFavoriteService.sendStatusFavorite(false).subscribe(response => {
      expect(response).toEqual(statusBreadcrumbItem);
      done();
    });

    httpMock
      .expectOne((req: HttpRequest<any>) => req.body.params === params && req.url === mockURL && req.method === 'POST')
      .flush(statusBreadcrumbItem);
  });
});

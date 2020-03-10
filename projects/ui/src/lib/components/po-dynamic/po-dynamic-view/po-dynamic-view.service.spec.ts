import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PoDynamicViewService } from './po-dynamic-view.service';

describe('PoDynamicViewService:', () => {
  let httpMock: HttpTestingController;
  let poDynamicViewService: PoDynamicViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoDynamicViewService]
    });

    poDynamicViewService = TestBed.inject(PoDynamicViewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poDynamicViewService).toBeTruthy();
    expect(poDynamicViewService instanceof PoDynamicViewService).toBeTruthy();
  });

  describe('Methods', () => {
    it('onLoad: should call POST method with `url` and `value`', () => {
      const url = 'url';
      const value = {};
      const expectedResponse = { value: {}, fields: [] };

      poDynamicViewService.onLoad(url, value).then(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${url}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });
  });
});

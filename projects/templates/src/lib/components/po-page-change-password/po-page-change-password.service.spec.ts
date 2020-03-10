import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { PoPageChangePasswordService } from './po-page-change-password.service';

describe('PoPageChangePasswordService:', () => {
  let poPageChangePasswordService: PoPageChangePasswordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageChangePasswordService]
    });

    poPageChangePasswordService = TestBed.inject(PoPageChangePasswordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poPageChangePasswordService).toBeTruthy();
    expect(poPageChangePasswordService instanceof PoPageChangePasswordService).toBeTruthy();
  });

  describe('Methods', () => {
    it('post: should call `POST` method', () => {
      const url = 'url';
      const data = { 'newPassword': 'new' };
      const expectedResponse = { 'body': {}, 'status': '204', 'statusText': 'OK' };

      poPageChangePasswordService.post(url, data).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${url}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });
  });
});

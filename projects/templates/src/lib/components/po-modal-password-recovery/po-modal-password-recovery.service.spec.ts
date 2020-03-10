import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PoModalPasswordRecoveryService } from './po-modal-password-recovery.service';

describe('PoModalPasswordRecoveryService:', () => {
  let poModalPasswordRecoveryService: PoModalPasswordRecoveryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoModalPasswordRecoveryService]
    });

    poModalPasswordRecoveryService = TestBed.inject(PoModalPasswordRecoveryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poModalPasswordRecoveryService).toBeTruthy();
    expect(poModalPasswordRecoveryService instanceof PoModalPasswordRecoveryService).toBeTruthy();
  });

  describe('Methods', () => {
    it('post: should call `POST` method', () => {
      const urlRecovery = 'url';
      const data = { 'email': 'email@email.com' };
      const expectedResponse = { 'body': {}, 'status': '', 'statusText': 'OK' };

      poModalPasswordRecoveryService.post(urlRecovery, data).subscribe(response => {
        expect(response).toBeDefined();
      });

      const req = httpMock.expectOne(`${urlRecovery}`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });
  });
});

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { PoPageLoginAuthenticationType } from './enums/po-page-login-authentication-type.enum';
import { PoPageLoginService } from './po-page-login.service';

describe('PoPageLoginService:', () => {
  let httpMock: HttpTestingController;
  let poPageLoginService: PoPageLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PoPageLoginService]
    });

    poPageLoginService = TestBed.inject(PoPageLoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(poPageLoginService).toBeTruthy();
    expect(poPageLoginService instanceof PoPageLoginService).toBeTruthy();
  });

  describe('Methods', () => {
    it('post: should call POST method with url, loginForm and headers if type is Basic', () => {
      const type = PoPageLoginAuthenticationType.Basic;
      const url = 'url';
      const loginForm = {
        login: 'po@po-ui.com',
        password: '123@456',
        rememberUser: false
      };
      const resource = { headers: { 'Authorization': 'basic (user:password)' }, body: { rememberUser: false } };

      poPageLoginService.onLogin(url, type, loginForm).subscribe(response => {
        expect(response).toEqual(resource);
      });

      const req = httpMock.expectOne(`${url}`);
      expect(req.request.method).toBe('POST');
      req.flush(resource);
    });

    it('post: should call POST method with url and loginForm if type is Bearer', () => {
      const type = PoPageLoginAuthenticationType.Bearer;
      const url = 'url';
      const loginForm = {
        login: 'po@po-ui.com',
        password: '123@456',
        rememberUser: false
      };
      const resource = { body: {} };

      poPageLoginService.onLogin(url, type, loginForm).subscribe(response => {
        expect(response).toEqual(resource);
      });

      const req = httpMock.expectOne(`${url}`);
      expect(req.request.method).toBe('POST');
      req.flush(resource);
    });
  });
});

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoPageLogin } from './interfaces/po-page-login.interface';
import { PoPageLoginAuthenticationType } from './enums/po-page-login-authentication-type.enum';

@Injectable()
export class PoPageLoginService {
  constructor(private http: HttpClient) {}

  onLogin(url: string, type: PoPageLoginAuthenticationType, loginForm: PoPageLogin): Observable<Object> {
    if (type === PoPageLoginAuthenticationType.Bearer) {
      loginForm.password = btoa(loginForm.password);
      return this.http.post(url, loginForm);
    } else {
      const user = `(${loginForm.login}:${loginForm.password})`;
      const headers = new HttpHeaders({
        'Authorization': `${type} ` + btoa(user)
      });
      delete loginForm.login;
      delete loginForm.password;
      return this.http.post(url, loginForm, { headers });
    }
  }
}

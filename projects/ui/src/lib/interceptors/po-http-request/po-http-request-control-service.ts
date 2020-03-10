import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * @docsPrivate
 *
 * Serviço responsável por efetuar o controle de interação com o serviço de interceptor `PoHttpRequestInterceptorService`
 * gerenciando o seu estado.
 */
@Injectable()
export class PoHttpRequesControltService {
  controlHttpRequest: Subject<number> = new Subject<number>();

  getControlHttpRequest(): Observable<any> {
    return this.controlHttpRequest.asObservable();
  }

  send(value: number = 0) {
    this.controlHttpRequest.next(value);
  }
}

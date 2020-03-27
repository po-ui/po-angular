import { ComponentRef, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoLoadingOverlayComponent } from '../../components/po-loading/po-loading-overlay/po-loading-overlay.component';

import { PoHttpRequesControltService } from './po-http-request-control-service';

const noCountPendingRequests = 'X-PO-No-Count-Pending-Requests';
const screenLock = 'X-PO-Screen-Lock';

/**
 * @description
 *
 * O serviço PO Http Request Interceptor realiza a contabilização de requisições pendentes na aplicação.
 *
 * Existe a possibilidade de não efetuar a contabilização das requisições pendentes, utilizando o parâmetro
 * `X-PO-No-Count-Pending-Requests`. Para isso deve ser informado no cabeçalho da requisição com o valor `'true'`,
 * por exemplo:
 *
 * ```
 * ...
 *  const headers = { 'X-PO-No-Count-Pending-Requests': 'true' };
 *
 *  this.http.get(`/customers/1`, { headers: headers });
 * ...
 *
 * ```
 * Para obter a quantidade de requisições pendentes, deve inscrever-se no método `getCountPendingRequests` do
 * serviço `PoHttpRequestInterceptorService`, com isso, ao realizar requisições utilizando `HttpClient`,
 * será retornado a quantidade de requisições pendentes.
 *
 * Também existe a possibildade de travar a tela e mostrar uma imagem de _loading_ durante o processamento de uma requisição
 * deve-se passar o parâmetro `X-PO-Screen-Lock` no cabeçalho da requisição com valor `'true'`.
 *
 * por exemplo:
 *
 * ```
 * ...
 *  const headers = { 'X-PO-Screen-Lock': 'true' };
 *
 *  this.http.get(`/customers/1`, { headers: headers });
 * ...
 *
 * ```
 * > Após a validação no interceptor, o parâmetro será removido do cabeçalho da requisição.
 *
 * Ao importar o módulo `PoModule` na aplicação, o `po-http-request-interceptor` é automaticamente configurado sem a necessidade
 * de qualquer configuração extra.
 *
 *
 * Segue abaixo um exemplo de uso:
 *
 * ```
 * import { HttpClient } from '@angular/common/http';
 *
 * ...
 *
 * @Injectable()
 * export class CustomersService {
 *
 *  headers = { 'X-PO-No-Count-Pending-Requests': true, 'X-PO-Screen-Lock': 'true' }
 *  pendingRequests: number = 0;
 *  subscription: Subscription;
 *
 *  constructor(
 *    private http: HttpClient,
 *    private httpRequestInterceptor: PoHttpRequestInterceptorService) { }
 *
 *  ngOnDestroy(): void {
 *    this.subscription.unsubscribe();
 *  }
 *
 *  ngOnInit(): void {
 *    this.subscription = this.httpRequestInterceptor.getCountPendingRequests().subscribe(data => {
 *      this.pendingRequests = data;
 *    });
 *  }
 *
 *  getCustomers() {
 *    return this.http.get(`/customers/1`, { headers: headers });
 *  }
 *
 *  ...
 *
 * }
 * ```
 *
 * @example
 * <example name='po-http-request-interceptor-labs' title='PO Http Request Interceptor Labs'>
 *  <file name='sample-po-http-request-interceptor-labs.component.ts'> </file>
 *  <file name='sample-po-http-request-interceptor-labs.component.html'> </file>
 * </example>
 */
@Injectable({
  providedIn: 'root'
})
export class PoHttpRequestInterceptorService implements HttpInterceptor {
  private loadingOverlayComponent: ComponentRef<PoLoadingOverlayComponent> = undefined;

  private pendingRequests: number = 0;
  private overlayRequests: number = 0;

  constructor(
    private controlHttpRequest: PoHttpRequesControltService,
    private poComponentInjector: PoComponentInjectorService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const requestClone = request.clone();

    request = this.requestCloneWithoutHeaderParam([noCountPendingRequests, screenLock], request);

    this.setCountPendingRequests(true, requestClone);
    this.setCountOverlayRequests(true, requestClone);

    return next.handle(request).pipe(
      tap((response: HttpEvent<any>) => {
        if (response instanceof HttpResponse) {
          this.setCountPendingRequests(false, requestClone);
          this.setCountOverlayRequests(false, requestClone);
        }
      }),
      catchError(error => {
        this.setCountPendingRequests(false, requestClone);
        this.setCountOverlayRequests(false, requestClone);

        return throwError(error);
      })
    );
  }

  getCountPendingRequests(): Observable<any> {
    return this.controlHttpRequest.getControlHttpRequest();
  }

  private buildLoading() {
    if (!this.loadingOverlayComponent) {
      this.loadingOverlayComponent = this.poComponentInjector.createComponentInApplication(PoLoadingOverlayComponent);
      this.loadingOverlayComponent.instance.screenLock = true;
      this.loadingOverlayComponent.instance.changeDetector.detectChanges();
    }
  }

  private destroyLoading() {
    if (this.loadingOverlayComponent) {
      this.poComponentInjector.destroyComponentInApplication(this.loadingOverlayComponent);
      this.loadingOverlayComponent = undefined;
    }
  }

  private requestCloneWithoutHeaderParam(headersParams: Array<string>, request: HttpRequest<any>): HttpRequest<any> {
    let isRequestClone = false;

    headersParams.forEach(headerParam => {
      if (request.headers.has(headerParam)) {
        request.headers.delete(headerParam);
        isRequestClone = true;
      }
    });

    return isRequestClone ? request.clone({ headers: request.headers }) : request;
  }

  private setCountPendingRequests(isIncrement: boolean, request: HttpRequest<any>) {
    const hasCountPendingRequestHeaderParam = request.headers.has(noCountPendingRequests);
    const headerParam = request.headers.get(noCountPendingRequests);

    if (hasCountPendingRequestHeaderParam && headerParam.toString().toLowerCase() === 'true') {
      return;
    }

    this.pendingRequests += isIncrement ? 1 : -1;
    this.controlHttpRequest.send(this.pendingRequests);
  }

  private setCountOverlayRequests(isIncrement: boolean, request: HttpRequest<any>) {
    const hasOverlayRequestHeaderParam = request.headers.has(screenLock);

    if (hasOverlayRequestHeaderParam) {
      const headerParam = request.headers.get(screenLock);

      if (headerParam.toString().toLowerCase() === 'false') {
        return;
      }

      this.overlayRequests += isIncrement ? 1 : -1;
      this.overlayRequests > 0 ? this.buildLoading() : this.destroyLoading();
    }
  }
}

import { ComponentRef } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoHttpInterceptorDetail } from './po-http-interceptor-detail/po-http-interceptor-detail.interface';
import { PoHttpInterceptorDetailComponent } from './po-http-interceptor-detail/po-http-interceptor-detail.component';

// DEPRECATED 4.x.x
const NO_ERROR_HEADER_PARAM = 'X-Portinari-No-Error';
const NO_MESSAGE_HEADER_PARAM = 'X-Portinari-No-Message';

/**
 * @description
 *
 * O serviço Portinari Http Interceptor realiza o tratamento de requisições HTTP conforme o padrão do
 * [**Guia de implementação das APIs TOTVS**](http://tdn.totvs.com/pages/viewpage.action?pageId=484701395) para adaptá-lo
 * ao modelo do PO.
 *
 * Ao analisar o objeto `_messages` retornado pela requisição, o serviço exibirá notificações com mensagens na tela.
 * Os retornos de erros com códigos 4xx e 5xx são tratados automaticamente, sem a necessidade de incluir o `_messages`.
 *
 * É possível dispensar a notificação para o usuário utilizando-se no cabeçalho da requisição os parâmetros listados abaixo com o valor
 * igual a `true`:
 *
 * - `X-Portinari-No-Message`: Não exibe notificações de erro e/ou sucesso.
 *
 * - **Depreciado** `X-Portinari-No-Error`: não mostra notificações de erro com códigos `4xx` e `5xx`.
 *
 * ```
 * ...
 *  const headers = { 'X-Portinari-No-Message': 'true' };
 *
 *  this.http.get(`/customers/1`, { headers: headers });
 * ...
 *
 * ```
 *
 * Mais detalhes no tópico sobre cabeçalhos customizados no
 * [**Guia de implementação das APIs TOTVS**](http://tdn.totvs.com/pages/viewpage.action?pageId=484701395)
 *
 * > Após a validação no interceptor, os parâmetros serão removidos do cabeçalho da requisição.
 *
 * O `Content-Type` deve ser `application/json` e a estrutura de mensagem recebida pelo serviço deve seguir o
 * [**Guia de implementação das APIs TOTVS**](http://tdn.totvs.com/pages/viewpage.action?pageId=484701395)
 * (em Mensagens de sucesso para coleções), exemplo:
 *  - _messages: lista de mensagens ou objeto de mensagem, resultante do serviço.
 *    - type: success, warning, error, e information (será exibido a `tag` apenas se esta propriedade possuir valor);
 *    - code: título ou código da mensagem;
 *    - message: texto da mensagem;
 *    - detailedMessage: detalhamento do erro ou informativo;
 *
 * Ao clicar na ação 'Detalhes' no
 * [`po-notification`](/documentation/po-notification) os detalhes das mensagens de sucesso e de erro são apresentados em
 * um [`po-modal`](/documentation/po-modal) com um [`po-accordion`](/documentation/po-accordion) que possui um item por mensagem.
 *
 * Ao importar o módulo `PoModule` na aplicação, o `po-http-interceptor` é automaticamente configurado sem a necessidade
 * de qualquer configuração extra.
 *
 * Ao realizar requisições utilize o `HttpClient`, conforme exemplo abaixo:
 *
 * ```
 * import { HttpClient } from '@angular/common/http';
 *
 * ...
 *
 * @Injectable()
 * export class UserService {
 *
 *   constructor(private http: HttpClient) { }
 *
 *   getUsers() {
 *     return this.http.get('/api/users');
 *   }
 *
 *   ...
 *
 * }
 * ```
 *
 */
export abstract class PoHttpInterceptorBaseService implements HttpInterceptor {

  notificationTypes = ['success', 'warning', 'error', 'information'];

  private httpInterceptorDetailComponent: ComponentRef<PoHttpInterceptorDetailComponent> = undefined;

  constructor(private componentInjector: PoComponentInjectorService, private notification: any) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloneRequest = request.clone();

    request = request && this.hasParameters(request) ? this.cloneRequestWithoutParameters(request) : request;

    return next.handle(request).pipe(tap((response: HttpEvent<any>) => {

      if (response instanceof HttpResponse) {

        this.processResponse(response, cloneRequest);

      }
    }, (error: HttpErrorResponse) => {

      this.processErrorResponse(error, cloneRequest);

    }));
  }

  processResponse(response: HttpResponse<any>, request: HttpRequest<any>) {
    const hasNoMessageParam = this.hasNoMessageParam(request);

    if (!hasNoMessageParam && response.body && response.body._messages) {

      const messages = response.body._messages;

      if (messages instanceof Array) {
        messages.forEach((message: PoHttpInterceptorDetail) => {
          this.showNotification(message);
        });
      } else {
        this.showNotification(messages);
      }
    }
  }

  processErrorResponse(response: HttpErrorResponse, request: HttpRequest<any>) {
    const errorResponse = response.status !== 0
      ? response.error
      : { code: 0, message: 'Servidor não está respondendo.', detailedMessage: response.message };

    const hasNoErrorParam = this.hasNoErrorParam(request);
    const hasNoMessageParam = this.hasNoMessageParam(request);

    if (errorResponse && errorResponse.message && !hasNoErrorParam && !hasNoMessageParam) {
      this.showNotification({ ...errorResponse, type: 'error' });
    }
  }

  private cloneRequestWithoutParameters(request: HttpRequest<any>): HttpRequest<any> {
    const headers = request.headers
      .delete(NO_ERROR_HEADER_PARAM)
      .delete(NO_MESSAGE_HEADER_PARAM);

    return request.clone({ headers });
  }

  private createModal(responseMessage: PoHttpInterceptorDetail) {
    const details = responseMessage.details ? [ responseMessage, ...responseMessage.details ] : [ responseMessage ];

    this.httpInterceptorDetailComponent = this.componentInjector.createComponentInApplication(PoHttpInterceptorDetailComponent);
    this.httpInterceptorDetailComponent.instance.detail = details;
    this.httpInterceptorDetailComponent.instance.closed.subscribe(() => this.destroyModal());
    this.httpInterceptorDetailComponent.instance.open();
  }

  private destroyModal() {
    if (this.httpInterceptorDetailComponent) {
      this.componentInjector.destroyComponentInApplication(this.httpInterceptorDetailComponent);
      this.httpInterceptorDetailComponent = undefined;
    }
  }

  private hasMessage(responseMessage: PoHttpInterceptorDetail) {
    const hasMessageProperties = responseMessage.message;

    return responseMessage && hasMessageProperties;
  }

  private hasNoErrorParam(request: HttpRequest<any>): boolean {
    const noErrorParam = request && request.headers.get(NO_ERROR_HEADER_PARAM);

    return noErrorParam && noErrorParam.toString().toLocaleLowerCase() === 'true';
  }

  private hasNoMessageParam(request: HttpRequest<any>): boolean {
    const noMessageParam = request && request.headers.get(NO_MESSAGE_HEADER_PARAM);

    return noMessageParam && noMessageParam.toString().toLocaleLowerCase() === 'true';
  }

  private hasParameters(request: HttpRequest<any>) {
    return request.headers.has(NO_ERROR_HEADER_PARAM) || request.headers.has(NO_MESSAGE_HEADER_PARAM);
  }

  private showNotification(response: any) {

    if (!this.hasMessage(response)) {
      return;
    }

    const typeNotification = this.notificationTypes.includes(response.type) ? response.type : 'information';

    const notificationAction = this.generateNotificationAction(response);

    this.notification[typeNotification]({
      message: response.message,
      actionLabel: notificationAction.label,
      action: notificationAction.action
    });
  }

  private generateDetailModal(responseMessage: any) {
    return () => {
      if (!this.httpInterceptorDetailComponent) {
        this.createModal(responseMessage);
      }
    };
  }

  private generateNotificationAction(responseMessage: any) {

    let notificationAction;
    let notificationLabel;

    if (responseMessage.helpUrl && !(responseMessage.detailedMessage || responseMessage.details)) {
      notificationLabel = 'Ajuda';
      notificationAction = this.generateUrlHelpFunction(responseMessage.helpUrl);

    } else if (responseMessage.detailedMessage || responseMessage.details) {
      notificationLabel = 'Detalhes';
      notificationAction = this.generateDetailModal(responseMessage);
    }
    return { label: notificationLabel, action: notificationAction };
  }

  private generateUrlHelpFunction(helpUrl: string) {
    return () => { window.open(helpUrl, '_blank'); };
  }

}

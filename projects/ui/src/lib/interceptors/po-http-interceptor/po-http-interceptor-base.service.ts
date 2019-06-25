import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpEvent, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const NO_ERROR_HEADER_PARAM = 'X-Portinari-No-Error';

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
 * Também existe a possibilidade de não apresentar a notificação quando houver algum erro com códigos 4xx e 5xx,
 * utilizando o parâmetro `X-Portinari-No-Error` que foi definido conforme o
 * [**Guia de implementação das APIs TOTVS**](http://tdn.totvs.com/pages/viewpage.action?pageId=484701395) (em Cabeçalhos Customizados).
 * O parâmetro `X-Portinari-No-Error` deve ser informado no cabeçalho da requisição com o valor `'true'` para funcionar corretamente,
 * por exemplo:
 *
 * ```
 * ...
 *  const headers = { 'X-Portinari-No-Error': 'true' };
 *
 *  this.http.get(`/customers/1`, { headers: headers });
 * ...
 *
 * ```
 * > Após a validação no interceptor, o parâmetro será removido do cabeçalho da requisição.
 *
 * O `Content-Type` deve ser `application/json` e a estrutura de mensagem recebida pelo serviço deve seguir o
 * [**Guia de implementação das APIs TOTVS**](http://tdn.totvs.com/pages/viewpage.action?pageId=484701395)
 * (em Mensagens de sucesso para coleções), exemplo:
 *  - _messages: lista de mensagens de erro ou informativo resultante do serviço.
 *    - type: success, warning, error, e information;
 *    - code: título ou código da mensagem;
 *    - message: texto da mensagem;
 *    - detailedMessage: detalhamento do erro ou informativo;
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

  constructor(private notification: any, private dialog: any) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloneRequest = request.clone();

    request = request.headers.has(NO_ERROR_HEADER_PARAM) ? this.cloneRequestWithoutNoErrorHeaderParam(request) : request;

    return next.handle(request).pipe(tap((response: HttpEvent<any>) => {

      if (response instanceof HttpResponse) {

        this.processResponse(response);

      }
    }, (error: HttpErrorResponse) => {

      this.processErrorResponse(error, cloneRequest);

    }));
  }

  processResponse(response: HttpResponse<any>) {
    if (response.body && response.body._messages) {

      const messages = response.body._messages;

      if (messages instanceof Array) {
        messages.forEach((message: any) => {
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

    // not show the notification when has NoError parameter on header of request.
    if (errorResponse && errorResponse.message && !hasNoErrorParam) {
      this.showNotification({ ...errorResponse, type: 'error' });
    }
  }

  private cloneRequestWithoutNoErrorHeaderParam(request: HttpRequest<any>): HttpRequest<any> {
    return request && request.clone({headers: request.headers.delete(NO_ERROR_HEADER_PARAM)});
  }

  private hasNoErrorParam(request: HttpRequest<any>): boolean {
    const noErrorParam = request && request.headers.get(NO_ERROR_HEADER_PARAM);

    return noErrorParam && noErrorParam.toString().toLocaleLowerCase() === 'true';
  }

  private showNotification(response: any) {
    const typeNotification = this.notificationTypes.includes(response.type) ? response.type : 'information';

    const notificationAction = this.generateNotificationAction(response);

    this.notification[typeNotification]({
      message: response.message,
      actionLabel: notificationAction.label,
      action: notificationAction.action
    });
  }

  private generateNotificationAction(errorResponse: any) {

    let notificationAction;
    let notificationLabel;

    let notificationMessage = errorResponse.message.concat(` ${errorResponse.detailedMessage}`);

    if (errorResponse.details && errorResponse.details instanceof Array) {
      errorResponse.details.forEach((detailError: any) => {
        notificationMessage += `\n${detailError.message}`;
      });
    }

    if (errorResponse.helpUrl && !(errorResponse.detailedMessage || errorResponse.details)) {
      notificationLabel = 'Ajuda';
      notificationAction = this.generateUrlHelpFunction(errorResponse.helpUrl);

    } else if (errorResponse.detailedMessage || errorResponse.details) {
      notificationLabel = 'Detalhes';
      notificationAction = this.generateDialogDetailFunction(errorResponse, notificationMessage);
    }
    return { label: notificationLabel, action: notificationAction };
  }

  private generateUrlHelpFunction(helpUrl: string) {
    return () => { window.open(helpUrl, '_blank'); };
  }

  private generateDialogDetailFunction(errorResponse: any, notificationMessage: string) {
    return () => {
      this.dialog.alert({
        title: errorResponse.code,
        message: notificationMessage,
        ok: errorResponse.helpUrl ? this.generateUrlHelpFunction(errorResponse.helpUrl) : undefined
      });
    };
  }
}

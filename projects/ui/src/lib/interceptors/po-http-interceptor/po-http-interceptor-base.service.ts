import { ComponentRef } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PoComponentInjectorService } from '../../services/po-component-injector/po-component-injector.service';
import { PoHttpInterceptorDetail } from './po-http-interceptor-detail/po-http-interceptor-detail.interface';
import { PoHttpInterceptorDetailComponent } from './po-http-interceptor-detail/po-http-interceptor-detail.component';
import { poHttpInterceptorLiterals } from './po-http-interceptor-literals';
import { PoLanguageService } from '../../services/po-language/po-language.service';

const NO_ERROR_HEADER_PARAM = 'X-PO-No-Error';
const NO_MESSAGE_HEADER_PARAM = 'X-PO-No-Message';

/**
 * @description
 *
 * O *interceptor* tem a finalidade de exibir notificações com mensagens na tela, baseado nas respostas das requisições HTTP.
 *
 * Pode ser utilizado para dar feedback das ações do usuário como, por exemplo: erro de autorização, mensagens de regras de negócio,
 * atualizações de registros, erro quando o servidor estiver indisponível e entre outros.
 *
 * ## Configuração
 *
 * Para o correto funcionamento do interceptor `po-http-interceptor`, deve ser importado o `BrowserAnimationsModule` no
 * módulo principal da sua aplicação.
 *
 * Módulo da aplicação:
 * ```
 * import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 * import { PoModule } from '@po-ui/ng-components';
 * ...
 *
 * @NgModule({
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     ...
 *     PoModule
 *   ],
 *   declarations: [
 *     AppComponent,
 *     ...
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
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
 * ## Como usar
 *
 * Para exibir as noticações é necessário informar a mensagem no retorno da requisição. A estrutura da mensagem
 * é feita com base no status da resposta, conforme será apresentado nos próximos tópicos.
 *
 * ### Estrutura das mensagens
 *
 * #### Mensagens de sucesso `2xx`
 *
 * Para exibir mensagens ao retornar uma lista ou um item, deve-se incluir a propriedade `_messages` no objeto de retorno.
 * Por exemplo:
 * ```
 * {
 *   "_messages": [
 *     {
 *       "type": "success" || "warning" || "error" || "information" (será exibido a `tag` apenas se esta propriedade possuir valor),
 *       "code": "título ou código da mensagem",
 *       "message": "texto da mensagem",
 *       "detailedMessage": "detalhamento da mensagem"
 *     }
 *   ]
 * }
 * ```
 *
 * #### Mensagens de erro `4xx` ou `5xx`
 *
 * Ao retornar erro, o objeto não necessita ter `_messages`, deve-se retornar o objeto diretamente:
 *
 * ```
 * {
 *    "code": "título ou código da mensagem",
 *    "message": "texto da mensagem",
 *    "detailedMessage": "detalhamento da mensagem"
 * }
 * ```
 *
 * Também é possível informar as seguintes propriedades:
 *
 * - `helpUrl`: link para a documentação do erro;
 *    - Caso for informado, será exibido uma ação de "Ajuda" na notificação, para isso não deverá ter a propriedade `detailedMessage`.
 * - `type`: É possível informar `error`, `warning` e `information`, sendo `error` o valor padrão.
 * - `details`: Uma lista de objetos de mensagem (recursiva) com mais detalhes sobre a mensagem principal.
 *
 * > Veja o [Guia de implementação de APIs](guides/api) para mais detalhes sobre a estrutura das mensagens.
 *
 * ### Cabeçalho
 *
 * É possível dispensar a notificação para o usuário utilizando no cabeçalho da requisição os parâmetros listados abaixo com o valor
 * igual a `true`:
 *
 * - `X-PO-No-Message`: Não exibe notificações de erro e/ou sucesso.
 *
 * - `X-PO-No-Error`: Não mostra notificações de erro com códigos `4xx` e `5xx`.
 *
 * ```
 * ...
 *  const headers = { 'X-PO-No-Message': 'true' };
 *
 *  this.http.get(`/customers/1`, { headers: headers });
 * ...
 *
 * ```
 *
 * > Após a validação no *interceptor*, os parâmetros serão removidos do cabeçalho da requisição.
 *
 */
export abstract class PoHttpInterceptorBaseService implements HttpInterceptor {
  notificationTypes = ['success', 'warning', 'error', 'information'];

  literals = poHttpInterceptorLiterals[this.languageService.getShortLanguage()];

  private httpInterceptorDetailComponent: ComponentRef<PoHttpInterceptorDetailComponent> = undefined;

  constructor(
    private componentInjector: PoComponentInjectorService,
    private notification: any,
    private languageService: PoLanguageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const cloneRequest = request.clone();

    request = request && this.hasParameters(request) ? this.cloneRequestWithoutParameters(request) : request;

    return next.handle(request).pipe(
      tap(
        (response: HttpEvent<any>) => {
          if (response instanceof HttpResponse) {
            this.processResponse(response, cloneRequest);
          }
        },
        (error: HttpErrorResponse) => {
          this.processErrorResponse(error, cloneRequest);
        }
      )
    );
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
    const errorResponse =
      response.status !== 0
        ? response.error
        : { code: 0, message: this.literals.serverNotResponse, detailedMessage: response.message };

    const hasNoErrorParam = this.hasNoErrorParam(request);
    const hasNoMessageParam = this.hasNoMessageParam(request);
    const errorResponseValidTypes = this.notificationTypes.slice(1);

    if (errorResponse && errorResponse.message && !hasNoErrorParam && !hasNoMessageParam) {
      this.showNotification({
        ...errorResponse,
        type: errorResponseValidTypes.includes(errorResponse.type) ? errorResponse.type : 'error'
      });
    }
  }

  private cloneRequestWithoutParameters(request: HttpRequest<any>): HttpRequest<any> {
    const headers = request.headers.delete(NO_ERROR_HEADER_PARAM).delete(NO_MESSAGE_HEADER_PARAM);

    return request.clone({ headers });
  }

  private createModal(responseMessage: PoHttpInterceptorDetail) {
    const details = responseMessage.details ? [responseMessage, ...responseMessage.details] : [responseMessage];

    this.httpInterceptorDetailComponent = this.componentInjector.createComponentInApplication(
      PoHttpInterceptorDetailComponent
    );
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
      notificationLabel = this.literals.help;
      notificationAction = this.generateUrlHelpFunction(responseMessage.helpUrl);
    } else if (responseMessage.detailedMessage || responseMessage.details) {
      notificationLabel = this.literals.details;
      notificationAction = this.generateDetailModal(responseMessage);
    }
    return { label: notificationLabel, action: notificationAction };
  }

  private generateUrlHelpFunction(helpUrl: string) {
    return () => {
      window.open(helpUrl, '_blank');
    };
  }
}

import { Input, Directive } from '@angular/core';

import { PoPageBlockedUserReason } from './enums/po-page-blocked-user-reason.enum';
import { PoPageBlockedUserReasonParams } from './interfaces/po-page-blocked-user-reason-params.interface';

const PoPageBlockedUserReasonDefault: PoPageBlockedUserReason = PoPageBlockedUserReason.None;
const PoPageBlockedUserParamsDefault: PoPageBlockedUserReasonParams = { attempts: 5, days: 90, hours: 24 };

/**
 * @description
 *
 * O componente `po-page-blocked-user` é utilizado como template para tela de bloqueio de usuário.
 * É possível definir entre três tipos de telas para alertar o usuário sobre um eventual bloqueio de login.
 *
 * Cada modelo de bloqueio possui uma imagem e texto adequados à situação.
 * Os textos das telas são pré-definidos e imutáveis, porém,
 * é possível estipular parâmetros como dias, horas e tentativas de acesso esgotadas.
 *
 * Por fim, há propriedades para adição de telefone e/ou email para contato e também a definição para a url de retorno.
 *
 * Para que as imagens sejam exibidas corretamente, é necessário incluir o caminho delas ao projeto. Para isso, edite
 * o *assets* no arquivo **angular.json** da aplicação na seguinte ordem:
 * ```
 *   "assets": [
 *     "src/assets",
 *     "src/favicon.ico",
 *     {
 *       "glob": "**\/*",
 *       "input": "node_modules/@po-ui/style/images",
 *       "output": "assets/images"
 *     }
 *   ]
 * ```
 *
 * _______________
 *
 * #### Praticidade
 * O `po-page-blocked-user`, assim como suas propriedades, pode também ser transmitido diretamente pelas configuraçãos de rota e,
 * desta maneira, dispensa-se qualquer menção e/ou importação no restante da aplicação. O exemplo abaixo exemplifica
 * a forma dinâmica com a qual o template pode ser gerado se navegasse para uma rota denominada como `/access-denied`:
 *
 *
 * ```
 *   import { PoPageBlockedUserComponent, PoPageBlockedUserReason } from '@po-ui/ng-templates';
 *
 *   ...
 *   const routes: Routes = [
 *     {
 *       path: 'access-denied', component: PoPageBlockedUserComponent, data: {
 *         contactEmail: 'dev.po@po-ui.com',
 *         contactPhone: '0800 1234 000',
 *         reason: PoPageBlockedUserReason.ExpiredPassword,
 *         urlBack: '/home'
 *       }
 *     }
 *     ...
 *   ];
 *
 *   @NgModule({
 *     imports: [RouterModule.forRoot(routes)],
 *     exports: [RouterModule]
 *   })
 *   export class AppRoutingModule { }
 * ```
 *
 * > É essencial que siga a nomenclatura dos atributos exemplificados acima para sua efetiva funcionalidade.
 *
 */
@Directive()
export class PoPageBlockedUserBaseComponent {
  private _params: PoPageBlockedUserReasonParams = { ...PoPageBlockedUserParamsDefault };
  private _reason: PoPageBlockedUserReason = PoPageBlockedUserReason.None;
  private _urlBack: string = '/';

  /**
   * @optional
   *
   * @description
   *
   * Valor para o email de contato que deve ser exibido. A ação está de acordo com o protocolo MAILTO e é possível definir
   * tanto rotas internas quanto externas.
   */
  @Input('p-contact-email') contactEmail: string;

  /**
   * @optional
   *
   * @description
   *
   * Valor para o telefone de contato que deve ser exibido. A ação está de acordo com o protocolo TEL.
   *
   * > A propriedade não contem tratamento de máscara, fica a critério do desenvolvedor defini-la.
   */
  @Input('p-contact-phone') contactPhone: string;

  /**
   * @optional
   *
   * @description
   *
   * Designação de valores usados para a customização da mensagem de bloqueio.
   * Confira abaixo os valores pré-definidos.
   *
   * ```
   *  const customLiterals: PoPageBlockedUserReasonParams = {
   *    attempts: 5,
   *    days: 90,
   *    hours: 24
   *  };
   * ```
   *
   * > Salientamos a importância e atenção para configuração desses valores conforme definidos no projeto.
   *
   * > Veja os parâmetros customizáveis na interface `PoPageBlockedUserReasonParams`.
   *
   */
  @Input('p-params') set params(value: PoPageBlockedUserReasonParams) {
    if (value instanceof Object) {
      const keys = Object.keys(value);
      const newParams = { ...PoPageBlockedUserParamsDefault };

      keys.forEach(key => {
        newParams[key] = value[key];
      });

      this._params = newParams;
    } else {
      this._params = { ...PoPageBlockedUserParamsDefault };
    }
  }

  get params() {
    return this._params;
  }

  /** Caminho para a logomarca localizada na parte superior, caso não seja definida ou seja inválida assume a logo padrão do PO UI. */
  @Input('p-logo') logo?: string;

  /**
   * @optional
   *
   * @description
   *
   * Definição de motivo de bloqueio de usuário. As informações modificam conforme o motivo selecionado.
   *
   * > Veja os valores válidos no *enum* `PoPageBlockedUserReason`.
   *
   * @default `PoPageBlockedUserReason.None`
   */
  @Input('p-reason') set reason(value: PoPageBlockedUserReason) {
    this._reason = (<any>Object).values(PoPageBlockedUserReason).includes(value)
      ? value
      : PoPageBlockedUserReasonDefault;
  }

  get reason() {
    return this._reason;
  }

  /**
   * @optional
   *
   * @description
   *
   * Caminho para a logomarca localizada no rodapé.
   */
  @Input('p-secondary-logo') secondaryLogo?: string;

  /**
   * @optional
   *
   * @description
   *
   * URL para a ação de retorno da página.
   *
   * @default `/`
   */
  @Input('p-url-back') set urlBack(url: string) {
    this._urlBack = url;
  }

  get urlBack() {
    return this._urlBack;
  }
}

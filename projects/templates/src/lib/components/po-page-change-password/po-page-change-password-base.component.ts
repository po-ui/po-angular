import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { PoModalAction } from '@po-ui/ng-components';

import { convertToBoolean, isExternalLink, isTypeof } from '../../utils/util';

import { PoPageChangePasswordRecovery } from './interfaces/po-page-change-password-recovery.interface';
import { PoPageChangePasswordRequirement } from './interfaces/po-page-change-password-requirement.interface';

/**
 * @description
 *
 * O componente `po-page-change-password` é utilizado como template para tela de cadastro ou alteração de senha.
 *
 * Apresenta dicas e regras para senhas mais seguras e também possibilidade de personalizar o redirecionamento para as telas
 * 'esqueceu a senha', 'voltar' e 'entrar no sistema'. Os textos das telas são pré-definidos e imutáveis.
 *
 * A propriedade `p-url-new-password` automatiza a rotina do template e simplifica o processo de cadastro/alteração de senha, bastando
 * definir uma url para POST das informações digitadas pelo usuário.  A flexibilidade e praticidade podem chegar a um nível em que o
 * desenvolvimento da aplicação no *client side* é desprovida de qualquer código-fonte relacionado à rotina de cadastro/alteração de senha.
 * Seu detalhamento para uso pode ser visto logo abaixo em *propriedades*.
 * Caso julgue necessário, pode-se também definir manualmente a rotina do componente.
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
 */
@Directive()
export abstract class PoPageChangePasswordBaseComponent {
  private _hideCurrentPassword: boolean = false;
  private _recovery: string | PoPageChangePasswordRecovery | Function;
  private _requirements: Array<PoPageChangePasswordRequirement> = [];
  private _urlHome: string = '/';
  protected validatorChange: any;

  confirmPassword: string;
  currentPassword: string;
  modalAction: PoModalAction;
  newPassword: string;
  recoveryUrlType: string;
  showRequirements: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Esconde o campo `Senha atual` para que o template seja para criação de senha.
   *
   * @default `false`
   */
  @Input('p-hide-current-password') set hideCurrentPassword(value: boolean) {
    this._hideCurrentPassword = convertToBoolean(value);
  }

  get hideCurrentPassword(): boolean {
    return this._hideCurrentPassword;
  }

  /**
   * @optional
   *
   * @description
   *
   * Caminho para a logomarca localizada na parte superior.
   *
   * > Caso seja indefinida o espaço se mantém preservado porém vazio.
   */
  @Input('p-logo') logo?: string;

  /**
   * @optional
   *
   * @description
   *
   * URL para a ação do link `Esqueceu a senha`.
   *
   * A propriedade aceita os seguintes tipos:
   *
   * - **String**: informe uma url externa ou uma rota válida;
   * - **Function**: pode-se customizar a ação. Para esta possilidade basta atribuir:
   * ```
   * <po-page-change-password>
   *      [recovery]="this.myFunc.bind(this)";
   * </po-page-change-password>
   * ```
   *
   * - **PoPageChangePasswordRecovery**: cria-se vínculo automático com o template **po-modal-password-recovery**.
   *   O objeto deve conter a **url** para requisição dos recursos e pode-se definir o **tipo** de modal para recuperação de senha,
   *   **email** para contato e **máscara** do campo de telefone.
   *
   * > Caso não tenha valor o link `Esqueceu a senha` desaparece.
   */
  @Input('p-recovery') set recovery(value: string | Function | PoPageChangePasswordRecovery) {
    this._recovery = value;

    if (isTypeof(value, 'string')) {
      this.recoveryUrlType = isExternalLink(value) ? 'externalLink' : 'internalLink';
    }
  }

  get recovery() {
    return this._recovery;
  }

  /**
   * @optional
   *
   * @description
   *
   * Lista de regras para criação e alteração de senha.
   */
  @Input('p-requirements') set requirements(value: Array<PoPageChangePasswordRequirement>) {
    this._requirements = value || [];
    this.showRequirements = this._requirements.length > 0;
  }
  get requirements() {
    return this._requirements;
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
   * Token para solicitação de troca/recuperação de senha.
   *
   * > Esta propriedade será ignorada caso exista um token como parâmetro na URL inicial do template.
   */
  @Input('p-token') token?: string;

  /**
   * @optional
   *
   * @description
   *
   * URL para a ação de retorno da página.
   *
   * > O botão `Voltar` aparece apenas para telas de alteração de senha, ou seja, só aparece se a propriedade `p-hide-current-password` for
   * falsa.
   *
   * @default `/`
   */
  @Input('p-url-back') urlBack: string = '/';

  /**
   * Endpoint usado pelo template para realizar um POST. Quando preenchido, o método `p-submit` será ignorado e o componente adquirirá
   * automatização para o processo de cadastro/troca de senha.
   *
   * ### Processo
   * Ao digitar um valor válido nos campos de senha e pressionar **salvar**,
   * o componente fará uma requisição `POST` na url especificada nesta propriedade passando o objeto contendo os valores definidos pelo
   * usuário.
   *
   * ```
   * body {
   *  token?: token,
   *  oldPassword?: oldPassword,
   *  newPassword: newPassword
   * }
   * ```
   *
   * O código de resposta HTTP de status esperado é `204`.
   *
   * Em caso de **sucesso**, será exibida a modal de confirmação de senha alterada.
   *
   * > O token será informado pela propriedade `p-token`do componente ou por um *query parameter* na URL do template.
   *
   * *Processo finalizado.*
   *
   * _______________
   *
   * #### Praticidade
   * As informações do serviço de autenticação também podem ser transmitidas diretamente pelas configuraçãos de rota e, desta maneira,
   * dispensa-se qualquer menção e/ou importação do componente `po-page-change-password` no restante da aplicação. O exemplo abaixo
   * exemplifica a forma dinâmica com a qual o template de tela de troca de senha pode ser gerado ao navegar para rota `/change-password`, e
   * também como ele se comunica com o serviço para efetuação do processo de troca de senha do usuário e solicitação de nova senha.
   * Basta definir nas configurações de rota:
   *
   *
   * ```
   *   import { PoModalPasswordRecoveryType, PoPageChangePasswordComponent } from '@po-ui/ng-templates';
   *
   *   ...
   *   const routes: Routes = [
   *     {
   *       path: 'change-password', component: PoPageChangePasswordComponent, data: {
   *         serviceApi: 'https://po-ui.io/sample/api/new-password',
   *         recovery: {
   *           url: 'https://po-ui.io/sample/api/users',
   *           type: PoModalPasswordRecoveryType.All,
   *           contactMail: 'dev.po@po-ui.com',
   *           phoneMask: '9-999-999-9999'
   *         }
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
   *
   * O metadado `serviceApi` deve ser a **url** para requisição dos recursos de troca de senha. E `recovery` é a interface
   * `PoPageChangePasswordRecovery` responsável pelas especificações contidas na modal de recuperação de senha.
   *
   * > É essencial que siga a nomenclatura dos atributos exemplificados acima para sua efetiva funcionalidade.
   *
   */
  @Input('p-url-new-password') urlNewPassword?: string;

  /**
   * @optional
   *
   * @description
   *
   * URL para a ação do botão `Entrar no sistema` da modal de confirmação que aparece após salvar a senha ou se chamada pelo método
   * `openConfirmation`.
   *
   * @default `/`
   */
  @Input('p-url-home') set urlHome(value: string) {
    this._urlHome = value;
    this.modalAction.action = this.navigateTo.bind(this, this.urlHome);
  }
  get urlHome() {
    return this._urlHome;
  }

  /**
   * @optional
   *
   * @description
   *
   * Função executada ao submeter o form pelo botão salvar.
   *
   * Caso definida essa função, a modal de confirmação não aparece, mas pode ser chamada pelo
   * método `openConfirmation`. Exemplo:
   *
   * ```
   * @ViewChild(PoPageChangePasswordComponent) changePassword: PoPageChangePasswordComponent;
   *
   * onSubmit() {
   *  this.changePassword.openConfirmation();
   * }
   *
   * ```
   * > Esta propriedade será ignorada se for definido valor para a propriedade `p-url-new-password`.
   */
  @Output('p-submit') submit: EventEmitter<any> = new EventEmitter();

  abstract navigateTo(url: string): void;
}

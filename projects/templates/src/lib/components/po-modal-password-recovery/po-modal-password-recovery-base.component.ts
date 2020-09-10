import { EventEmitter, Input, Output, Directive } from '@angular/core';

import { PoLanguageService, poLocaleDefault } from '@po-ui/ng-components';

import { poModalPasswordRecoveryLiterals } from './literals/i18n/po-modal-password-recovery-literals';
import { PoModalPasswordRecoveryType } from './enums/po-modal-password-recovery-type.enum';

const PoModalPasswordRecoveryDefaultMaxLength = 15;
const PoModalPasswordRecoveryDefaultMinLength = 15;
const PoModalPasswordRecoveryDefaultPhone = '(99) 99999-9999';
const PoModalPasswordRecoveryTypeDefault: PoModalPasswordRecoveryType = PoModalPasswordRecoveryType.Email;

/**
 * @description
 *
 * O componente `po-modal-password-recovery` é utilizado como template para solicitação de troca de senha.
 *
 * É composto por uma modal que possui três telas, cada uma com as seguintes características:
 *
 * - A primeira possui campos para preenchimento de email ou número de telefone;
 * - Tela com campo para preenchimento de código SMS enviado para o número de telefone enviado;
 * - A terceira se trata de uma confirmação de envio de link para a caixa de email do usuário.
 *
 *
 * A propriedade `p-url-recovery` automatiza a rotina do componente e simplifica o processo
 * para recuperação de senha, bastando definir uma url para requisição dos recursos.
 * Seu detalhamento para uso pode ser visto logo abaixo em *propriedades*.
 * Caso julgue necessário, pode-se também definir manualmente a rotina do componente.
 *
 *
 * Para a modal de digitação de código SMS, é possível definir uma mensagem de erro
 * customizada com a propriedade `p-code-error` e há um link para
 * reenvio de código por SMS. Ao reenviar, o evento `p-code-submit` envia um objeto com o telefone do usuário e a quantidade
 * de vezes em que o usuário fez a solicitação de reenvio.
 *
 * > É indicada a utilização da tela de digitação para envio de código SMS apenas
 * se a opção por envio SMS for disponibilizada para o usuário.
 *
 *
 * A modal de confirmação contém uma ação de reenvio e o evento `p-submit`
 * é quem passa o objeto contendo o email em conjunto com a quantidade de tentativas de reenvio.
 *
 * > A tela de confirmação é indicada para quando o usuário solicitar a troca através do email.
 *
 * > Os textos das modals são pré-definidos, imutáveis e são traduzidos de acordo com o idioma do *browser* (pt, en e es)
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
export abstract class PoModalPasswordRecoveryBaseComponent {
  private _contactEmail: string;
  private _phoneMask = PoModalPasswordRecoveryDefaultPhone;
  private _type: PoModalPasswordRecoveryType = PoModalPasswordRecoveryTypeDefault;

  email: string;
  maxLength = PoModalPasswordRecoveryDefaultMaxLength;
  minLength = PoModalPasswordRecoveryDefaultMinLength;
  modalPasswordRecoveryTypeAll: boolean;
  phone: string;
  smsCode: string;
  smsCodeErrorMessage: string;

  literals: {
    cancelButton: string;
    closeButton: string;
    continueButton: string;
    email: string;
    emailErrorMessagePhrase: string;
    emailSentConfirmationPhrase: string;
    emailSentTitle: string;
    forgotPasswordTitle: string;
    insertCode: string;
    insertEmail: string;
    insertPhone: string;
    phoneErrorMessagePhrase: string;
    prepositionIn: string;
    prepositionOr: string;
    recoveryPasswordPhrase: string;
    resendEmailButton: string;
    resendSmsCodePhrase: string;
    sendAgain: string;
    sendAgainPhrase: string;
    sendButton: string;
    sms: string;
    smsCode: string;
    smsCodeErrorMessagePhrase: string;
    sentSmsCodePhrase: string;
    supportContact: string;
    telephone: string;
    typeCodeTitle: string;
  } = poModalPasswordRecoveryLiterals[poLocaleDefault];

  /**
   * @optional
   *
   * @description
   *
   * Definição do e-mail que é exibido na mensagem para contato de suporte.
   */
  @Input('p-contact-email') set contactEmail(value: string) {
    this._contactEmail = value;

    this.smsCodeErrorMessage = this.concatenateSMSErrorMessage(value);
  }

  get contactEmail() {
    return this._contactEmail;
  }

  /**
   * @optional
   *
   * @description
   *
   * Definição de mensagem de erro customizada para quando o usuário passar um código SMS inválido ou errado.
   */
  @Input('p-code-error') codeError: string;

  /**
   * @optional
   *
   * @description
   *
   * Definição da mascara do campo de telefone.
   *
   * @default `(99) 99999-9999`
   */
  @Input('p-phone-mask') set phoneMask(value: string) {
    this._phoneMask = value || PoModalPasswordRecoveryDefaultPhone;
    this.minLength = this.maxLength = this._phoneMask.length;
  }

  get phoneMask() {
    return this._phoneMask;
  }

  /**
   * @optional
   *
   * @description
   *
   * Define o tipo de recuperação de senha que será exibido.
   *
   * @default `PoModalPasswordRecoveryType.Email`
   *
   */
  @Input('p-type') set type(value: PoModalPasswordRecoveryType) {
    this._type = (<any>Object).values(PoModalPasswordRecoveryType).includes(value)
      ? value
      : PoModalPasswordRecoveryTypeDefault;
  }

  get type() {
    return this._type;
  }

  /**
   * @optional
   *
   * @description
   *
   * Endpoint usado pelo template para requisição do recurso. Quando preenchido,
   * o métodos `p-submit` e `p-submit-code` serão ignorados e o componente adquirirá automatização
   * para o processo de solicitação de troca de senha.
   *
   * ### Processos
   * Ao digitar um valor válido no campo de email/telefone e pressionar **enviar**,
   * o componente fará uma requisição `POST` na url especificada nesta propriedade passando o objeto contendo o valor definido pelo usuário.
   *
   * ```
   * body {
   *  email: email,
   *  retry?: retry
   * }
   * ```
   *
   *
   * #### Recuperação por email
   * Para a recuperação de senha por **email**, o código de resposta HTTP de status esperado é `204`.
   *
   * Em caso de **sucesso**, será exibida a modal de confirmação de e-mail para o usuário.
   *
   *
   * > A ação **Reenviar** na tela de confirmação efetua uma nova requisição
   * passando-se o objeto com incremento para o valor da propriedade **retry**.
   *
   * *Processo finalizado.*
   *
   *
   * #### Recuperação por SMS
   * Se a opção de recuperação for por **SMS**, o código de status de sucesso deve ser `200`.
   * Em caso de **sucesso**, abre-se a modal de digitação de código SMS e a resposta
   * desta requisição deve retornar uma definição de dados abaixo:
   *
   * ```
   * 200:
   *  {
   *    hash: hash,
   *    urlValidationCode?: url
   *  }
   * ```
   *
   *
   * - O **hash** será o código de validação da solicitação do SMS para ser enviado juntamente com o código de verificação do SMS;
   * - **urlValidationCode** é a url usada para validação do código enviado por SMS.
   *
   *
   * > Caso não seja passado urlValidationCode, o endpoint usado para validação do código será `<p-url-recovery>/validation`.
   *
   *
   * #### Validação do código SMS
   * Ao digitar um valor válido no campo de código SMS e pressionar **continuar**, o componente fará uma requisição `POST` contendo:
   *
   * ```
   * POST /<p-url-recovery>/validation OU /<urlValidationCode>
   * Body {
   *  hash: hash,
   *  code: code
   * }
   * ```
   *
   *
   * O código de resposta HTTP de status esperado é `200`.
   *
   * Em caso de **erro** na validação do código SMS, a modal se mantém com o campo para digitação
   * de código SMS
   *
   *
   * > Pode-se atribuir a mensagem de erro (message) para o atributo `p-code-error` conforme retorno abaixo:
   *
   * ```
   * 400
   *  {
   *    error {
   *      message: 'Error Message'
   *    }
   *  }
   * ```
   *
   *
   * Em caso de **sucesso**, espera-se a resposta desta requisição retornando a seguinte definição:
   *
   * ```
   * 200:
   *  {
   *    token: token,
   *    urlChangePassword?: url
   *  }
   * ```
   *
   *
   * - **token**: Token de alteração de senha;
   * - **urlChangePassword**: url para o formulário de alteração de senha.
   *
   *
   * O componente está configurado para redirecionar para a url estabelecida em `urlChangePassword`.
   *
   * > Caso não seja passado valor para urlChangePassword,
   * a url usada para validação será a `<p-url-recovery>/changePassword?token=<token>`.
   *
   * *Processo finalizado.*
   */
  @Input('p-url-recovery') urlRecovery?: string;

  /**
   * @optional
   *
   * @description
   *
   * Ação contendo como parâmetro o código enviado por SMS e digitado pelo usuário.
   *
   * > Esta propriedade será ignorada se for definido valor para a propriedade `p-url-recovery`.
   */
  @Output('p-code-submit') codeSubmit = new EventEmitter<any>();

  /**
   * @optional
   *
   * @description
   *
   * Ação contendo o email como parâmetro e que é executada quando o usuário clica sobres os botões de 'enviar' e 'reenviar' e-mail.
   *
   * > Esta propriedade será ignorada se for definido valor para a propriedade `p-url-recovery`.
   */
  @Output('p-submit') submit = new EventEmitter<any>();

  constructor(languageService: PoLanguageService) {
    this.literals = {
      ...this.literals,
      ...poModalPasswordRecoveryLiterals[languageService.getShortLanguage()]
    };
  }

  /**
   * Acão para conclusão de processo e fechamento da modal. Indica-se sua utilização
   * para após o envio e validação do código SMS enviado pelo usuário.
   *
   * > Nas modals em que há a ação de 'cancelar' dispensa-se o uso desta ação pois o componente já trata o fechamento da modal.
   */
  abstract completed(): void;

  /**
   * Abre a modal de preenchimento de email ou número de telefone para solicitação de troca de senha.
   */
  abstract open(): void;

  /**
   * Abre a modal de confirmação de envio de email.
   */
  abstract openConfirmation(): void;

  /**
   * Abre a modal de preenchimento do código SMS enviado ao usuário.
   */
  abstract openSmsCode(): void;

  private concatenateSMSErrorMessage(value: string) {
    const literalCodeErrorMessage = this.literals.smsCodeErrorMessagePhrase;

    return value && value !== ''
      ? `${literalCodeErrorMessage} ${this.literals.prepositionIn} ${value}.`
      : literalCodeErrorMessage;
  }
}

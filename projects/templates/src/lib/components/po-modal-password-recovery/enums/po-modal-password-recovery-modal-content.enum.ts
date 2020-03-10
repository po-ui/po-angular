/**
 * @docsPrivate
 *
 * @description
 *
 * Enum para definição do tipo de conteúdo exibido na modal.
 */
export enum PoModalPasswordRecoveryModalContent {
  /** Exibição de modal contendo campo para preenchimento de email ou número de telefone */
  Email = 'email',

  /** Exibição de modal contendo campo para inserção de código enviado por SMS */
  SMSCode = 'smsCode',

  /** Exibição de modal de confirmação de envio */
  Confirmation = 'confirmation'
}

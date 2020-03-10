/**
 * @usedBy PoModalPasswordRecoveryComponent
 *
 * @description
 *
 * *Enum* para especificação do tipo de recuperação de senha.
 */
export enum PoModalPasswordRecoveryType {
  /** Possibilita ao usuário optar por envio via email ou SMS */
  All = 'all',

  /** Definição para recuperação apenas por email */
  Email = 'email',

  /** Definição para recuperação apenas por SMS */
  SMS = 'sms'
}

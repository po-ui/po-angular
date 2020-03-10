import { PoModalPasswordRecoveryType } from '../../po-modal-password-recovery/enums/po-modal-password-recovery-type.enum';

/**
 * @usedBy PoPageChangePasswordComponent
 *
 * @description
 *
 * Interface para especificação do tipo de recuperação de senha no `po-modal-password-recovery`.
 */
export interface PoPageChangePasswordRecovery {
  /** Definição do e-mail que é exibido na mensagem para contato de suporte. */
  contactMail?: string;

  /** Definição da máscara do campo de telefone. */
  phoneMask?: string;

  /**
   * @optional
   *
   * @description
   *
   * Enum para especificação do tipo de recuperação de senha [PoModalPasswordRecoveryType](/documentation/po-modal-password-recovery).
   *
   * > Caso não seja definido valor se assume o padrão `PoModalPasswordRecoveryType.Email`.
   */
  type?: PoModalPasswordRecoveryType;

  /**
   * Endpoint usado pelo template **PoModalPasswordRecovery** para requisição do recurso.
   *
   * > Saiba mais em [PoModalPasswordRecovery](/documentation/po-modal-password-recovery).
   */
  url: string;
}

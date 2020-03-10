/**
 * @usedBy PoPageBlockedUserComponent
 *
 * @description
 *
 * Interface que define os valores de customização da mensagem de bloqueio do componente `po-page-blocked-user`.
 */
export interface PoPageBlockedUserReasonParams {
  /** Quantidade máxima de tentativas. */
  attempts?: number;

  /** Quantidade de dias para expiração de senha. */
  days?: number;

  /** Horas que o sistema permanecerá bloqueado. */
  hours?: number;
}

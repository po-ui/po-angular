/**
 * @usedBy PoModalPasswordRecoveryComponent
 *
 * @description
 *
 * Interface com a definição do objeto gerado pelo formulário do componente `po-modal-password-recovery`.
 */
export interface PoModalPasswordRecovery {
  /** Valor contendo o código enviado por SMS e digitado pelo usuário. */
  code?: string;

  /** Valor contendo o email enviado pelo usuário. */
  email?: string;

  /** Código de validação da solicitação do SMS para ser enviado junto com o código de verificação do SMS */
  hash?: string;

  /** Número de tentativas de reenvio. */
  retry?: number;

  /** Valor contendo o número de telefone enviado pelo usuário. */
  sms?: string;

  /** Token de alteração de senha */
  token?: string;

  /** URL para o formulário de alteração de senha */
  urlChangePassword?: string;

  /** URL usada para validação do código enviado por SMS */
  urlValidationCode?: string;
}

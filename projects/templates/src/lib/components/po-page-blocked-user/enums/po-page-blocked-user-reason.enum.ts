/**
 * @usedBy PoPageBlockedUserComponent
 *
 * @description
 *
 * *Enum* para os tipos de motivo de bloqueio de usuário. As informações modificam conforme o motivo selecionado pelo desenvolvedor.
 */
export enum PoPageBlockedUserReason {
  /** Sem definição; a tela exibirá conteúdo de bloqueio genérico. */
  None = 'none',

  /** Definição para tentativas de acesso esgotadas. */
  ExceededAttempts = 'exceededAttempts',

  /** Definição para senha expirada. */
  ExpiredPassword = 'expiredPassword'
}

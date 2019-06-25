/**
 * @usedBy PoPageLoginComponent
 *
 * @description
 *
 * Interface com a definição do objeto gerado pelo formulário do componente `po-page-login`.
 */
export interface PoPageLogin {
  /** Login preenchido pelo usuário. */
  login: string;

  /** Senha preenchida pelo usuário, a mesma será convertida para [hash/md5] antes de ser enviada para a aplicação. */
  password: string;

  /** Essa propriedade informa se o usuário quer que seus dados sejam lembrados em um acesso futuro. */
  rememberUser: boolean;
}

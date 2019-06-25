/**
 * @usedBy PoPageLoginComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-page-login`.
 */
export interface PoPageLoginLiterals {

  /** Título exibido no topo da página. */
  title?: string;

  /** Mensagem de erro apresentada quando o campo de login está inválido. */
  loginErrorPattern?: string;

  /** Texto exibido como dica para o campo de login. */
  loginHint?: string;

  /** Texto exibido como label do campo de login. */
  loginLabel?: string;

  /** Placeholder do campo de login. */
  loginPlaceholder?: string;

  /** Mensagem de erro apresentada quando o campo de password está inválido. */
  passwordErrorPattern?: string;

  /** Texto exibido como label do campo de password. */
  passwordLabel?: string;

  /** Placeholder do campo de password. */
  passwordPlaceholder?: string;

  /** Texto exibido na função "Lembrar usuário". */
  rememberUser?: string;

  /** Texto exibido como dica da função "Lembrar usuário" */
  rememberUserHint?: string;

  /** Texto exibido no botão de confirmação da página de login. */
  submitLabel?: string;

  /** Texto exibido no botão de confirmação da página de login quando estiver em estado de carregamento. */
  submittedLabel?: string;

  /** Texto de ajuda para recuperação dos dados de acesso. */
  forgotPassword?: string;

  /** Texto de destaque sobreposto à imagem de destaque. Essa opção é utilizada em conjunto com o atributo `p-background`. */
  highlightInfo?: string;

  /** Texto exibido no link de novo cadastro. */
  registerUrl?: string;

}

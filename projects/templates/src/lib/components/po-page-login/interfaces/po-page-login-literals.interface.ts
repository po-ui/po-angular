/**
 * @usedBy PoPageLoginComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-page-login`.
 */
export interface PoPageLoginLiterals {
  /** Texto que informa a quantidade de tentativas restantes no popover de aviso de bloqueio. */
  attempts?: string;

  /** Texto exibido no popover de aviso de bloqueio, que orienta o usuário, caso ele tenha esquecido a senha, a criar uma nova senha. */
  createANewPasswordNow?: string;

  /** Mensagem de erro apresentada quando o campo customizado está inválido */
  customFieldErrorPattern?: string;

  /** Placeholder para o campo customizado. */
  customFieldPlaceholder?: string;

  /** Texto que questiona o esquecimento da senha no popover de aviso de bloqueio. */
  forgotYourPassword?: string;

  /** Texto do link de 'esqueci minha senha' exibido no popover de aviso de bloqueio. */
  iForgotMyPassword?: string;

  /** Texto de aviso de tentativas exibido no popover de aviso de bloqueio. */
  ifYouTryHarder?: string;

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

  /** Título do popover para aviso de bloqueio. */
  titlePopover?: string;

  /** Texto que informa ao usuário que o mesmo será bloqueado e por quanto tempo no popover de aviso de bloqueio. */
  yourUserWillBeBlocked?: string;

  /** Mensagem de "Boas-vindas" para o usuário que aparece acima dos campos de entrada. */
  welcome?: string;

  /** Label do botão de suporte. */
  support?: string;
}

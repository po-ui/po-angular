/**
 * @usedBy PoToolbarComponent
 *
 * @description
 *
 * Interface que define o perfil do `PoToolbarComponent`.
 */
export interface PoToolbarProfile {
  /** Define o caminho da imagem do perfil. */
  avatar?: string;

  /** Define um texto com menor destaque ao lado da imagem do perfil, como por exemplo o e-mail de usuário. */
  subtitle?: string;

  /** Define um texto com maior destaque ao lado da imagem do perfil, como por exemplo o nome de usuário. */
  title: string;
}

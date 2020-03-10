/**
 * @usedBy PoSlideComponent
 *
 * @description
 *
 * Interface que define cada objeto do `PoSlideItem`.
 */
export interface PoSlideItem {
  /** Ação executada ao clicar no slide caso não tenha link definido. */
  action?: Function;

  /** Define o caminho da imagem. */
  image: string;

  /** Texto que aparece quando a imagem não é encontrada. */
  alt?: string;

  /** Link interno ou externo que será aberto ao clicar no slide. */
  link?: string;
}

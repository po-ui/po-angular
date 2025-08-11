/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * *Interface* que define a seção de brand.
 *
 */
export interface PoHeaderBrand {
  /**
   *
   * @description
   *
   * Título da marca
   *
   */
  title: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Imagem da marca
   *
   */
  logo?: string;

  /**
   *
   * @optional
   *
   * @description
   *
   * Evento da ação
   *
   *  Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;
}

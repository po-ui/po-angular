/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Interface que consolida, em um único objeto tipado, os mapeamentos entre as propriedades do
 * item da lista e as áreas visuais do `po-list-view` (título, subtítulo, link, avatar, destaque e tag).
 *
 * Cada valor informado corresponde ao **nome da propriedade** do objeto de dados que deverá ser
 * utilizada para preencher a respectiva área.
 *
 * > Substitui os *inputs* individuais de mapeamento (`p-property-title`, `p-property-subtitle`,
 * `p-property-link`, `p-property-avatar`, `p-property-highlighted`, `p-property-tag` e
 * `p-property-tag-type`), que estão **depreciados**.
 */
export interface PoListViewFieldProperties {
  /** Nome da propriedade do item que será exibida como o título de cada registro. */
  title?: string;

  /** Nome da propriedade do item que será exibida como subtítulo (linha de apoio) abaixo do título. */
  subtitle?: string;

  /** Nome da propriedade do item que será utilizada como link do título. */
  link?: string;

  /** Nome da propriedade do item que contém o avatar. */
  avatar?: string;

  /**
   * Nome da propriedade *booleana* do item que, quando `true`, aplica um destaque visual ao registro
   * (por exemplo, para representar um item "não lido").
   */
  highlighted?: string;

  /** Mapeamento da `po-tag` exibida em cada item. */
  tag?: {
    /** Nome da propriedade do item que contém o texto (label) da tag. */
    value?: string;

    /**
     * Nome da propriedade do item que contém o tipo da tag (`success`, `warning`, `danger`, `info`, `neutral`).
     *
     * > Caso não informado, utiliza `success` como padrão.
     */
    type?: string;
  };
}

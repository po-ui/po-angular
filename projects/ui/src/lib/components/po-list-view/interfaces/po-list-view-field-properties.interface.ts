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
 * > Forma recomendada de mapear os campos do item. Os *inputs* `p-property-title` e `p-property-link`
 * permanecem disponíveis, porém **depreciados**.
 */
export interface PoListViewFieldProperties {
  /** Nome da propriedade do item que será exibida como o título de cada registro. */
  title?: string;

  /** Nome da propriedade do item que será exibida como subtítulo (linha de apoio) abaixo do título. */
  subtitle?: string;

  /** Nome da propriedade do item que será utilizada como link do título. */
  link?: string;

  /**
   * Nome da propriedade do item que contém o avatar.
   *
   * O valor aceita 4 formatos:
   *
   * - **String (URL):** Renderiza o `po-avatar` com a imagem informada.
   * ```
   * { avatar: 'https://url-da-imagem.png' }
   * ```
   *
   * - **Objeto com `icon`:** Renderiza um ícone circular com tamanho fixo (não afetado por `p-avatar-size`). Propriedades: `icon` (obrigatório), `color` (opcional), `backgroundColor` (opcional).
   * ```
   * { avatar: { icon: 'an an-shield-warning', color: '#dc2626', backgroundColor: '#fee2e2' } }
   * ```
   *
   * - **Objeto com `progress`:** Renderiza um `po-progress-circle` (não afetado por `p-avatar-size`; o tamanho é definido pelas propriedades `size`/`radius`). Todas as propriedades do componente são suportadas:
   * - `progress` (number): valor de 0-100.
   * - `indeterminate` (boolean): animação contínua (ignora `progress`).
   * - `showPercentage` (boolean): exibe porcentagem no centro.
   * - `status` (string): `'default'`, `'success'`, `'error'`.
   * - `size` (string): `'medium'` (stroke 4px) ou `'large'` (stroke 8px).
   * - `radius` (number): raio do círculo em px.
   * - `ariaLabel` (string): label de acessibilidade.
   * ```
   * { avatar: { progress: 65, showPercentage: true, size: 'large', radius: 40 } }
   * { avatar: { indeterminate: true, size: 'large', radius: 40 } }
   * { avatar: { progress: 100, status: 'success', size: 'large', radius: 40 } }
   * ```
   *
   * - **Objeto com `customTemplate`:** Renderiza um template customizado (compatível com `PoWidgetAvatar`).
   * ```
   * { avatar: { customTemplate: myTemplateRef } }
   * ```
   *
   * > O tamanho (`p-avatar-size`) é aplicado globalmente e somente ao avatar do tipo **imagem**.
   */
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

/**
 * @usedBy PoListViewComponent
 *
 * @description
 *
 * Mapeia as chaves do objeto dos itens (`p-items`) para as áreas visuais do componente.
 */
export interface PoListViewFieldProperties {
  /** Chave com o título do item. */
  title?: string;

  /** Chave com o subtítulo do item.  */
  subtitle?: string;

  /**
   * Chave com o *link* do título do item.
   *
   * > Compatível com a propriedade `title`. Incompatível com o evento `p-item-click`.
   */
  link?: string;

  /**
   * Chave correspondente ao avatar do item.
   *
   * O valor mapeado suporta quatro formatos distintos:
   *
   * - **String (URL):** Renderiza o `po-avatar` com a imagem especificada.
   * ```
   * { avatar: '[https://url-da-imagem.png](https://url-da-imagem.png)' }
   * ```
   *
   * - **Objeto com `icon`:** Renderiza um ícone circular com tamanho fixo. Aceita as seguintes propriedades:
   *   - `icon` (obrigatória).
   *   - `color` e `backgroundColor`: aceitam qualquer formato de cor CSS (Hex, RGB, nomes, etc.).
   * ```
   * { avatar: { icon: 'an an-shield-warning', color: '#dc2626', backgroundColor: '#fee2e2' } }
   * ```
   *
   * - **Objeto com `progress`:** Renderiza o `po-progress-circle`. Aceita as seguintes propriedades:
   *   - `progress` (number): Valor de 0 a 100.
   *   - `indeterminate` (boolean): Animação de carregamento contínuo (ignora `progress`).
   *   - `showPercentage` (boolean): Exibe a porcentagem centralizada.
   *   - `status` (string): `'default'`, `'success'` ou `'error'`.
   *   - `size` (string) e `radius` (number): `'medium'`, `'large'` ou medida exata do raio em *pixels*.
   *   - `ariaLabel` (string): Rótulo para acessibilidade.
   * ```
   * { avatar: { progress: 65, showPercentage: true, size: 'large', radius: 40 } }
   * ```
   *
   * - **Objeto com `customTemplate`:** Renderiza um fragmento customizado referenciado via `TemplateRef`.
   * ```
   * { avatar: { customTemplate: myTemplateRef } }
   * ```
   */
  avatar?: string;

  /** Chave booleana que aplica destaque visual ao item. */
  highlighted?: string;

  /**
   * Objeto da `tag` do item.
   *
   * Aceita as seguintes propriedades:
   *
   * - **`value`** (string): Chave com o texto da *tag*.
   * - **`type`** (string): Chave com o tipo da *tag* (`success`, `warning`, `danger`, `info`, `neutral`). Caso não informado, utiliza `success` como padrão.
   *
   * ```
   * { tag: { value: 'status', type: 'statusType' } }
   * ```
   */
  tag?: {
    value?: string;
    type?: string;
  };
}

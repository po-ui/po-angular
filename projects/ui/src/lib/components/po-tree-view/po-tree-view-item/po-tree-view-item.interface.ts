/**
 * @usedBy PoTreeViewComponent
 *
 * @description
 *
 * Interface para definição dos itens do componente `po-tree-view`.
 */
export interface PoTreeViewItem {
  /**
   * @optional
   *
   * @description
   *
   * Desabilita a interação com o item.
   *
   * O estado é aplicado somente ao item em que a propriedade está configurada
   * e não é propagado para seus `subItems`.
   *
   * > Itens disabled que não possuem `subItems` são ignorados na navegação por teclado.
   * Itens disabled que possuem `subItems` continuam participando da navegação, permitindo expandir/recolher.
   *
   * @default `false`
   */
  disabled?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Expande o item, exibindo seus `subItems`.
   *
   * Quando `true`, o item será renderizado no estado expandido.
   *
   * > Sem efeito em itens que não possuem `subItems`.
   *
   * @default `false`
   */
  expanded?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Permite ativar ou desativar a seleção do item.
   *
   * Quando `false`, o item não poderá ser selecionado pelo usuário.
   *
   * @deprecated v23.x.x use `disabled`
   */
  isSelectable?: boolean | null;

  /**
   * @description
   *
   * Texto de exibição do item.
   *
   * O valor é utilizado como `aria-label` do nó e como referência na navegação por caractere do teclado.
   */
  label: string;

  /**
   * @optional
   *
   * @description
   *
   * Marca o item como selecionado.
   *
   * > Caso o item que possuir `subItems` for selecionado, os seus itens filhos serão também selecionados.
   *
   * Quando utilizado com `p-single-select`, apenas um item pode estar selecionado por vez.
   * Ao selecionar outro item, o anteriormente selecionado perde o estado.
   *
   * @default `false`
   */
  selected?: boolean | null;

  /**
   * @optional
   *
   * @description
   *
   * Habilita a exibição de ícone no item.
   *
   * Quando `true`, exibe automaticamente:
   * - `an-folder-simple` para itens agrupadores (que possuem `subItems`).
   * - `an-file` para itens finais (sem `subItems`).
   *
   * > Não funciona em conjunto com `p-selectable`.
   * Quando `p-selectable` e `showIcon` estiverem configurados como `true`,
   * `p-selectable` terá precedência.
   *
   * @default `false`
   */
  showIcon?: boolean;

  /**
   * @optional
   *
   * @description
   *
   * Lista de itens do próximo nível, permitindo a construção hierárquica da árvore.
   *
   * A estrutura pode ser aninhada recursivamente até o limite definido pela propriedade `p-max-level` do componente.
   */
  subItems?: Array<PoTreeViewItem>;

  /**
   * @description
   *
   * Valor do item utilizado como referência para sua identificação.
   *
   * Em modo `p-single-select`, este valor é utilizado para determinar qual item está atualmente selecionado.
   */
  value: string | number;
}

/**
 * @usedBy PoMenuComponent
 *
 * @description
 *
 * Interface do objeto que deve conter na coleção de itens filtrados no componente `po-menu`.
 */
export interface PoMenuItemFiltered {
  /** Texto do item de menu. */
  label: string;

  /** *Link* para redirecionamento no clique do item do menu, podendo ser um *link* interno ou externo. */
  link: string;
}

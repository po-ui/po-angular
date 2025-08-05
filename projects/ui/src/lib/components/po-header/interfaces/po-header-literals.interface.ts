/**
 * @usedBy PoHeaderComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-header`.
 */
export interface PoHeaderLiterals {
  /** Texto exibido no item de menu no qual os itens do header são agrupados quando está no modo responsivo. */
  headerLinks?: string;

  /** Texto para indicação de notificação, caso seja passado um valor válido na propriedade `badge` */
  notifications?: string;
}

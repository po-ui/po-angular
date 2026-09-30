/**
 * @usedBy PoListBoxComponent
 *
 * @description
 *
 * Interface para definição de literais utilizadas no `po-listbox`
 */
export interface PoListBoxLiterals {
  /** Texto do botão para voltar ao agrupador anterior. */
  backToPreviousGroup?: string;

  /** Texto exibido quando não houver itens na lista */
  noItems?: string;

  /** Texto do *placeholder* do campo de busca. */
  placeholderSearch?: string;

  /** Texto do checkbox para selecionar todos os itens. */
  selectAll?: string;

  // Texto exibido na ação do rodapé da lista de resultados.
  footerActionListbox?: string;

  /** Mensagem exibida quando o carregamento assíncrono de um subnível falha. */
  subItemsErrorMessage?: string;

  /** Texto acessível anunciado durante o carregamento assíncrono de um subnível. */
  subItemsLoading?: string;

  /** Texto do botão para tentar novamente o carregamento de um subnível. */
  retry?: string;
}

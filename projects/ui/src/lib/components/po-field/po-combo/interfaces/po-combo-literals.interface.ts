/**
 * @usedBy PoComboComponent
 *
 * @description
 *
 * Interface para definição das literais usadas no `po-combo`.
 */
export interface PoComboLiterals {
  /** Texto exibido quando não houver itens na lista ou se, a pesquisa do filtro não retornar nenhum item. */
  noData?: string;

  /** Texto exibido quando o combo estiver vazio. */
  chooseOption?: string;

  /** Texto do aria-label do botão de limpar */
  clean?: string;
}

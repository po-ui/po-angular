/**
 * @usedBy PoLookupSearchFields
 *
 * @description
 *
 * Interface da coleções de itens que devem ser apresentados para
 * seleção na modal do lookup
 */
export interface PoLookupSearchFields {
  /** Label a ser utilizada nos itens da lista. */
 label: string;

 /** Valor do objeto que será atribuído ao model. */
 value: string | number;

 /** Opção virá selecionada automaticamente. */
 default: boolean;

}

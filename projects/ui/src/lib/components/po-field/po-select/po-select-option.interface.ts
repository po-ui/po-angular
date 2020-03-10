/**
 * @usedBy PoSelectComponent
 *
 * @description
 *
 * Interface da coleções de itens que deve ser informado no componente po-select
 */
export interface PoSelectOption {
  /** Label a ser utilizada nos itens da lista. */
  label: string;

  /** Valor do objeto que será atribuído ao model. */
  value: string | number;
}

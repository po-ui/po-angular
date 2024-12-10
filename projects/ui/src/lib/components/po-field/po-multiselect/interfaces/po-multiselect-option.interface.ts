/**
 * @usedBy PoMultiselectComponent
 *
 * @description
 *
 * Interface dos itens da coleção que será exibida no dropdown do po-multiselect.
 */
export interface PoMultiselectOption {
  /** Label exibido nos itens da lista. */
  label: string;

  /** Valor do objeto que será atribuído ao model. */
  value: string | number;
}

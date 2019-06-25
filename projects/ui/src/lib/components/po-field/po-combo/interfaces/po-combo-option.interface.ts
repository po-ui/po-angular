/**
 * @usedBy PoComboComponent
 *
 * @description
 *
 * Interface dos itens da coleção que será exibida no dropdown do po-combo.
 */
export interface PoComboOption {

  /**
   * @optional
   *
   * @description
   * Label exibido nos itens da lista.
   *
   * > Caso não informar o `label`, será utilizado o valor informado na propriedade `value`.
   */
  label?: string;

  /** Valor do objeto que será atribuído ao model. */
  value: string | number;
}

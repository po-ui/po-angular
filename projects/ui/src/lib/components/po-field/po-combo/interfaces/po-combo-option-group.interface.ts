import { PoComboOption } from './po-combo-option.interface';

/**
 * @usedBy PoComboComponent
 *
 * @description
 *
 * Interface dos agrupamentos da coleção que será exibida no dropdown do `po-combo`.
 */
export interface PoComboOptionGroup {
  /**
   * Título para cada grupo de opções.
   *
   * Recomendação: evite usar labels idênticos em diferentes grupos. Labels iguais podem
   * causar ambiguidade para usuários e dificultar a identificação/seleção dos itens.
   */
  label: string;

  /** Lista de itens a serem exibidos. */
  options: Array<PoComboOption>;
}

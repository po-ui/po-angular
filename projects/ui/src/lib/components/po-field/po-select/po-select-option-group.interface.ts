import { PoSelectOption } from './po-select-option.interface';

/**
 * @usedBy PoSelectComponent
 *
 * @description
 *
 * Interface da coleções de itens em grupo, utilizando uma label para o grupo e as opções do tipo `PoSelectOption`.
 */
export interface PoSelectOptionGroup {
  /** Label para denominar o nome do grupo. */
  label: string;

  /** Lista com as opções disponíveis em cada grupo. */
  options: Array<PoSelectOption>;
}

import { PoTableDetailColumn } from './po-table-detail-column.interface';

/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para configuração do _detail_ do componente `po-table`.
 */
export interface PoTableDetail {
  /**
   * Define uma lista do tipo `PoTableDetailColumn` para as colunas do objet *detail*. Por exemplo:
   *
   * ```
   *  [
   *   { property: 'miles', label: 'Miles', type: 'number', format: '1.0-5' },
   *   { property: 'departure', label: 'Departure time', type: 'date', format: 'dd/MM/yyyy' }
   *  ]
   * ```
   */
  columns: Array<PoTableDetailColumn>;

  /**
   *
   * Define se o checkbox de seleção do detail será exibido. Valor padrão 'false'.
   */
  hideSelect?: boolean;

  /**
   *
   * Define o tipo de cabeçalho para o conteúdo do _detail_ .
   *
   * Valores válidos:
   * - `inline`: Atribui o cabeçalho na mesma linha do _detail_.
   * - `top`: Atribui o cabeçalho acima do _detail_, idêntico ao `po-table`.
   * - `none`: Remove o cabeçalho do _detail_.
   */
  typeHeader?: string;
}

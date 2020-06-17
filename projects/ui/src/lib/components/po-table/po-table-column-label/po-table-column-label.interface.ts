/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para configuração das colunas de labels do `po-table`.
 */
export interface PoTableColumnLabel {
  /**
   * @optional
   *
   * @description
   *
   * Define a cor do label.
   *
   * Valores válidos:
   * - <span class="dot po-color-01"></span> `color-01`
   * - <span class="dot po-color-02"></span> `color-02`
   * - <span class="dot po-color-03"></span> `color-03`
   * - <span class="dot po-color-04"></span> `color-04`
   * - <span class="dot po-color-05"></span> `color-05`
   * - <span class="dot po-color-06"></span> `color-06`
   * - <span class="dot po-color-07"></span> `color-07`
   * - <span class="dot po-color-08"></span> `color-08`
   * - <span class="dot po-color-09"></span> `color-09`
   * - <span class="dot po-color-10"></span> `color-10`
   * - <span class="dot po-color-11"></span> `color-11`
   * - <span class="dot po-color-12"></span> `color-12`
   */
  color?: string;

  /** Texto que será exibido na coluna. */
  label: string;

  /**
   * Define um texto de ajuda que será exibido ao passar o *mouse* em cima do *label*.
   *
   * > Caso a propriedade `p-hide-text-overflow` esteja habilitada e o conteúdo da célula exceder a largura da coluna,
   * é ignorado o valor atribuido ao tooltip e será exibido justamente o conteúdo da célula.
   */
  tooltip?: string;

  /** Valor que será usado como referência para exibição do conteúdo na coluna. */
  value: string | number;
}

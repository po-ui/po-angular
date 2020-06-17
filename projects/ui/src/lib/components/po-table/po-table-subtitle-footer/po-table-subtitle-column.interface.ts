/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * Interface para configuração das colunas de legenda do Po-Table.
 */
export interface PoTableSubtitleColumn {
  /** Valor que será usado como referência para exibição do conteúdo na coluna. */
  value: string | number;

  /** Texto que será exibido no rodapé da tabela como legenda. */
  label: string;

  /**
   * @optional
   *
   * @description
   *
   * Define a cor do *status*.
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
   *
   * @default `color-01`
   */
  color?: string;

  /** Conteúdo que será exibido na coluna da tabela. */
  content: string;
}

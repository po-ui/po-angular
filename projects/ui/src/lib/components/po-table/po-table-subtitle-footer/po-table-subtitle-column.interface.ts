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
   * > Também é possível utilizar as 35 cores da paleta **Caption Tag Colors**:
   *
   *   - <span class="dot po-caption-tag-01"></span> `caption-tag-01` <span class="dot po-caption-tag-02"></span> `caption-tag-02` <span class="dot po-caption-tag-03"></span> `caption-tag-03` <span class="dot po-caption-tag-04"></span> `caption-tag-04` <span class="dot po-caption-tag-05"></span> `caption-tag-05`
   *   - <span class="dot po-caption-tag-06"></span> `caption-tag-06` <span class="dot po-caption-tag-07"></span> `caption-tag-07` <span class="dot po-caption-tag-08"></span> `caption-tag-08` <span class="dot po-caption-tag-09"></span> `caption-tag-09` <span class="dot po-caption-tag-10"></span> `caption-tag-10`
   *   - <span class="dot po-caption-tag-11"></span> `caption-tag-11` <span class="dot po-caption-tag-12"></span> `caption-tag-12` <span class="dot po-caption-tag-13"></span> `caption-tag-13` <span class="dot po-caption-tag-14"></span> `caption-tag-14` <span class="dot po-caption-tag-15"></span> `caption-tag-15`
   *   - <span class="dot po-caption-tag-16"></span> `caption-tag-16` <span class="dot po-caption-tag-17"></span> `caption-tag-17` <span class="dot po-caption-tag-18"></span> `caption-tag-18` <span class="dot po-caption-tag-19"></span> `caption-tag-19` <span class="dot po-caption-tag-20"></span> `caption-tag-20`
   *   - <span class="dot po-caption-tag-21"></span> `caption-tag-21` <span class="dot po-caption-tag-22"></span> `caption-tag-22` <span class="dot po-caption-tag-23"></span> `caption-tag-23` <span class="dot po-caption-tag-24"></span> `caption-tag-24` <span class="dot po-caption-tag-25"></span> `caption-tag-25`
   *   - <span class="dot po-caption-tag-26"></span> `caption-tag-26` <span class="dot po-caption-tag-27"></span> `caption-tag-27` <span class="dot po-caption-tag-28"></span> `caption-tag-28` <span class="dot po-caption-tag-29"></span> `caption-tag-29` <span class="dot po-caption-tag-30"></span> `caption-tag-30`
   *   - <span class="dot po-caption-tag-31"></span> `caption-tag-31` <span class="dot po-caption-tag-32"></span> `caption-tag-32` <span class="dot po-caption-tag-33"></span> `caption-tag-33` <span class="dot po-caption-tag-34"></span> `caption-tag-34` <span class="dot po-caption-tag-35"></span> `caption-tag-35`
   *
   * @default `color-01`
   */
  color?: string;

  /** Conteúdo que será exibido na coluna da tabela. */
  content: string;
}

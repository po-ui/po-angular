/**
 * @usedBy PoMenuComponent
 *
 * @description
 *
 * Interface do *badge* utilizado no `po-menu`.
 */
export interface PoMenuItemBadge {
  /**
   * @optional
   *
   * @description
   *
   * Define a cor do *badge* e aceita os valores:
   *
   * <span class="dot po-color-01"></span> `color-01`
   *
   * <span class="dot po-color-02"></span> `color-02`
   *
   * <span class="dot po-color-03"></span> `color-03`
   *
   * <span class="dot po-color-04"></span> `color-04`
   *
   * <span class="dot po-color-05"></span> `color-05`
   *
   * <span class="dot po-color-06"></span> `color-06`
   *
   * <span class="dot po-color-07"></span> `color-07`
   *
   * <span class="dot po-color-08"></span> `color-08`
   *
   * <span class="dot po-color-09"></span> `color-09`
   *
   * <span class="dot po-color-10"></span> `color-10`
   *
   * <span class="dot po-color-11"></span> `color-11`
   *
   * <span class="dot po-color-12"></span> `color-12`
   *
   * @default `color-07`
   */
  color?: string;

  /**
   * @description
   *
   * Número exibido no *badge*, caso o mesmo seja maior que **99** o mesmo exibe **99+**.
   */
  value: number;
}

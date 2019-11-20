/**
 * @usedBy PoTableComponent
 *
 * @description
 *
 * <a id="tableColumnIcon"></a>
 *
 * Interface que define a coluna com ícone(s) do `po-table`.
 */
export interface PoTableColumnIcon {

  /** Define a ação que será executada ao clicar no ícone. */
  action?: Function;

  /**
   * @optional
   *
   * @description
   *
   * Define a cor do ícone.
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
   */
  color?: string | Function;

  /** Função que deve retornar um booleano para habilitar ou desabilitar o ícone e sua ação. */
  disabled?: Function;

  /**
   * Ícone que será exibido, veja os valores válidos na [biblioteca de ícones](/guides/icons).
   *
   * > Caso esta propriedade não seja definida, a mesma receberá o valor contido em `value`.
   */
  icon?: string;

  /** Define um texto de ajuda que será exibido ao passar o *mouse* em cima do ícone. */
  tooltip?: string;

  /**
   * Define o valor do ícone que será exibido.
   */
  value: string;

}

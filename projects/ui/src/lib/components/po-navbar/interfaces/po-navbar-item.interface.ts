/**
 * @usedBy PoNavbarComponent
 *
 * @description
 *
 * Interface para lista de items do componente.
 */
export interface PoNavbarItem {
  /**
   * Ação que será executada, deve-se passar a referência da função.
   *
   * > Para que a função seja executada no contexto do elemento filho o mesmo deve ser passado utilizando *bind*.
   *
   * Exemplo: `action: this.myFunction.bind(this)`
   */
  action?: Function;

  /** Rótulo do item. */
  label: string;

  /** Link utilizado no redirecionamento das páginas. */
  link?: string;
}

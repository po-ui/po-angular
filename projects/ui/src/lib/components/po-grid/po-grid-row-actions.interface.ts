/**
 * @usedBy PoGridComponent
 *
 * @description
 *
 * Ações executadas durante a manipulação das linhas do grid.
 */
export interface PoGridRowActions {
  /** Método executado após uma linha do grid ser removida. */
  afterRemove?: () => void;

  /**
   * @description
   *
   * Método executado após uma linha do grid ser salva, ao ser executado, o método irá receber um objeto com os dados atualizados.
   */
  afterSave?: (row: any) => void;

  /**
   * @description
   *
   * Método executado antes de uma nova linha ser inserida no grid, se o método retornar algo diferente de `true` a ação
   * será cancelada e a linha não será inserida.
   *
   * Ao ser executado o método irá receber a referência do objeto que será inserido, dessa forma é possível informar valores
   * para esse objeto.
   *
   * ```
   *  rowActions: PoGridRowActions = {
   *    beforeInsert: this.onBeforeInsert.bind(this);
   *    ...
   *  };
   *
   *  // Inicia a linha já com as propriedades `name` e `created` preenchidas.
   *  onBeforeInsert(row: any) {
   *    row.name = 'Fulano';
   *    row.created = '2018-20-12';
   *    ...
   *
   *    return true;
   *  }
   * ```
   */
  beforeInsert?: (row: any) => boolean;

  /**
   * @description
   *
   * Método executado antes de uma linha ser removida do grid, ao ser executado, o método irá receber uma cópia do objeto
   * com os dados da linha que será removida, se o método retornar algo diferente de `true` a ação será cancelada e a linha
   * não será removida.
   */
  beforeRemove?: (row: any) => boolean;

  /**
   * @description
   *
   * Método executado antes de uma linha ser atualizada, ao ser executado, o método irá receber um objeto com os dados atualizados
   * e um objeto com uma cópia dos dados originais, se o método retornar algo diferente de `true` a ação será cancelada e
   * a linha não será atualizada permanecendo em edição / inserção.
   *
   * > Caso não seja permitido a atualização da linha, a sugestão é que seja apresentada uma mensagem ao usuário informando
   * > o motivo.
   *
   * ```
   *  rowActions: PoGridRowActions = {
   *    beforeSave: this.onBeforeSave.bind(this);
   *    ...
   *  };
   *
   *  onBeforeSave(updatedRow: any, originalRow: any) {
   *    // Verifica se a propriedade `name` foi alterada.
   *    if (updatedRow.name !== originalRow.name) {
   *      return false;
   *    }
   *
   *    // Verifica se é menor de idade
   *    if (updatedRow.age < 18) {
   *      return false;
   *    }
   *    ...
   *
   *    updatedRow.updated = '2018-20-12';
   *
   *    return true;
   *  }
   * ```
   */
  beforeSave?: (updatedRow: any, originalRow: any) => boolean;
}

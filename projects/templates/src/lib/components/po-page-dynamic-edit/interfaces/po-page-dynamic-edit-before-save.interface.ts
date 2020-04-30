/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeSave`.
 */
export interface PoPageDynamicEditBeforeSave {
  /**
   * Nova rota para salvar o recurso, que substituirá a rota definida anteriormente em `save`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação salvar (save).
   */
  allowAction?: boolean;

  /**
   * Recurso atualizado.
   *
   * Será feito uma mesclagem entre os valores existentes e esse novo objeto.
   * Por exemplo:
   *
   * - recurso anterior:
   * ```
   * { name: 'Ane' }
   * ```
   *
   * - recurso retornado no `beforeSave`:
   * ```
   * { age: 23 }
   * ```
   *
   * - Mesclagem do recurso:
   * ```
   * { name: 'Ane', age: 23 }
   * ```
   *
   * > Caso `allowAction` seja `false`, o recurso será atualizado apenas localmente, sem concluir
   * a ação de salvar (save).
   */
  resource?: any;
}

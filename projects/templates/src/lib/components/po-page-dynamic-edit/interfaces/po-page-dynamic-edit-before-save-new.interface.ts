/**
 * @usedBy PoPageDynamicEditComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeSaveNew`.
 */
export interface PoPageDynamicEditBeforeSaveNew {
  /**
   * Nova rota de redirecionamento, que substituirá a rota definida anteriormente em `saveNew`.
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação salvar e novo (saveNew).
   */
  allowAction?: boolean;

  /**
   * Recurso atualizado.
   *
   * Será feito uma mesclagem entre os valores existentes e esse novo objeto,
   * no entanto as propriedades que possuírem `key: true` não serão alteradas.
   * Por exemplo:
   *
   * - recurso anterior com a propriedade id foi que definida como *key*:
   * ```
   * { id: 1, name: 'Ane' }
   * ```
   *
   * - recurso retornado no `beforeSaveNew`:
   * ```
   * { id: 50, age: 23 }
   * ```
   *
   * - Mesclagem do recurso:
   * ```
   * { id: 1, name: 'Ane', age: 23 }
   * ```
   *
   * > Caso `allowAction` seja `false`, o recurso será atualizado apenas localmente, sem concluir
   * a ação de salvar (saveNew).
   */
  resource?: any;
}

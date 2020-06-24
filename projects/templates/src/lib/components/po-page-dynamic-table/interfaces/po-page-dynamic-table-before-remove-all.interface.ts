/**
 * @usedBy PoPageDynamicTableComponent
 *
 * @description
 *
 * Definição da estrutura de retorno da url ou método executado através da
 * propriedade `beforeRemoveAll`.
 */
export interface PoPageDynamicTableBeforeRemoveAll {
  /**
   * Nova rota para enviar o `remove all`, deve substituir a rota definida anteriormente.
   *
   * Caso o `remove all` seja configurado como função e for passado o atributo `newUrl`
   * a função será ignorada e o comando será enviado pela rota definida em `newUrl`
   *
   */
  newUrl?: string;

  /**
   * Define se deve ou não executar a ação de exclusão `(remove all)`
   */
  allowAction?: boolean;

  /**
   * Lista com as keys dos recursos que serão enviados para a ação `removeAll`
   * que por sua vez excluirá os itens da tabela.
   * Deve substituir a lista selecionada na tela pelo usuário.
   *
   * A lista é construída com todas as propriedades marcadas com o atributo `key: true`
   * na sua definição.
   * Por exemplo:
   *
   * - Recursos com as propriedades id e name definidas como *key*:
   * ```
   * [{ id: 1, name: 'Mario' },{ id: 2, name: 'Gabriel' }]
   * ```
   *
   * Esse recurso será passado para a ação `removeAll` também se for um array vazio `[]`
   */
  resources?: Array<any>;
}

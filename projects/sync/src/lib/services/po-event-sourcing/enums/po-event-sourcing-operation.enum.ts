/**
 * @docsPrivate
 *
 * Define as operações realizadas no sync.
 */

export enum PoEventSourcingOperation {
  // Operação de exclusão.
  Delete = 'DELETE',

  // Operação de requisição HTTP.
  Http = 'HTTP',

  // Operação de inserção.
  Insert = 'INSERT',

  // Operação de alteração.
  Update = 'UPDATE'
}

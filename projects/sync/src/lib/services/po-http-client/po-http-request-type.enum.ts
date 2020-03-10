/**
 * @usedBy PoHttpClientService, PoHttpCommandResponse, PoSyncService
 *
 * @description
 *
 * Define o método de requisição HTTP.
 */
export enum PoHttpRequestType {
  /** Método `delete` do protocolo HTTP. */
  DELETE = 'DELETE',

  /** Método `get` do protocolo HTTP. */
  GET = 'GET',

  /** Método `head` do protocolo HTTP. */
  HEAD = 'HEAD',

  /** Método `options` do protocolo HTTP. */
  OPTIONS = 'OPTIONS',

  /** Método `patch` do protocolo HTTP. */
  PATCH = 'PATCH',

  /** Método `post` do protocolo HTTP. */
  POST = 'POST',

  /** Método `put` do protocolo HTTP. */
  PUT = 'PUT'
}

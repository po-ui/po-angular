/**
 * @docsPrivate
 *
 * @usedBy PoHttpClientService
 *
 * @description
 *
 * Define o cabeçalho da requisição HTTP.
 */

export interface PoHttpHeaderOption {
  /** Nome do cabeçalho. */
  name: string;

  /** Valor do cabeçalho. */
  value: string;
}

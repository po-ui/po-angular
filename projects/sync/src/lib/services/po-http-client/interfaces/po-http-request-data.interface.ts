import { PoHttpHeaderOption } from './po-http-header-option.interface';
import { PoHttpRequestType } from './../po-http-request-type.enum';

/**
 * @usedBy PoSyncService
 *
 * @description
 *
 * Interface para definição de uma requisição HTTP.
 */
export interface PoHttpRequestData {
  /** URL que será utilizada na requisição. */
  url: string;

  /** Cabeçalho da requisição. */
  headers?: Array<PoHttpHeaderOption>;

  /** Método HTTP que será utilizado. */
  method: PoHttpRequestType;

  /** Corpo da requisição. */
  body?: any;
}

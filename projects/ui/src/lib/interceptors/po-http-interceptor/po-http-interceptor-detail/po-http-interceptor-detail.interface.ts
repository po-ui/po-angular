/**
 * @docsPrivate
 *
 * @usedBy PoHttpInterceptorService
 *
 * @description
 *
 * Interface para as mensagens do `po-http-interceptor`.
 */
export interface PoHttpInterceptorDetail {
  /** Código */
  code: string;

  /** Título do detalhe */
  detailTitle?: string;

  /** Mensagem detalhada */
  detailedMessage: string;

  /** Lista de detalhes da mensagem */
  details?: Array<PoHttpInterceptorDetail>;

  /** Mensagem */
  message: string;

  /** Tipo do detalhe que pode ser: success, error, warning e info */
  type?: string;
}

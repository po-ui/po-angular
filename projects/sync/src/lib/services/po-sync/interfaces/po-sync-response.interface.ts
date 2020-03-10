import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { PoEventSourcingErrorResponse } from '../../../models/po-event-sourcing-error-response.model';
import { PoHttpRequestData } from '../../po-http-client/interfaces/po-http-request-data.interface';

/**
 * @usedBy PoSyncService
 *
 * @description
 *
 * Define a resposta dos eventos enviados ao servidor.
 */
export interface PoSyncResponse {
  /** Identificador do evento na fila. */
  id: number;

  /** Identificador customizado do registro. */
  customRequestId?: string;

  /** Dados da requisição. */
  request: PoHttpRequestData;

  /** Resposta retornada após a tentativa de envio para o servidor. */
  response: HttpResponse<Object> | HttpErrorResponse | PoEventSourcingErrorResponse;
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { PoSearchAiColumn, PoSearchAiColumnInput } from './interfaces/po-search-ai-column.interface';
import { PoSearchAiRequest, PoSearchAiResponse } from './interfaces/po-search-ai.interface';

/**
 * @docsPrivate
 *
 * Serviço responsável por enviar a consulta em linguagem natural para o endpoint de IA
 * configurado no `PoSearchAiComponent` e tratar a resposta/erros.
 *
 * O serviço é agnóstico ao provedor de IA: ele apenas faz o `POST` do payload
 * (`{ query, columns }`) e padroniza o tratamento de timeout e falhas.
 */
@Injectable()
export class PoSearchAiService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  constructor(private http: HttpClient) {}

  /**
   * Envia a consulta para o endpoint de IA.
   *
   * @param url Endpoint configurado em `p-url`.
   * @param query Texto em linguagem natural digitado pelo usuário.
   * @param columns Metadados das colunas/campos disponíveis para a busca.
   * @param timeoutMs Tempo máximo de espera (ms) antes de abortar a requisição.
   */
  sendQuery(
    url: string,
    query: string,
    columns: Array<PoSearchAiColumn>,
    timeoutMs: number = 10000
  ): Observable<PoSearchAiResponse> {
    const body: PoSearchAiRequest = {
      query: this.sanitizeInput(query),
      columns
    };

    return this.http.post<PoSearchAiResponse>(url, body, { headers: this.headers }).pipe(
      timeout(timeoutMs),
      catchError(error => {
        if (error?.name === 'TimeoutError') {
          return throwError(() => ({
            statusCode: 408,
            message: 'AI search request timed out'
          }));
        }

        return throwError(() => ({
          statusCode: error?.status || 500,
          message: error?.status ? error?.message : 'AI search request failed'
        }));
      })
    );
  }

  /**
   * Extrai e normaliza os metadados das colunas para envio à IA,
   * descartando colunas sem `property` ou marcadas para serem ignoradas.
   *
   * @param columns Lista de colunas no formato bruto do componente consumidor.
   */
  extractColumnsMetadata(columns: Array<PoSearchAiColumnInput>): Array<PoSearchAiColumn> {
    if (!columns) {
      return [];
    }

    return columns
      .filter(col => col.property && col.visible !== false && !col.searchAiIgnore)
      .map(col => ({
        property: col.property,
        label: col.label || col.property,
        type: col.type || 'string'
      }));
  }

  private sanitizeInput(input: string): string {
    return (input || '')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }
}

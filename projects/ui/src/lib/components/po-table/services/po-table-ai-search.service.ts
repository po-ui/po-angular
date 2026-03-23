import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';

import {
  PoTableAiSearchColumn,
  PoTableAiSearchRequest,
  PoTableAiSearchResponse
} from '../interfaces/po-table-ai-search.interface';

@Injectable()
export class PoTableAiSearchService {
  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-No-Message': 'true'
  });

  constructor(private http: HttpClient) {}

  sendQuery(
    url: string,
    query: string,
    columns: Array<PoTableAiSearchColumn>,
    timeoutMs: number = 10000
  ): Observable<PoTableAiSearchResponse> {
    const sanitizedQuery = this.sanitizeInput(query);

    const body: PoTableAiSearchRequest = {
      query: sanitizedQuery,
      columns
    };

    return this.http.post<PoTableAiSearchResponse>(url, body, { headers: this.headers }).pipe(
      timeout(timeoutMs),
      catchError(error => {
        if (error.name === 'TimeoutError') {
          return throwError(() => ({
            statusCode: 408,
            message: 'AI search request timed out'
          }));
        }
        return throwError(() => ({
          statusCode: error.status || 500,
          message: error.message || 'AI search request failed'
        }));
      })
    );
  }

  extractColumnsMetadata(
    columns: Array<{ property?: string; label?: string; type?: string; aiSearchIgnore?: boolean; visible?: boolean }>
  ): Array<PoTableAiSearchColumn> {
    return columns
      .filter(col => col.property && col.visible !== false && !col.aiSearchIgnore)
      .map(col => ({
        property: col.property,
        label: col.label || col.property,
        type: col.type || 'string'
      }));
  }

  private sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }
}

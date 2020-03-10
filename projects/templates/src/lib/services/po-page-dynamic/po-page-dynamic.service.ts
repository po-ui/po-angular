import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicService {
  private endpoint = '/';
  private metadata: string;

  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PORTINARI-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) {}

  configServiceApi(config: { endpoint?: string; metadata?: string } = {}) {
    this.endpoint = config.endpoint;
    this.metadata = config.metadata || this.metadata;
  }

  getMetadata<T>(type: string = 'list'): Observable<T> {
    const key = `${this.endpoint}-${type}-metadata`;
    const cache = JSON.parse(localStorage.getItem(key)) || {};
    const metadataUrlBase = this.metadata || `${this.endpoint}/metadata`;

    const url = `${metadataUrlBase}?type=${type}&version=${cache.version || ''}`;

    return this.http.get<T>(url).pipe(
      map((response: any) => {
        if (response.version === cache.version) {
          return cache;
        }

        localStorage.setItem(key, JSON.stringify(response));

        return { ...cache, ...response };
      })
    );
  }

  // Deleta um único recurso
  deleteResource(id): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`, { headers: this.headers });
  }

  // Deleta recursos em lote
  deleteResources(ids: Array<any>): Observable<any> {
    return this.http.request('delete', `${this.endpoint}`, { headers: this.headers, body: ids });
  }

  // Busca uma lista de recursos
  getResources(params?: HttpParams): Observable<any> {
    return this.http.get(this.endpoint, { headers: this.headers, params });
  }

  // Busca um único recurso
  getResource(id): Observable<any> {
    return this.http.get(`${this.endpoint}/${id}`, { headers: this.headers });
  }

  // Cria um recurso
  createResource(resource): Observable<any> {
    return this.http.post(`${this.endpoint}`, resource, { headers: this.headers });
  }

  // Atualiza um recurso
  updateResource(id, resource): Observable<any> {
    return this.http.put(`${this.endpoint}/${id}`, resource, { headers: this.headers });
  }
}

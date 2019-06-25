import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PoPageDynamicService {

  private endpoint = '/';

  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PORTINARI-SCREEN-LOCK': 'true'
  });

  constructor(private http: HttpClient) { }

  configServiceApi(config: { endpoint?: string } = {}) {
    this.endpoint = config.endpoint;
  }

  getMetadata(type: string = 'list'): Observable<any> {
    const key = `${this.endpoint}-${type}-metadata`;
    const cache = JSON.parse(localStorage.getItem(key)) || {};

    const url = `${this.endpoint}/metadata?type=${type}&version=${cache.version || ''}`;

    return this.http.get(url).pipe(map((response: any) => {
      if (response.version === cache.version) {
        return cache;
      }

      localStorage.setItem(key, JSON.stringify(response));

      return  { ...cache, ...response };
    }));
  }

  // Deleta um único recurso
  deleteResource(id): Observable<any> {
    return this.http.delete(`${this.endpoint}/${id}`, { headers: this.headers });
  }

  // Deleta recursos em lote
  deleteResources(ids: Array<any>): Observable<any> {
    return this.http.request('delete', `${this.endpoint}`, { headers: this.headers, body: ids } );
  }

  // Busca uma lista de recursos
  getResources(params: {} = {}): Observable<any> {
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

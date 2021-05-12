import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { merge, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PoLanguageService, PoNotificationService } from '@po-ui/ng-components';

import { PoPageDynamicLiterals } from './po-page-dynamic-literals.interface';

export const poPageDynamicLiterals: { [key: string]: PoPageDynamicLiterals } = {
  en: {
    errorRenderPage: 'Error loading page',
    notPossibleLoadMetadataPage: 'The page metadata could not be loaded'
  },
  es: {
    errorRenderPage: 'Error al cargar la página',
    notPossibleLoadMetadataPage: 'No se pudieron cargar los metadatos de la página.'
  },
  pt: {
    errorRenderPage: 'Erro ao carregar a página',
    notPossibleLoadMetadataPage: 'Não foi possível carregar os metadados da página'
  },
  ru: {
    errorRenderPage: 'Ошибка загрузки страницы',
    notPossibleLoadMetadataPage: 'Не удалось загрузить метаданные страницы'
  }
};

@Injectable({
  providedIn: 'root'
})
export class PoPageDynamicService {
  private endpoint = '/';
  private language: string;
  private metadata: string;

  readonly headers: HttpHeaders = new HttpHeaders({
    'X-PO-SCREEN-LOCK': 'true'
  });

  constructor(
    private http: HttpClient,
    private notification: PoNotificationService,
    languageService: PoLanguageService
  ) {
    this.language = languageService.getShortLanguage();
  }

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
        if (response.version !== undefined && response.version === cache.version) {
          return cache;
        }

        localStorage.setItem(key, JSON.stringify(response));

        return { ...cache, ...response };
      }),
      catchError((error: HttpErrorResponse) => {
        if (Object.keys(cache).length) {
          return of(cache);
        }

        const { errorRenderPage, notPossibleLoadMetadataPage } = poPageDynamicLiterals[this.language];

        this.notification.warning(notPossibleLoadMetadataPage);

        return merge(of({ title: errorRenderPage }), throwError(error));
      })
    );
  }

  // Deleta um único recurso
  deleteResource(id?, endpoint?: string): Observable<any> {
    const localEndPoint = this.getLocalEndPoint(endpoint, true);
    const url = id ? `${localEndPoint}/${id}` : localEndPoint;
    return this.http.delete(url, { headers: this.headers });
  }

  // Deleta recursos em lote
  deleteResources(ids: Array<any>, endpoint?: string): Observable<any> {
    return this.http.request('delete', `${this.getLocalEndPoint(endpoint)}`, { headers: this.headers, body: ids });
  }

  // Busca uma lista de recursos
  getResources(params?: HttpParams, endpoint?: string): Observable<any> {
    return this.http.get(this.getLocalEndPoint(endpoint), { headers: this.headers, params });
  }

  // Busca um único recurso
  getResource(id, endpoint?: string): Observable<any> {
    return this.http.get(`${this.getLocalEndPoint(endpoint, true)}/${id}`, { headers: this.headers });
  }

  // Cria um recurso
  createResource(resource, endpoint?: string): Observable<any> {
    return this.http.post(`${this.getLocalEndPoint(endpoint)}`, resource, { headers: this.headers });
  }

  // Atualiza um recurso
  updateResource(id, resource, endpoint?: string): Observable<any> {
    return this.http.put(`${this.getLocalEndPoint(endpoint, true)}/${id}`, resource, { headers: this.headers });
  }

  private getLocalEndPoint(endpoint?: string, checkSingleBar = false) {
    endpoint = endpoint ?? this.endpoint;
    if (checkSingleBar) {
      endpoint = endpoint === '/' ? '' : endpoint;
    }
    return endpoint;
  }
}

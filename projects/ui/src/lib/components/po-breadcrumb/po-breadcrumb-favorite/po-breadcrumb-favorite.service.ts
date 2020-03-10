import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço utilizado para favoritar/desfavoritar uma url no componente po-breadcrumb.
 * A API deve retornar um objeto no formato { isFavorite: booleano, url: string }. Em ambos os métodos, GET e POST este
 * objeto deve ser retornado.
 * Ao alterar o status de favorito, a API deve retornar o objeto acima, com o novo status atualizado.
 * No método POST, existe a possibilidade de ser enviado parâmetros junto com a requisição. Neste caso, o objeto enviado
 * para a API terá o formato: { isFavorite: booleano, url: string, params: {} }, onde params é o objeto que pode ser enviado
 * junto com a requisição.
 *
 */
@Injectable()
export class PoBreadcrumbFavoriteService {
  private _url: string;
  private _bodyParams: object;

  get url(): string {
    return this._url;
  }

  get bodyParams(): object {
    return this._bodyParams;
  }

  constructor(private http: HttpClient) {}

  configService(url, params, item) {
    this._url = url;
    this._bodyParams = {
      isFavorite: false,
      url: item.link,
      params: params
    };
  }

  sendStatusFavorite(status): Observable<any> {
    this.bodyParams['isFavorite'] = status;
    return this.http.post(this.url, this.bodyParams);
  }

  getFavorite(): Observable<any> {
    return this.http.get(this.url, { responseType: 'json', params: { url: this.bodyParams['url'] } });
  }
}

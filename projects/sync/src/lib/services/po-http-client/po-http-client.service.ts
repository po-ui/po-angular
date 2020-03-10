import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PoHttpHeaderOption } from './interfaces/po-http-header-option.interface';
import { PoHttpRequestData } from './interfaces/po-http-request-data.interface';
import { PoHttpRequestType } from './po-http-request-type.enum';

/**
 * @docsPrivate
 *
 * @description
 *
 * Serviço para execução de requisições HTTP.
 */
@Injectable()
export class PoHttpClientService {
  constructor(private httpClient: HttpClient) {}

  /**
   * Constrói uma requisição HTTP personalizada.
   *
   * @param {PoHttpRequestData} poHttpOperationData Parâmetros para a construção
   * da requisição.
   */
  createRequest(poHttpOperationData: PoHttpRequestData): Observable<HttpResponse<Object>> {
    const httpHeaders = this.createHttpHeaders(poHttpOperationData.headers);

    return this.httpClient.request(poHttpOperationData.method, poHttpOperationData.url, {
      observe: 'response',
      headers: httpHeaders,
      body: poHttpOperationData.body
    });
  }

  /**
   * Constrói uma requisição com o método `delete`.
   *
   * @param {string} url URL da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  delete(url: string, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.DELETE,
      headers: httpHeaders
    };
    return this.createRequest(requestData);
  }

  /**
   * Constrói uma requisição com o método `get`.
   *
   * @param {string} url URL da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  get(url: string, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.GET,
      headers: httpHeaders
    };
    return this.createRequest(requestData);
  }

  /**
   * Constrói uma requisição com o método `head`.
   *
   * @param {string} url URL da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  head(url: string, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.HEAD,
      headers: httpHeaders
    };
    return this.createRequest(requestData);
  }

  /**
   * Constrói uma requisição com o método `options`.
   *
   * @param {string} url URL da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  options(url: string, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.OPTIONS,
      headers: httpHeaders
    };
    return this.createRequest(requestData);
  }

  /**
   * Constrói uma requisição com o método `patch`.
   *
   * @param {string} url URL da requisição.
   * @param {any} body Corpo da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  patch(url: string, body?: any, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.PATCH,
      headers: httpHeaders,
      body: body
    };
    return this.createRequest(requestData);
  }

  /**
   * Constrói uma requisição com o método `post`.
   *
   * @param {string} url URL da requisição.
   * @param {any} body Corpo da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  post(url: string, body?: any, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.POST,
      headers: httpHeaders,
      body: body
    };
    return this.createRequest(requestData);
  }

  /**
   * Constrói uma requisição com o método `put`.
   *
   * @param {string} url URL da requisição.
   * @param {any} body Corpo da requisição.
   * @param {Array<PoHeaderOption>} httpHeaders Cabeçalhos da requisição.
   */
  put(url: string, body?: any, httpHeaders?: Array<PoHttpHeaderOption>) {
    const requestData: PoHttpRequestData = {
      url: url,
      method: PoHttpRequestType.PUT,
      headers: httpHeaders,
      body: body
    };

    return this.createRequest(requestData);
  }

  private createHttpHeaders(poHttpOperationHeaders) {
    let httpHeaders = new HttpHeaders();

    if (poHttpOperationHeaders && poHttpOperationHeaders.length > 0) {
      poHttpOperationHeaders.forEach(
        poHttpHeader => (httpHeaders = httpHeaders.append(poHttpHeader.name, poHttpHeader.value))
      );
    }

    return httpHeaders;
  }
}

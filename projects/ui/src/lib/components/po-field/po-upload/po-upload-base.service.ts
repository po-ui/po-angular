import { Injectable, EventEmitter } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
  HttpRequest,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';

import { PoUploadFile } from './po-upload-file';

import { Observable, Subscription } from 'rxjs';

@Injectable()
export class PoUploadBaseService {
  formField: string = 'files';
  requests: Array<any> = [];

  constructor(private http: HttpClient) {}

  /**
   * Método responsável por enviar os arquivos ao servidor, conforme o parâmetro URL.
   *
   * @param url URL da requisição a ser efetuada.
   * @param files Arquivos a serem enviados.
   * @param tOnUpload Função a ser executada quando o arquivo for enviado ao servidor.
   * @param uploadCallback Função que será executada enquanto os arquivos estiverem sendo enviados.
   * @param successCallback Função a ser executada quando a requisição for efetuada com sucesso.
   * @param errorCallback Função a ser executada quando a requisição foi efetuada com sucesso.
   */
  public upload(
    url: string,
    files: Array<PoUploadFile>,
    headers: { [name: string]: string | Array<string> },
    tOnUpload: EventEmitter<any>,
    uploadCallback: (file: PoUploadFile, percent: number) => void,
    successCallback: (file: PoUploadFile, event: any) => void,
    errorCallback: (file: PoUploadFile, event: any) => void
  ) {
    const filesLength = files.length;
    const uploadEvent: any = {
      data: {},
      file: null
    };

    for (let i = 0; i < filesLength; i++) {
      const formData: FormData = new FormData();
      const file = files[i];
      const fileName = file.rawFile.name;

      formData.append(this.formField, file.rawFile, fileName);

      // Função upload, onde o desenvolvedor pode enviar dados para a requisição.
      if (tOnUpload) {
        uploadEvent['file'] = file;
        tOnUpload.emit(uploadEvent);

        formData.append('data', JSON.stringify(uploadEvent.data));
      }

      this.sendFile(url, file, headers, formData, uploadCallback, successCallback, errorCallback);
    }
  }

  public sendFile(
    url: string,
    file: PoUploadFile,
    headers: { [name: string]: string | Array<string> },
    formData: FormData,
    uploadCallback: (file: PoUploadFile, percent: number) => void,
    successCallback: (file: PoUploadFile, event: any) => void,
    errorCallback: (file: PoUploadFile, event: any) => void
  ) {
    const request = this.getRequest(url, headers, formData).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.addRequest(file, request);

          const percentDone = Math.round((100 * event.loaded) / event.total);
          uploadCallback(file, percentDone);
        } else if (event instanceof HttpResponse) {
          // Sucesso, arquivos enviados.
          successCallback(file, event);
        }
      },
      (err: HttpErrorResponse) => {
        errorCallback(file, err);
      }
    );
  }

  public getRequest(
    url: string,
    headers: { [name: string]: string | Array<string> },
    formData: FormData
  ): Observable<any> {
    const httpHeaders = new HttpHeaders(headers);

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      headers: httpHeaders
    });
    return this.http.request(req);
  }

  public stopRequestByFile(file: any, callback: () => void) {
    const requestObj = this.requests.find(req => {
      return req.file.uid === file.uid;
    });

    if (requestObj) {
      const request = requestObj.request;
      request.unsubscribe();
      this.removeRequest(requestObj);
      callback();
    }
  }

  public removeRequest(requestObj: any) {
    const index = this.requests.indexOf(requestObj);
    this.requests.splice(index, 1);
  }

  public addRequest(file: PoUploadFile, request: Subscription) {
    const hasRequest = this.requests.some(req => {
      return req.file.uid === file.uid;
    });

    if (!hasRequest) {
      this.requests.push({ file, request });
    }
  }
}

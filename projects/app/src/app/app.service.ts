import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  url = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios';
  constructor(private http: HttpClient) {}
  getMunicipios(): Observable<Array<any>> {
    console.log('getMunicipios');
    return this.http.get<Array<any>>(this.url);
  }
}

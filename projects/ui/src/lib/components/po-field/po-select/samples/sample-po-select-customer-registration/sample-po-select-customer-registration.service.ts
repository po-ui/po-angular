import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SamplePoSelectCustomerRegistrationService {
  private url: string = 'https://thf.totvs.com.br/sample/api/sampleSelect/';

  constructor(private http: HttpClient) {}

  getCitiesByState(uf: string) {
    return this.http.get(`${this.url}/getCities/${uf}`);
  }

  getStates() {
    return this.http.get(`${this.url}/getStates`);
  }
}

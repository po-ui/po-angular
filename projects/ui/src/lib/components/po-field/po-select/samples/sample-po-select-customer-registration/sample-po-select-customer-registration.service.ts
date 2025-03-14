import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SamplePoSelectCustomerRegistrationService {
  private url: string = 'https://po-sample-api.onrender.com/v1/sampleSelect';

  constructor(private http: HttpClient) {}

  getCitiesByState(uf: string) {
    return this.http.get(`${this.url}/getCities/${uf}`);
  }

  getStates() {
    return this.http.get(`${this.url}/getStates`);
  }
}

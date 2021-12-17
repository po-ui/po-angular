import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SamplePoStepperActiveService {
  private url: string = 'https://po-sample-api.herokuapp.com/v1/sampleSelect';

  constructor(private http: HttpClient) {}

  getCitiesByState(uf: string) {
    return this.http.get(`${this.url}/getCities/${uf}`);
  }

  getStates() {
    return this.http.get(`${this.url}/getStates`);
  }
}

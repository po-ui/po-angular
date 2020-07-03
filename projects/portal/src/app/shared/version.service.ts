import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor(private httpClient: HttpClient) {}

  getCurrentVersion() {
    return this.httpClient.get('./assets/json/version.json').pipe(pluck('version'));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor(private readonly httpClient: HttpClient) {}

  getCurrentVersion(): Observable<string> {
    return this.httpClient.get<{ version: string }>('./assets/json/version.json').pipe(map(res => res.version));
  }
}

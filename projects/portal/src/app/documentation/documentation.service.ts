import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Documentation } from './documentation.class';

@Injectable()
export class DocumentationService {
  constructor(private http: HttpClient) {}

  private createDocs(): Observable<Array<Documentation>> {
    return this.http
      .get('./assets/json/api-list.json', { headers: { 'X-PO-SCREEN-LOCK': 'true' } })
      .pipe(map(res => <Array<Documentation>>res));
  }

  // Get a list of docs
  findDocs(type: string): Observable<Array<Documentation>> {
    return this.createDocs();
  }

  // Find doc by name
  findDocByName(name: string): Observable<Documentation> {
    return this.createDocs().pipe(map((docs: Array<Documentation>) => docs.find(doc => doc.name === name)));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PoMenuFilter, PoMenuItemFiltered } from '@po-ui/ng-components';

@Injectable()
export class SamplePoMenuHumanResourcesService implements PoMenuFilter {
  private url: string = 'https://thf.totvs.com.br/sample/api/menus';

  constructor(private http: HttpClient) {}

  getFilteredData(search: string): Observable<Array<PoMenuItemFiltered>> {
    const params = { search };

    return this.http.get(this.url, { params }).pipe(map((response: any) => response.items));
  }
}

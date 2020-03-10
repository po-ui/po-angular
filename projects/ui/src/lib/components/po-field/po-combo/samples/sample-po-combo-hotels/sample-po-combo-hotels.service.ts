import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PoComboFilter, PoComboOption } from '@portinari/portinari-ui';

@Injectable()
export class SamplePoComboHotelsService implements PoComboFilter {
  private url: string = 'https://thf.totvs.com.br/sample/api/new/hotels';

  constructor(private http: HttpClient) {}

  getFilteredData(param, filterParams?: any): Observable<Array<PoComboOption>> {
    const params = { name: param.value };

    return this.http.get(this.url, { params }).pipe(
      map((response: any) => {
        const arrayFilter = filterParams ? response.items.filter(hotel => hotel.category === 'Luxo') : response.items;
        return this.convertToArrayComboOption(arrayFilter);
      })
    );
  }

  getObjectByValue(value): Observable<PoComboOption> {
    return this.http.get(`${this.url}/${value}`).pipe(map(item => this.convertToPoComboOption(item)));
  }

  private convertToArrayComboOption(items: Array<any>): Array<PoComboOption> {
    if (items && items.length > 0) {
      return items.map(item => this.convertToPoComboOption(item));
    }

    return [];
  }

  private convertToPoComboOption(item): PoComboOption {
    item = item || {};

    return {
      value: item['id'] || undefined,
      label: item['name'] || undefined
    };
  }
}

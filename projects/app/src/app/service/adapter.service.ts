import { Injectable } from '@angular/core';

import { Observable, catchError, map, tap } from 'rxjs';
import { PoComboFilter, PoComboOption } from '../../../../ui/src/lib';

@Injectable({
  providedIn: 'root'
})
export class AdapterService implements PoComboFilter {
  constructor() {}

  getFilteredData(params: any, filterParams?: any): Observable<RetornoInfoClienteReturn[]> {
    return new Observable(subscriber => {
      subscriber.next({
        texto: 'Hellow!'
      });
    }).pipe(
      map((value, index) => {
        let resp: Array<RetornoInfoClienteReturn> = [];
        let respfinal = [];
        for (let index = 0; index < 10; index++) {
          let newOpt: RetornoInfoClienteReturn = {
            label: 'Item ' + index,
            value: index,
            cgcCliente: Math.random().toPrecision(10).toString()
          };
          resp = [...resp, newOpt];
        }
        respfinal = resp;
        return respfinal;
      }),
      tap()
    );
  }

  getObjectByValue(value: string | number, filterParams?: any): Observable<RetornoInfoClienteReturn> {
    return new Observable().pipe(
      map(() => {
        let newOpt: RetornoInfoClienteReturn = {
          label: 'Item ' + 321321312,
          value: 321321312,
          cgcCliente: Math.random().toPrecision(10).toString()
        };

        return newOpt;
      })
    );
  }
}

export interface RetornoInfoClienteReturn extends PoComboOption {
  label: string;
  value: number;
  cgcCliente: string;
}

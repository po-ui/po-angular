import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, zip } from 'rxjs';

import { map } from 'rxjs/operators';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private data: Array<any> = [];

  private counter: number = 0;

  constructor(private http: HttpClient) {
    this.products();
  }

  public products(): any {
    this.listItems().subscribe({
      next: items => {
        this.data = items['items'];
        this.counter = this.data.length;
        console.log(this.data);
        return this.data;
      },
      error: (err: any) => {
        console.log(err);
        return [];
      }
    });
  }

  public remove(product: any): void {
    const index = this.data.findIndex(({ id }) => id === product.id);
    this.data.splice(index, 1);
  }

  public save(product: any, isNew: boolean): void {
    console.log(product);
    if (isNew) {
      product.id = this.counter++;
      this.data.splice(0, 0, product);
    } else {
      Object.assign(
        this.data.find(({ id }) => id === product.id),
        product
      );
    }
  }

  getData() {
    return this.data;
  }

  listItems(): Observable<any> {
    return this.http.get<Array<any>>('https://po-sample-api.fly.dev/v1/heroes');
  }
}

export interface Product {
  ProductID: number;
  ProductName: string;
  SupplierID: number;
  CategoryID: number;
  QuantityPerUnit: string;
  UnitPrice: number;
  UnitsInStock: number;
  UnitsOnOrder: number;
  ReorderLevel: number;
  Discontinued: boolean;
}

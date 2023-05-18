import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, zip } from 'rxjs';

import { map } from 'rxjs/operators';

const CREATE_ACTION = 'create';
const UPDATE_ACTION = 'update';
const REMOVE_ACTION = 'destroy';

const itemIndex = (item: Product, data: Product[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].ProductID === item.ProductID) {
      return idx;
    }
  }

  return -1;
};

const cloneData = (data: Product[]) => data.map(item => Object.assign({}, item));

@Injectable({
  providedIn: 'root'
})
export class EditService extends BehaviorSubject<unknown[]> {
  private data: Product[] = [];
  private originalData: Product[] = [];
  private createdItems: Product[] = [];
  private updatedItems: Product[] = [];
  private deletedItems: Product[] = [];

  constructor(private http: HttpClient) {
    super([]);
  }

  listItems(): Observable<any> {
    return this.http.get<Array<any>>('https://po-sample-api.fly.dev/v1/heroes');
  }

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }

    this.fetch().subscribe(data => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
    });
  }

  public create(item: Product): void {
    this.createdItems.push(item);
    this.data.unshift(item);

    super.next(this.data);
  }

  public update(item: Product): void {
    if (!this.isNew(item)) {
      const index = itemIndex(item, this.updatedItems);
      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }

  public remove(item: Product): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      this.deletedItems.push(item);
    }

    index = itemIndex(item, this.updatedItems);
    if (index >= 0) {
      this.updatedItems.splice(index, 1);
    }

    super.next(this.data);
  }

  public isNew(item: Product): boolean {
    return !item.ProductID;
  }

  public hasChanges(): boolean {
    return Boolean(this.deletedItems.length || this.updatedItems.length || this.createdItems.length);
  }

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    const completed = [];
    if (this.deletedItems.length) {
      completed.push(this.fetch(REMOVE_ACTION, this.deletedItems));
    }

    if (this.updatedItems.length) {
      completed.push(this.fetch(UPDATE_ACTION, this.updatedItems));
    }

    if (this.createdItems.length) {
      completed.push(this.fetch(CREATE_ACTION, this.createdItems));
    }

    this.reset();

    zip(...completed).subscribe(() => this.read());
  }

  public cancelChanges(): void {
    this.reset();

    this.data = this.originalData;
    this.originalData = cloneData(this.originalData);
    super.next(this.data);
  }

  public assignValues(target: unknown, source: unknown): void {
    Object.assign(target, source);
  }

  private reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }

  private fetch(action = '', data?: Product[]): Observable<Product[]> {
    return this.http
      .jsonp(`https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(data)}`, 'callback')
      .pipe(map(res => <Product[]>res));
  }

  private serializeModels(data?: Product[]): string {
    return data ? `&models=${JSON.stringify(data)}` : '';
  }
}

export class Product {
  public ProductID: number;
  public ProductName = '';
  public Discontinued? = false;
  public UnitsInStock?: number;
  public UnitPrice = 0;
  public Category = {
    CategoryID: 0,
    CategoryName: ''
  };
}

export class Order {
  public OrderID: number;
  public CustomerID: string;
  public EmployeeID: number;
  public OrderDate: Date;
  public RequiredDate: Date;
  public ShippedDate: Date;
  public ShipVia: number;
  public Freight: number;
  public ShipName: string;
  public ShipAddress: string;
  public ShipCity: string;
  public ShipRegion: string;
  public ShipPostalCode: string;
  public ShipCountry: string;
}

export class Customer {
  public Id = '';
  public CompanyName = '';
  public ContactName = '';
  public ContactTitle = '';
  public Address?: string = '';
  public City = '';
  public PostalCode? = '';
  public Country? = '';
  public Phone? = '';
  public Fax? = '';
}

export class Category {
  public CategoryID?: number;
  public CategoryName?: string;
  public Description?: string;
}

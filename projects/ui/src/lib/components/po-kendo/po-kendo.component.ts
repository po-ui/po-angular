import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickEvent, CellCloseEvent, GridComponent } from '@progress/kendo-angular-grid';
import { process } from '@progress/kendo-data-query';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PoKendoService } from './po-kendo.service';

@Component({
  selector: 'po-kendo',
  templateUrl: './po-kendo.component.html'
})
export class PoKendoComponent implements OnInit {
  @ViewChild(GridComponent)
  private grid: GridComponent;

  private _filterProperties = [];
  private service;
  private editedRowIndex: number;
  isService = false;
  itemsTableServiceCompleted;
  itemsTableService = [];
  columnsTable = [];

  public mySelection: Array<string> = [];
  public selectedRows: Array<any> = [];
  public deselectedRows: Array<any> = [];

  public formGroup: FormGroup;

  @Input('p-sortable') sortable: boolean = true;

  @Input('p-filter-options') filterOption: boolean = false;

  @Input('p-resizable') resizable: boolean = false;

  @Input('p-groupable') groupable: boolean = false;

  @Input('p-filter-input') filterInput: boolean = false;

  @Input('p-height') height: number = 450;

  @Input('p-page-size') pageSize: number = 20;

  @Input('p-pageable') pageable: boolean = false;

  @Input('p-selectable') selectable: boolean = false;

  @Input('p-reordable') reordable: boolean = false;

  @Input('p-action-delete') actionDelete: boolean = false;

  @Input('p-action-pdf') actionPDF: boolean = false;

  @Input('p-columns-fixed') columnsFixed: Array<string> = [];

  @Input('p-service-api') serviceUrl: string = '';

  @Input('p-filter-properties') set filterProperties(value) {
    if (value) {
      this._filterProperties = value;
    }
  }

  get filterProperties() {
    return this._filterProperties;
  }

  public gridView: Array<any>;

  public gridData: Array<any> = [];

  constructor(private activatedRoute: ActivatedRoute, private poKendoService: PoKendoService) {}

  public ngOnInit(): void {
    this.getParams();
  }

  onFilter(input) {
    const inputValue = (input.target as HTMLInputElement).value;
    const arrayFilter = this.addInputValue(this.filterProperties, inputValue);

    console.log(arrayFilter);
    this.gridView = process(this.gridData, {
      filter: {
        logic: 'or',
        filters:
          arrayFilter.length > 0
            ? arrayFilter
            : [
                {
                  field: 'name',
                  operator: 'contains',
                  value: inputValue
                }
              ]
      }
    }).data;
  }

  addInputValue(value, input) {
    return value.map(obj => ({ ...obj, value: input }));
  }

  getParams() {
    const { serviceApi } = this.activatedRoute.snapshot.data;
    this.service = serviceApi || this.serviceUrl;

    this.poKendoService.listItems(this.service).subscribe({
      next: items => {
        this.itemsTableServiceCompleted = items;
        this.itemsTableService = items['items'];
        this.gridData = items['items'];
        this.gridView = this.gridData;
        this.columnsTable = Object.keys(this.gridData[0]).filter(key => typeof this.gridData[0][key] !== 'object');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onSelectionChange(event) {
    console.log(event);
    if (event.selectedRows.length > 0) {
      this.selectedRows.push(event.selectedRows[0].dataItem);
    }
    if (event.deselectedRows.length > 0) {
      const indexColumn = this.selectedRows.findIndex(el => el.id === event.deselectedRows[0].dataItem.id);
      this.selectedRows.splice(indexColumn, 1);
    }
  }

  delete() {
    // console.log('excluir')
    // console.log(this.selectedRows[0].id)
    const id = this.selectedRows[0].id;

    this.poKendoService.deleteItem(this.service, id).subscribe({
      next: () => {
        console.log('removeu');

        const columns = [...this.gridData];
        const indexColumn = columns.findIndex(el => el.id === id);
        columns.splice(indexColumn, 1);
        this.gridData = [...columns];
        const indexSeletable = this.selectedRows.findIndex(el => el.id === id);
        this.selectedRows.splice(indexSeletable, 1);
      },
      error: error => {
        alert('erro');
      }
    });
  }

  public addHandler(): void {}

  public cellClickHandler(args: CellClickEvent) {
    console.log(args);
  }

  public cellCloseHandler(args: CellCloseEvent) {
    console.log(args);
  }

  public onStateChange(args: any) {
    console.log(args);
  }

  public cancelHandler(args: any) {
    console.log(args);
  }

  public saveHandler(args: any) {
    console.log(args);
  }

  public removeHandler(args: any) {
    console.log(args);
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);
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

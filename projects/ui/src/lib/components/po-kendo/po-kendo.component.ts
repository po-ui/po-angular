import { Component, OnInit, ViewChild, Input, Output, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CellClickEvent, CellCloseEvent, GridComponent, AddEvent } from '@progress/kendo-angular-grid';
import { process, CompositeFilterDescriptor, filterBy } from '@progress/kendo-data-query';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PoKendoService } from './po-kendo.service';
import { PoKendoEditService } from './po-kendo-edit.service';
import { PoButtonComponent } from '../po-button/po-button.component';

// EDIÇÃO

const hasClass = (el, className) => new RegExp(className).test(el.className);

const isChildOf = (el, className) => {
  while (el && el.parentElement) {
    if (hasClass(el.parentElement, className)) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
};

@Component({
  selector: 'po-kendo',
  templateUrl: './po-kendo.component.html'
})
export class PoKendoComponent implements OnInit {
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(PoButtonComponent, { read: ElementRef, static: true }) poButton: PoButtonComponent;

  private _filterProperties;
  private _filterPropertiesInput = [];
  private service;
  isService = false;
  itemsTableServiceCompleted;
  itemsTableService = [];
  columnsTable = [];

  public mySelection: Array<string> = [];
  public selectedRows: Array<any> = [];
  public deselectedRows: Array<any> = [];
  public typeSecondary = 'secondary';
  public opened = false;
  public filterValue: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  public formGroup: FormGroup;
  public view: Array<any>;
  private editedRowIndex: number;
  private isNew = false;

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

  @Input('p-form-group') formGroupConfig;

  @Input('p-form-group-values-default') formGroupValuesDefault;

  @Input('p-filter-properties') set filterProperties(value) {
    if (value) {
      this._filterProperties = value;
    }
  }

  get filterProperties() {
    return this._filterProperties;
  }

  @Input('p-filter-properties-input') set filterPropertiesInput(value) {
    if (value) {
      this._filterPropertiesInput = value;
    }
  }

  get filterPropertiesInput() {
    return this._filterPropertiesInput;
  }

  public gridView: Array<any>;

  public gridData: Array<any> = [];

  constructor(
    public poKendoEditService: PoKendoEditService,
    private activatedRoute: ActivatedRoute,
    private poKendoService: PoKendoService,
    private renderer: Renderer2
  ) {}

  public ngOnInit(): void {
    this.getParams();

    if (this.formGroupConfig) {
      this.renderer.listen('document', 'click', ({ target }) => {
        if (!isChildOf(target, 'k-grid')) {
          this.saveCurrent();
        }
      });
    }
  }

  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  public open(): void {
    this.opened = true;
  }

  public close(): void {
    this.opened = false;
  }

  onFilter(input) {
    const inputValue = (input.target as HTMLInputElement).value;
    const arrayFilter = this.addInputValue(this.filterPropertiesInput, inputValue);

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
        this.poKendoEditService.setData(this.gridData);
        this.columnsTable = Object.keys(this.gridData[0]).filter(key => typeof this.gridData[0][key] !== 'object');
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  onSelectionChange(event) {
    if (event.selectedRows.length > 0) {
      this.selectedRows.push(event.selectedRows[0].dataItem);
    }
    if (event.deselectedRows.length > 0) {
      const indexColumn = this.selectedRows.findIndex(el => el.id === event.deselectedRows[0].dataItem.id);
      this.selectedRows.splice(indexColumn, 1);
    }
  }

  delete() {
    const id = this.selectedRows[0].id;

    this.poKendoService.deleteItem(this.service, id).subscribe({
      next: () => {
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

  public applyFilter(value: CompositeFilterDescriptor): void {
    this.gridData = filterBy(this.gridView, value);
    this.filterValue = value;
  }

  // EDIÇÃO TABELA

  public addHandler({ sender }: AddEvent): void {
    if (this.formGroupConfig) {
      this.closeEditor(sender);

      this.formGroup = this.formGroupConfig(this.formGroupValuesDefault || {});

      this.isNew = true;
      sender.addRow(this.formGroup);
    }
  }

  public editHandler({ sender, columnIndex, rowIndex, dataItem }: CellClickEvent): void {
    if (this.formGroupConfig) {
      if (this.formGroup && !this.formGroup.valid) {
        return;
      }

      this.saveRow();
      this.formGroup = this.formGroupConfig(dataItem);
      this.editedRowIndex = rowIndex;

      sender.editRow(rowIndex, this.formGroup, { columnIndex });
    }
  }

  public cancelHandler(): void {
    this.closeEditor(this.grid, this.editedRowIndex);
  }

  public saveCurrent(): void {
    if (this.formGroup && !this.formGroup.valid) {
      return;
    }
    this.saveRow();
  }

  public ordenar(direction, item) {
    const index = this.columnsTable.indexOf(item);

    if (direction === 'cima') {
      this.columnsTable.splice(index, 0, this.columnsTable.splice(index - 1, 1)[0]);
    }

    if (direction === 'baixo') {
      this.columnsTable.splice(index, 0, this.columnsTable.splice(index + 1, 1)[0]);
    }
  }

  verifyArrowDisabled(direction, item) {
    const index = this.columnsTable.indexOf(item);
    if (direction === 'cima' && index === 0) {
      return true;
    }

    if (direction === 'baixo' && index === this.columnsTable.length - 1) {
      return true;
    }

    return false;
  }

  private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
    this.isNew = false;
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  private saveRow(): void {
    if (this.isInEditingMode) {
      this.poKendoEditService.edit(this.service, this.formGroup.value.id, this.formGroup.value).subscribe({
        next: () => {
          this.poKendoEditService.save(this.formGroup.value, this.isNew);
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          this.closeEditor(this.grid);
        }
      });
    }
  }
}

// {
//   "value": 1495833068594,
//   "label": "Steve Rogers",
//   "id": 1495833068594,
//   "name": "Steve Rogers",
//   "nickname": "Capitao America",
//   "email": "Capitao America"
// }

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

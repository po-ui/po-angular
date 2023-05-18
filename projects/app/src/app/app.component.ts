import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';

import {
  AddEvent,
  GridDataResult,
  CellClickEvent,
  CellCloseEvent,
  SaveEvent,
  CancelEvent,
  GridComponent,
  RemoveEvent
} from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { Keys } from '@progress/kendo-angular-common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { EditService } from './edit.service';

const createFormGroup = dataItem =>
  new FormGroup({
    value: new FormControl(dataItem.value),
    label: new FormControl(dataItem.label),
    id: new FormControl(dataItem.id),
    name: new FormControl(dataItem.name),
    nickname: new FormControl(dataItem.nickname),
    email: new FormControl(dataItem.email)
  });

const matches = (el, selector) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  @ViewChild(GridComponent)
  private grid: GridComponent;

  public view: unknown[];

  public formGroup: FormGroup;

  private editedRowIndex: number;
  private docClickSubscription: Subscription = new Subscription();
  private isNew: boolean;

  constructor(private renderer: Renderer2, private editService: EditService) {}

  public ngOnInit(): void {
    this.editService.listItems().subscribe({
      next: items => {
        this.view = items['items'];
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.docClickSubscription.add(this.renderer.listen('document', 'click', this.onDocumentClick.bind(this)));
  }

  public ngOnDestroy(): void {
    this.docClickSubscription.unsubscribe();
  }

  public addHandler(): void {
    this.closeEditor();

    this.formGroup = createFormGroup({
      value: '',
      label: '',
      id: '',
      name: '',
      nickname: '',
      email: ''
    });
    this.isNew = true;

    this.grid.addRow(this.formGroup);
  }

  public saveRow(): void {
    if (this.formGroup && this.formGroup.valid) {
      this.saveCurrent();
    }
  }

  public cellClickHandler({ isEdited, dataItem, rowIndex }: CellClickEvent): void {
    if (isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }

    if (this.isNew) {
      rowIndex += 1;
    }

    this.saveCurrent();

    this.formGroup = createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;

    this.grid.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler(): void {
    this.closeEditor();
  }

  private closeEditor(): void {
    this.grid.closeRow(this.editedRowIndex);

    this.isNew = false;
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  private onDocumentClick(e: Event): void {
    // if (
    //     this.formGroup &&
    //     this.formGroup.valid &&
    //     !matches(e.target, '#productsGrid tbody *, #productsGrid .k-grid-toolbar .k-button')
    // ) {
    //     this.saveCurrent();
    // }
  }

  private saveCurrent(): void {
    if (this.formGroup) {
      // this.service.save(this.formGroup.value, this.isNew);
      // this.closeEditor();
    }
  }

  private products() {
    return [
      {
        'ProductID': 1,
        'ProductName': 'Chai',
        'SupplierID': 1,
        'CategoryID': 1,
        'QuantityPerUnit': '10 boxes x 20 bags',
        'UnitPrice': 18.0,
        'UnitsInStock': 39,
        'UnitsOnOrder': 0,
        'ReorderLevel': 10,
        'Discontinued': false
      },
      {
        'ProductID': 2,
        'ProductName': 'Chang',
        'SupplierID': 1,
        'CategoryID': 1,
        'QuantityPerUnit': '24 - 12 oz bottles',
        'UnitPrice': 19.0,
        'UnitsInStock': 17,
        'UnitsOnOrder': 40,
        'ReorderLevel': 25,
        'Discontinued': false
      },
      {
        'ProductID': 3,
        'ProductName': 'Aniseed Syrup',
        'SupplierID': 1,
        'CategoryID': 2,
        'QuantityPerUnit': '12 - 550 ml bottles',
        'UnitPrice': 10.0,
        'UnitsInStock': 13,
        'UnitsOnOrder': 70,
        'ReorderLevel': 25,
        'Discontinued': false
      },
      {
        'ProductID': 4,
        'ProductName': "Chef Anton's Cajun Seasoning",
        'SupplierID': 2,
        'CategoryID': 2,
        'QuantityPerUnit': '48 - 6 oz jars',
        'UnitPrice': 22.0,
        'UnitsInStock': 53,
        'UnitsOnOrder': 0,
        'ReorderLevel': 0,
        'Discontinued': false
      },
      {
        'ProductID': 5,
        'ProductName': "Chef Anton's Gumbo Mix",
        'SupplierID': 2,
        'CategoryID': 2,
        'QuantityPerUnit': '36 boxes',
        'UnitPrice': 21.35,
        'UnitsInStock': 0,
        'UnitsOnOrder': 0,
        'ReorderLevel': 0,
        'Discontinued': true
      },
      {
        'ProductID': 6,
        'ProductName': "Grandma's Boysenberry Spread",
        'SupplierID': 3,
        'CategoryID': 2,
        'QuantityPerUnit': '12 - 8 oz jars',
        'UnitPrice': 25.0,
        'UnitsInStock': 120,
        'UnitsOnOrder': 0,
        'ReorderLevel': 25,
        'Discontinued': false
      },
      {
        'ProductID': 7,
        'ProductName': "Uncle Bob's Organic Dried Pears",
        'SupplierID': 3,
        'CategoryID': 7,
        'QuantityPerUnit': '12 - 1 lb pkgs.',
        'UnitPrice': 30.0,
        'UnitsInStock': 15,
        'UnitsOnOrder': 0,
        'ReorderLevel': 10,
        'Discontinued': false
      },
      {
        'ProductID': 8,
        'ProductName': 'Northwoods Cranberry Sauce',
        'SupplierID': 3,
        'CategoryID': 2,
        'QuantityPerUnit': '12 - 12 oz jars',
        'UnitPrice': 40.0,
        'UnitsInStock': 6,
        'UnitsOnOrder': 0,
        'ReorderLevel': 0,
        'Discontinued': false
      }
    ];
  }
}

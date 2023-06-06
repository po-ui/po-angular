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

const formGroup = dataItem =>
  new FormGroup({
    label: new FormControl(dataItem.label),
    nickname: new FormControl(dataItem.nickname, Validators.required),
    id: new FormControl(dataItem.id),
    name: new FormControl(dataItem.name),
    value: new FormControl(dataItem.value, Validators.compose([Validators.required]))
  });

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
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  value = '- q';

  public formGroup: FormGroup;
  public view: unknown[];
  @ViewChild(GridComponent) private grid: GridComponent;
  private editedRowIndex: number;
  private isNew = false;

  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  constructor(public service: EditService, private renderer: Renderer2) {}

  public ngOnInit(): void {
    // this.service.listItems().subscribe({
    //   next: items => {
    //     this.view = items['items'];
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //     this.view =  [];
    //   }
    // });
    // this.renderer.listen('document', 'click', ({ target }) => {
    //   if (!isChildOf(target, 'k-grid')) {
    //     this.saveCurrent();
    //   }
    // });
  }
  public addHandler({ sender }: AddEvent): void {
    this.closeEditor(sender);

    this.formGroup = formGroup({
      label: '',
      nickname: '',
      name: '',
      UnitsInStock: ''
    });

    this.isNew = true;
    sender.addRow(this.formGroup);
  }

  public editHandler({ sender, columnIndex, rowIndex, dataItem }: CellClickEvent): void {
    console.log('cliquei fora');

    if (this.formGroup && !this.formGroup.valid) {
      return;
    }

    this.saveRow();
    this.formGroup = formGroup(dataItem);
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup, { columnIndex });
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

  private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
    this.isNew = false;
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  private saveRow(): void {
    if (this.isInEditingMode) {
      this.service.save(this.formGroup.value, this.isNew);
    }

    this.closeEditor(this.grid);
  }
}

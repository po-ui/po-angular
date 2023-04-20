import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoLookupModalBaseComponent } from '../po-lookup-modal/po-lookup-modal-base.component';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';
import { PoDynamicFormComponent } from './../../../po-dynamic/po-dynamic-form/po-dynamic-form.component';
import { PoTableComponent } from './../../../po-table/po-table.component';
import { sortArrayOfObjects } from '../../../../utils/util';

/**
 * @docsPrivate
 *
 * @docsExtends PoLookupModalBaseComponent
 */
@Component({
  selector: 'po-lookup-modal',
  templateUrl: './po-lookup-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoLookupModalComponent extends PoLookupModalBaseComponent implements OnInit, AfterViewInit {
  @ViewChild(PoTableComponent, { static: true }) poTable: PoTableComponent;
  @ViewChild('inpsearch') inputSearchEl: ElementRef;
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  keyUpObservable: Observable<any> = null;

  tableHeight: number;

  componentRef: ComponentRef<PoDynamicFormComponent>;
  dynamicForm: NgForm;

  constructor(
    private componentFactory: ComponentFactoryResolver,
    poLanguage: PoLanguageService,
    changeDetector: ChangeDetectorRef
  ) {
    super(poLanguage, changeDetector);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setTableHeight();
  }

  ngAfterViewInit() {
    this.initializeEventInput();
  }

  // Seleciona um item na tabela
  onSelect(item) {
    if (this.multiple) {
      this.selecteds = [...this.selecteds, { value: item[this.fieldValue], label: item[this.fieldLabel], ...item }];
    } else {
      this.selecteds = [{ value: item[this.fieldValue], label: item[this.fieldLabel], ...item }];
    }
  }

  // Remove a seleção de um item na tabela
  onUnselect(unselectedItem) {
    this.selecteds = this.selecteds.filter(itemSelected => itemSelected.value !== unselectedItem[this.fieldValue]);
  }

  onUnselectFromDisclaimer(removedDisclaimer) {
    this.poTable.unselectRowItem(item => item[this.fieldValue] === removedDisclaimer.value);
  }

  // Seleciona todos os itens visíveis na tabela
  onAllSelected(items) {
    this.selecteds = items.map(item => ({ value: item[this.fieldValue], label: item[this.fieldLabel], ...item }));
  }

  // Remove a seleção de todos os itens visíveis na tabela
  onAllUnselected(items) {
    this.poTable.unselectRows();
    this.selecteds = [];
  }

  initializeEventInput(): void {
    this.keyUpObservable = fromEvent(this.inputSearchEl.nativeElement, 'keyup').pipe(
      filter((e: any) => this.validateEnterPressed(e)),
      debounceTime(400)
    );

    this.keyUpObservable.subscribe(() => {
      this.search();
      this.changeDetector.detectChanges();
    });
  }

  openModal() {
    this.poModal.open();
  }

  sortBy(sort: PoTableColumnSort) {
    const order = sort.type === 'ascending' ? true : false;
    sortArrayOfObjects(this.items, sort.column.property, order);

    this.sort = sort;
  }

  destroyDynamicForm() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  onAdvancedFilter() {
    this.setupModalAdvancedFilter();
    this.createDynamicForm();
  }

  private setTableHeight() {
    this.tableHeight = this.infiniteScroll ? 515 : 615;
  }

  private validateEnterPressed(e: any) {
    return e.keyCode === 13;
  }

  private setupModalAdvancedFilter() {
    this.dynamicFormValue = {};
    this.isAdvancedFilter = true;
  }

  private createDynamicForm() {
    const component = this.componentFactory.resolveComponentFactory(PoDynamicFormComponent);

    this.componentRef = this.container.createComponent<PoDynamicFormComponent>(component);
    this.componentRef.instance.fields = this.advancedFilters;
    this.componentRef.instance.value = this.dynamicFormValue;

    this.componentRef.instance.formOutput
      .pipe(
        tap(form => {
          this.dynamicForm = form;
          this.primaryActionAdvancedFilter.disabled = this.dynamicForm.invalid;
        }),
        switchMap(form => form.valueChanges)
      )
      .subscribe(() => {
        this.primaryActionAdvancedFilter.disabled = this.dynamicForm.invalid;
      });
    this.changeDetector.markForCheck();
  }
}

import {
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
import { sortArrayOfObjects } from '../../../../utils/util';

/**
 * @docsPrivate
 *
 * @docsExtends PoLookupModalBaseComponent
 */
@Component({
  selector: 'po-lookup-modal',
  templateUrl: './po-lookup-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoLookupModalComponent extends PoLookupModalBaseComponent implements OnInit {
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

  // Seleciona um item na tabela
  onSelect(item) {
    const formattedItem = {
      value: item[this.fieldValue],
      label: item[this.fieldLabel],
      ...item
    };
    if (this.multiple) {
      this.selectedItems = this.selectedItems ? [...this.selectedItems, formattedItem] : [formattedItem];
    } else {
      this.selectedItems = [formattedItem];
    }
    this.selecteds = [...this.selectedItems];
  }

  // Remove a seleção de um item na tabela
  onUnselect(unselectedItem) {
    if (this.multiple) {
      this.selectedItems = this.selectedItems.filter(item => item.value !== unselectedItem[this.fieldValue]);
    } else {
      this.selectedItems = [];
    }
    this.selecteds = [...this.selectedItems];
  }

  onUnselectFromDisclaimer(removedDisclaimer) {
    this.selectedItems = this.selectedItems.filter(item => item.value !== removedDisclaimer.value);
    if (this.selectedItems.length === 0) {
      this.selecteds = [];
    } else {
      this.selecteds = [...this.selectedItems];
    }
    this.poTable.unselectRowItem(item => item[this.fieldValue] === removedDisclaimer.value);
  }

  // Seleciona todos os itens visíveis na tabela
  onAllSelected(items) {
    this.selectedItems = items.map(item => ({ value: item[this.fieldValue], label: item[this.fieldLabel], ...item }));
    this.selecteds = [...this.selectedItems];
  }

  // Remove a seleção de todos os itens visíveis na tabela
  onAllUnselected(items) {
    this.poTable.unselectRows();
    this.selectedItems = [];
    this.selecteds = [];
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

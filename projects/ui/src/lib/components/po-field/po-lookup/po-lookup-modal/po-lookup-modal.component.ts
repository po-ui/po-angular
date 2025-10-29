import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { sortArrayOfObjects } from '../../../../utils/util';
import { PoTableColumnSpacing } from '../../../po-table';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoLookupModalBaseComponent } from '../po-lookup-modal/po-lookup-modal-base.component';
import { PoLanguageService } from './../../../../services/po-language/po-language.service';

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

  componentRef: ComponentRef<any>;
  dynamicForm: NgForm;

  constructor() {
    const poLanguage = inject(PoLanguageService);
    const changeDetector = inject(ChangeDetectorRef);

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
    const newItems = items
      .filter(item => !this.selectedItems?.some(selected => selected[this.fieldValue] === item[this.fieldValue]))
      .map(item => ({
        value: item[this.fieldValue],
        label: item[this.fieldLabel],
        ...item
      }));

    this.selectedItems = [...this.selectedItems, ...newItems];
    this.selecteds = [...this.selectedItems];
  }

  // Remove a seleção de todos os itens visíveis na tabela
  onAllUnselected(items) {
    const newItems = this.selectedItems?.filter(
      item => !items.some(selected => selected[this.fieldValue] === item[this.fieldValue])
    );

    if (newItems?.length) {
      this.selectedItems = [...newItems];
      this.selecteds = [...this.selectedItems];
    } else {
      this.selectedItems = [];
      this.selecteds = [];
    }
  }

  onAllUnselectedTag(items) {
    this.poTable.unselectRows();
    this.selectedItems = [];
    this.selecteds = [];
  }

  openModal() {
    this.poModal.open();
  }

  sortBy(sort: PoTableColumnSort) {
    const order = sort.type === 'ascending';
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
    const rowHeightMap = {
      [PoTableColumnSpacing.ExtraSmall]: 32,
      [PoTableColumnSpacing.Small]: 40,
      [PoTableColumnSpacing.Medium]: 48,
      [PoTableColumnSpacing.Large]: 56
    };
    const extraHeight = this.infiniteScroll ? 35 : 135;
    const currentRowHeight = rowHeightMap[this.spacing || PoTableColumnSpacing.Medium];
    this.tableHeight = currentRowHeight * 10 + extraHeight;
  }

  private setupModalAdvancedFilter() {
    this.dynamicFormValue = {};
    this.isAdvancedFilter = true;
  }

  private createDynamicForm() {
    // Utilizado o `import` para quebrar a dependência circular
    // PoDynamicFormComponent -> PoDynamicFormFieldsComponent-> PoLookupComponent ->
    //  PoLookupModalService -> PoLookupModalComponent -> PoDynamicFormComponent

    // eslint-disable-next-line @typescript-eslint/naming-convention
    import('./../../../po-dynamic/po-dynamic-form/po-dynamic-form.component').then(({ PoDynamicFormComponent }) => {
      this.componentRef = this.container.createComponent(PoDynamicFormComponent);
      this.componentRef.instance.fields = this.advancedFilters;
      this.componentRef.instance.value = this.dynamicFormValue;
      this.componentRef.instance.componentsSize = this.size;

      this.componentRef.instance.formOutput
        .pipe(
          tap((form: NgForm) => {
            this.dynamicForm = form;
            this.primaryActionAdvancedFilter.disabled = this.dynamicForm.invalid;
          }),
          switchMap((form: NgForm) => form.valueChanges)
        )
        .subscribe(() => {
          this.primaryActionAdvancedFilter.disabled = this.dynamicForm.invalid;
        });
      this.changeDetector.markForCheck();
    });
  }
}

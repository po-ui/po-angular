import { EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Directive } from '@angular/core';

import { Observable , Subscription } from 'rxjs';
import { browserLanguage, isTypeof, poLocaleDefault } from '../../../../utils/util';
import { PoModalAction } from '../../../../components/po-modal';
import { PoModalComponent } from '../../../../components/po-modal/po-modal.component';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoTableColumnSortType } from '../../../po-table';
import { poTableLiteralsDefault } from '../../../po-table/po-table-base.component';

import { PoLookupColumn } from '../interfaces/po-lookup-column.interface';
import { PoLookupFilter } from '../interfaces/po-lookup-filter.interface';
import { PoLookupFilteredItemsParams } from '../interfaces/po-lookup-filtered-items-params.interface';
import { PoLookupLiterals } from '../interfaces/po-lookup-literals.interface';
import { PoLookupResponseApi } from '../interfaces/po-lookup-response-api.interface';

export const poLookupLiteralsDefault = {
  en: <PoLookupLiterals> {
    modalPrimaryActionLabel: 'Select',
    modalSecondaryActionLabel: 'Cancel',
    modalPlaceholder: 'Search',
    modalTitle: 'Select a record',
    modalTableNoColumns: poTableLiteralsDefault.en.noColumns,
    modalTableNoData: poTableLiteralsDefault.en.noData,
    modalTableLoadingData: poTableLiteralsDefault.en.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.en.loadMoreData
  },
  es: <PoLookupLiterals> {
    modalPrimaryActionLabel: 'Seleccionar',
    modalSecondaryActionLabel: 'Cancelar',
    modalPlaceholder: 'Buscar',
    modalTitle: 'Seleccione un registro',
    modalTableNoColumns: poTableLiteralsDefault.es.noColumns,
    modalTableNoData: poTableLiteralsDefault.es.noData,
    modalTableLoadingData: poTableLiteralsDefault.es.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.es.loadMoreData
  },
  pt: <PoLookupLiterals> {
    modalPrimaryActionLabel: 'Selecionar',
    modalSecondaryActionLabel: 'Cancelar',
    modalPlaceholder: 'Pesquisar',
    modalTitle: 'Selecione um registro',
    modalTableNoColumns: poTableLiteralsDefault.pt.noColumns,
    modalTableNoData: poTableLiteralsDefault.pt.noData,
    modalTableLoadingData: poTableLiteralsDefault.pt.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.pt.loadMoreData
  },
  ru: <PoLookupLiterals>{
    modalPrimaryActionLabel: 'выбирать',
    modalSecondaryActionLabel: 'отменить',
    modalPlaceholder: 'поиск',
    modalTitle: 'Выберите запись',
    modalTableNoColumns: poTableLiteralsDefault.ru.noColumns,
    modalTableNoData: poTableLiteralsDefault.ru.noData,
    modalTableLoadingData: poTableLiteralsDefault.ru.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.ru.loadMoreData
  }
};

/**
 * @docsPrivate
 *
 * Classe base do componente Po Lookup Modal.
 */
@Directive()
export abstract class PoLookupModalBaseComponent implements OnDestroy, OnInit {

  private _literals: any;
  private _title: any;

  hasNext = true;
  isLoading = false;
  page = 1;
  pageSize = 10;
  primaryAction: PoModalAction = {
    action: () => {
      this.items.forEach(element => {
        if (element['$selected']) {
          this.model.emit(element);
          this.poModal.close();
        }
      });
    },
    label: this.literals.modalPrimaryActionLabel
  };
  searchValue: string = '';
  secondaryAction: PoModalAction = {
    action: () => {
      this.model.emit(null);
      this.poModal.close();
    },
    label: this.literals.modalSecondaryActionLabel
  };
  tableLiterals: any;

  protected sort: PoTableColumnSort;

  private filterSubscription: Subscription;
  private searchSubscription: Subscription;
  private showMoreSubscription: Subscription;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  /**
   * Lista das colunas da tabela.
   * Essa propriedade deve receber um array de objetos que implementam a interface PoLookupColumn.
   */
  @Input('p-columns') columns: Array<PoLookupColumn>;

  /** Lista de itens da tabela. */
  @Input('p-items') items: Array<any>;

  /** Objeto com as literais usadas no `po-lookup-modal`. */
  @Input('p-literals') set literals(value: PoLookupLiterals) {
    if (value instanceof Object && !(value instanceof Array)) {
      this._literals = {
        ...poLookupLiteralsDefault[poLocaleDefault],
        ...poLookupLiteralsDefault[browserLanguage()],
        ...value
      };
      if (value.modalTitle) {
        this.title = this.literals.modalTitle;
      }
    } else {
      this._literals = poLookupLiteralsDefault[browserLanguage()];
    }
    this.primaryAction.label = this.literals.modalPrimaryActionLabel;
    this.secondaryAction.label = this.literals.modalSecondaryActionLabel;
    this.setTableLiterals();
  }

  get literals() {
    return this._literals || poLookupLiteralsDefault[browserLanguage()];
  }

  /** Título da modal. */
  @Input('p-title') set title(value: string) {
    this._title = isTypeof(value, 'string') ? value : this.literals.modalTitle;
  }

  get title() {
    return this._title;
  }

  /** Classe de serviço com a implementação do cliente. */
  @Input('p-filter-service') filterService: PoLookupFilter;

  /** Classe de serviço com a implementação do cliente. */
  @Input('p-filter-params') filterParams: any;

  /** Evento utilizado ao selecionar um registro da tabela. */
  @Output('p-change-model') model: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    if (this.showMoreSubscription) {
      this.showMoreSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.initializeData();
    this.setTableLiterals();
  }

  search(): void {
    this.page = 1;
    if (this.searchValue) {
      this.isLoading = true;
      this.searchSubscription = this.getFilteredItems(this.searchValue).subscribe(data => {
        this.items = data.items;
        this.hasNext = data.hasNext;
        this.isLoading = false;
      });
    } else {
      this.initializeData();
    }
  }

  showMoreEvent() {
    this.page ++;
    this.isLoading = true;
    this.showMoreSubscription = this.getFilteredItems(this.searchValue).subscribe(data => {
      data.items.forEach(item => {
        this.items.push(item);
      });
      this.hasNext = data.hasNext;
      this.isLoading = false;
    });
  }

  // Método responsável por abrir a modal de busca das informações.
  abstract openModal(): void;

  private getFilteredItems(filter: string): Observable<PoLookupResponseApi> {
    const { page, pageSize, filterParams } = this;

    if (this.filterService.getFilteredItems) {
      const filteredParams: PoLookupFilteredItemsParams = this.getFilteredParams(filter);

      return this.filterService.getFilteredItems(filteredParams);
    }

    return this.filterService.getFilteredData(filter, page, pageSize, filterParams);
  }

  private getFilteredParams(filter: string) {
    const { page, pageSize, filterParams, sort } = this;

    const filteredParams = {};
    const order = this.getOrderParam(sort);
    const params = { filter, page, pageSize, order, filterParams };

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key]) {
        filteredParams[key] = params[key];
      }
    }

    return filteredParams;
  }

  private getOrderParam(sort: PoTableColumnSort = { type: undefined }) {
    const { column, type } = sort;

    if (!column) {
      return;
    }

    if (type === PoTableColumnSortType.Descending) {
      return `-${column.property}`;
    }

    return `${column.property}`;
  }

  private initializeData(): void {
    this.isLoading = true;

    this.filterSubscription = this.getFilteredItems('').subscribe(data => {
      this.items = data.items;
      this.hasNext = data.hasNext;
      this.isLoading = false;
    });
  }

  private setTableLiterals() {
    this.tableLiterals = {
      'noColumns': this.literals.modalTableNoColumns,
      'noData': this.literals.modalTableNoData,
      'loadingData': this.literals.modalTableLoadingData,
      'loadMoreData': this.literals.modalTableLoadMoreData,
    };
  }

}

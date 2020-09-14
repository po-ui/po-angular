import { EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, Directive } from '@angular/core';

import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { isTypeof } from '../../../../utils/util';
import { poLocaleDefault } from '../../../../services/po-language/po-language.constant';
import { PoModalAction } from '../../../../components/po-modal';
import { PoModalComponent } from '../../../../components/po-modal/po-modal.component';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { PoTableColumnSortType } from '../../../po-table';
import { poTableLiteralsDefault } from '../../../po-table/po-table-base.component';
import { PoLanguageService } from '../../../../services/po-language/po-language.service';

import { PoLookupColumn } from '../interfaces/po-lookup-column.interface';
import { PoLookupFilter } from '../interfaces/po-lookup-filter.interface';
import { PoLookupFilteredItemsParams } from '../interfaces/po-lookup-filtered-items-params.interface';
import { PoLookupLiterals } from '../interfaces/po-lookup-literals.interface';
import { PoLookupResponseApi } from '../interfaces/po-lookup-response-api.interface';
import { PoDisclaimer } from './../../../po-disclaimer/po-disclaimer.interface';
import { PoDisclaimerGroup } from './../../../po-disclaimer-group/po-disclaimer-group.interface';
import { PoLookupAdvancedFilter } from '../interfaces/po-lookup-advanced-filter.interface';

export const poLookupLiteralsDefault = {
  en: <PoLookupLiterals>{
    modalPrimaryActionLabel: 'Select',
    modalSecondaryActionLabel: 'Cancel',
    modalPlaceholder: 'Search',
    modalTitle: 'Select a record',
    modalTableNoColumns: poTableLiteralsDefault.en.noColumns,
    modalTableNoData: poTableLiteralsDefault.en.noData,
    modalTableLoadingData: poTableLiteralsDefault.en.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.en.loadMoreData,
    modalAdvancedSearch: 'Advanced search',
    modalAdvancedSearchTitle: 'Advanced search',
    modalAdvancedSearchPrimaryActionLabel: 'Filter',
    modalAdvancedSearchSecondaryActionLabel: 'Return',
    modalDisclaimerGroupTitle: 'Presenting results filtered by:'
  },
  es: <PoLookupLiterals>{
    modalPrimaryActionLabel: 'Seleccionar',
    modalSecondaryActionLabel: 'Cancelar',
    modalPlaceholder: 'Buscar',
    modalTitle: 'Seleccione un registro',
    modalTableNoColumns: poTableLiteralsDefault.es.noColumns,
    modalTableNoData: poTableLiteralsDefault.es.noData,
    modalTableLoadingData: poTableLiteralsDefault.es.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.es.loadMoreData,
    modalAdvancedSearch: 'Búsqueda Avanzada',
    modalAdvancedSearchTitle: 'Búsqueda Avanzada',
    modalAdvancedSearchPrimaryActionLabel: 'Filtrar',
    modalAdvancedSearchSecondaryActionLabel: 'Vuelve',
    modalDisclaimerGroupTitle: 'Presentar resultados filtrados por:'
  },
  pt: <PoLookupLiterals>{
    modalPrimaryActionLabel: 'Selecionar',
    modalSecondaryActionLabel: 'Cancelar',
    modalPlaceholder: 'Pesquisar',
    modalTitle: 'Selecione um registro',
    modalTableNoColumns: poTableLiteralsDefault.pt.noColumns,
    modalTableNoData: poTableLiteralsDefault.pt.noData,
    modalTableLoadingData: poTableLiteralsDefault.pt.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.pt.loadMoreData,
    modalAdvancedSearch: 'Busca avançada',
    modalAdvancedSearchTitle: 'Busca Avançada',
    modalAdvancedSearchPrimaryActionLabel: 'Filtrar',
    modalAdvancedSearchSecondaryActionLabel: 'Voltar',
    modalDisclaimerGroupTitle: 'Apresentando resultados filtrados por:'
  },
  ru: <PoLookupLiterals>{
    modalPrimaryActionLabel: 'выбирать',
    modalSecondaryActionLabel: 'отменить',
    modalPlaceholder: 'поиск',
    modalTitle: 'Выберите запись',
    modalTableNoColumns: poTableLiteralsDefault.ru.noColumns,
    modalTableNoData: poTableLiteralsDefault.ru.noData,
    modalTableLoadingData: poTableLiteralsDefault.ru.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.ru.loadMoreData,
    modalAdvancedSearch: 'Расширенный поиск',
    modalAdvancedSearchTitle: 'Расширенный поиск',
    modalAdvancedSearchPrimaryActionLabel: 'Фильтр',
    modalAdvancedSearchSecondaryActionLabel: 'Вернись',
    modalDisclaimerGroupTitle: 'Представление результатов отфильтровано по:'
  }
};

/**
 * @docsPrivate
 *
 * Classe base do componente Po Lookup Modal.
 */
@Directive()
export abstract class PoLookupModalBaseComponent implements OnDestroy, OnInit {
  private _literals: PoLookupLiterals;
  private _title: string;
  private language: string = poLocaleDefault;

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

  // Propriedade da modal de busca avançada:
  advancedFilterModalTitle = '';
  dynamicFormValue = {};
  disclaimer!: PoDisclaimer;
  disclaimerGroup!: PoDisclaimerGroup;
  isAdvancedFilter = false;
  primaryActionAdvancedFilter!: PoModalAction;
  secondaryActionAdvancedFilter!: PoModalAction;

  protected sort: PoTableColumnSort;

  private filterSubscription: Subscription;
  private searchSubscription: Subscription;
  private showMoreSubscription: Subscription;

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  /**
   * Objeto com os campos que serão criados no busca avançada.
   *
   * > Caso não seja passado um objeto ou então ele esteja em branco o link de busca avançada ficará escondido.
   *
   * Exemplo de URL com busca avançada: http://localhost:3000/v1/heroes?filter=&page=1&pageSize=10`&name=Tony%20Stark&nickname=Homem%20de%20Ferro&email=irnman@marvel.com`
   *
   * Caso algum parâmetro seja uma lista, a concatenação é feita utilizando virgula.
   * Exemplo: http://localhost:3000/v1/heroes?filter=&page=1&pageSize=10`&name=Tony%20Stark,Peter%20Parker,Gohan`
   *
   */
  @Input('p-advanced-filters') advancedFilters: Array<PoLookupAdvancedFilter>;

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
        ...poLookupLiteralsDefault[this.language],
        ...value
      };
      if (value.modalTitle) {
        this.title = this.literals.modalTitle;
      }
    } else {
      this._literals = poLookupLiteralsDefault[this.language];
    }
    this.primaryAction.label = this.literals.modalPrimaryActionLabel;
    this.secondaryAction.label = this.literals.modalSecondaryActionLabel;
    this.setTableLiterals();
  }

  get literals() {
    return this._literals || poLookupLiteralsDefault[this.language];
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

  constructor(languageService: PoLanguageService) {
    this.language = languageService.getShortLanguage();
  }

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
    this.setAdvancedFilterModalProperties();
    this.initializeData();
    this.setTableLiterals();
  }

  private setAdvancedFilterModalProperties() {
    this.advancedFilterModalTitle = this.literals.modalAdvancedSearchTitle;

    this.disclaimerGroup = {
      title: this.literals.modalDisclaimerGroupTitle,
      disclaimers: []
    };

    this.primaryActionAdvancedFilter = {
      action: () => {
        this.destroyDynamicForm();
        this.isAdvancedFilter = false;
        this.createDisclaimer();
      },
      label: this.literals.modalAdvancedSearchPrimaryActionLabel
    };

    this.secondaryActionAdvancedFilter = {
      action: () => {
        this.destroyDynamicForm();
        this.isAdvancedFilter = false;
      },
      label: this.literals.modalAdvancedSearchSecondaryActionLabel
    };
  }

  createDisclaimer() {
    this.disclaimerGroup.disclaimers = [];
    this.searchValue = '';

    for (const [key, value] of Object.entries(this.dynamicFormValue)) {
      this.addDisclaimer(value, key);
    }

    if (!Object.values(this.dynamicFormValue).some(v => v !== null && typeof v !== 'undefined')) {
      this.initializeData();
    }
  }

  addDisclaimer(value: any, property: string) {
    this.disclaimer = <any>{ property: property };
    this.disclaimer.value = value;

    this.disclaimerGroup.disclaimers = [...this.disclaimerGroup.disclaimers, this.disclaimer];
  }

  onChangeDisclaimerGroup() {
    if (!this.searchValue) {
      this.isLoading = true;
      this.searchValue = '';

      this.searchFilteredItems();
    }
  }

  private getAdvancedFilters(advancedParams: any) {
    if (advancedParams && advancedParams.length > 0) {
      const filters: Object = {};
      let validatedAdvacendFilters: any;

      advancedParams.forEach((filter: any) => {
        filters[filter.property] = filter.value instanceof Array ? filter.value.join() : filter.value;

        validatedAdvacendFilters = { ...validatedAdvacendFilters, ...filters };
      });

      return validatedAdvacendFilters;
    }

    return undefined;
  }

  search(): void {
    this.page = 1;

    if (this.searchValue) {
      this.isLoading = true;
      this.disclaimerGroup.disclaimers = [];

      this.searchFilteredItems();
    } else {
      this.initializeData();
    }
  }

  searchFilteredItems(): void {
    this.searchSubscription = this.getFilteredItems(this.searchValue)
      .pipe(
        catchError(error => {
          this.setLookupResponseProperties();
          return throwError(error);
        })
      )
      .subscribe(
        (data: PoLookupResponseApi) => this.setLookupResponseProperties(data),
        () => {}
      );
  }

  showMoreEvent() {
    this.page++;
    this.isLoading = true;

    this.showMoreSubscription = this.getFilteredItems(this.searchValue)
      .pipe(
        catchError(error => {
          this.hasNext = false;
          this.isLoading = false;
          return throwError(error);
        })
      )
      .subscribe(
        (data: PoLookupResponseApi) => {
          this.items = [...this.items, ...data.items];
          this.hasNext = data.hasNext;
          this.isLoading = false;
        },
        () => {}
      );
  }

  // Método responsável por abrir a modal de busca das informações.
  abstract openModal(): void;

  // Método responsável por destruir o dynamicForm
  abstract destroyDynamicForm(): void;

  private getFilteredItems(filter: string): Observable<PoLookupResponseApi> {
    const filteredParams: PoLookupFilteredItemsParams = this.getFilteredParams(filter);

    return this.filterService.getFilteredItems(filteredParams);
  }

  private getFilteredParams(filter: string) {
    const { page, pageSize, filterParams, sort } = this;

    const filteredParams = {};
    const order = this.getOrderParam(sort);
    const advancedFilters = this.getAdvancedFilters(this.disclaimerGroup.disclaimers);
    const params = { filter, page, pageSize, order, filterParams, advancedFilters };

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
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
      this.setLookupResponseProperties(data);
    });
  }

  private setLookupResponseProperties(data?: PoLookupResponseApi) {
    this.items = data?.items ?? [];
    this.hasNext = data?.hasNext ?? false;
    this.isLoading = false;
  }

  private setTableLiterals() {
    this.tableLiterals = {
      'noColumns': this.literals.modalTableNoColumns,
      'noData': this.literals.modalTableNoData,
      'loadingData': this.literals.modalTableLoadingData,
      'loadMoreData': this.literals.modalTableLoadMoreData
    };
  }
}

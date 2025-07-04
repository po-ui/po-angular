import { ChangeDetectorRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PoModalAction } from '../../../../components/po-modal';
import { PoModalComponent } from '../../../../components/po-modal/po-modal.component';
import { poLocaleDefault } from '../../../../services/po-language/po-language.constant';
import { PoLanguageService } from '../../../../services/po-language/po-language.service';
import { capitalizeFirstLetter, convertToBoolean, isTypeof } from '../../../../utils/util';
import { PoTableColumnSortType, PoTableColumnSpacing } from '../../../po-table';
import { PoTableColumnSort } from '../../../po-table/interfaces/po-table-column-sort.interface';
import { poTableLiteralsDefault } from '../../../po-table/po-table-base.component';

import { PoLookupAdvancedFilter } from '../interfaces/po-lookup-advanced-filter.interface';
import { PoLookupColumn } from '../interfaces/po-lookup-column.interface';
import { PoLookupFilter } from '../interfaces/po-lookup-filter.interface';
import { PoLookupFilteredItemsParams } from '../interfaces/po-lookup-filtered-items-params.interface';
import { PoLookupLiterals } from '../interfaces/po-lookup-literals.interface';
import { PoLookupResponseApi } from '../interfaces/po-lookup-response-api.interface';
import { PoDisclaimerGroup } from './../../../po-disclaimer-group/po-disclaimer-group.interface';
import { PoDisclaimer } from './../../../po-disclaimer/po-disclaimer.interface';
import { PoTableComponent } from './../../../po-table/po-table.component';

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
    modalPrimaryActionLabel: 'Выбрать',
    modalSecondaryActionLabel: 'Отменить',
    modalPlaceholder: 'Поиск',
    modalTitle: 'Выберите запись',
    modalTableNoColumns: poTableLiteralsDefault.ru.noColumns,
    modalTableNoData: poTableLiteralsDefault.ru.noData,
    modalTableLoadingData: poTableLiteralsDefault.ru.loadingData,
    modalTableLoadMoreData: poTableLiteralsDefault.ru.loadMoreData,
    modalAdvancedSearch: 'Расширенный поиск',
    modalAdvancedSearchTitle: 'Расширенный поиск',
    modalAdvancedSearchPrimaryActionLabel: 'Фильтр',
    modalAdvancedSearchSecondaryActionLabel: 'Назад',
    modalDisclaimerGroupTitle: 'Представленные результаты отфильтрованы по:'
  }
};

/**
 * @docsPrivate
 *
 * Classe base do componente Po Lookup Modal.
 */
@Directive()
export abstract class PoLookupModalBaseComponent implements OnDestroy, OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;
  @ViewChild(PoTableComponent, { static: true }) poTable: PoTableComponent;

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

  /** Classe de serviço com a implementação do cliente. */
  @Input('p-filter-service') filterService: PoLookupFilter;

  /** Classe de serviço com a implementação do cliente. */
  @Input('p-filter-params') filterParams: any;

  /** Se verdadeiro, esconde o gerenciador de tarefas, responsável pela definição de quais colunas serão exibidas. */
  @Input({ alias: 'p-hide-columns-manager', transform: convertToBoolean })
  hideColumnsManager: boolean = false;

  /** Se verdadeiro, ativa a funcionalidade de scroll infinito para a tabela exibida no retorno da consulta. */
  @Input({ alias: 'p-infinite-scroll', transform: convertToBoolean }) infiniteScroll: boolean = false;

  /** Se verdadeiro, ativa a funcionalidade de multipla seleção. */
  @Input({ alias: 'p-multiple', transform: convertToBoolean }) multiple: boolean = false;

  /** Evento utilizado ao selecionar um registro da tabela. */
  @Output('p-change-model') model: EventEmitter<any> = new EventEmitter<any>();

  /** Classe de serviço com items selecionados */
  @Input('p-selected-items') selectedItems: any;

  /** Indica a coluna que será utilizada como descrição do campo e como filtro dentro da janela. */
  @Input('p-field-label') fieldLabel: string;

  /**
   * @description
   *
   * Indica a coluna que será utilizada como valor do campo.
   *
   * > Atenção: Caso não seja passada ou tenha o conteúdo incorreto, não irá atualizar o model do formulário.
   */
  @Input('p-field-value') fieldValue: string;

  /**
   * Define o espaçamento interno das células, impactando diretamente na altura das linhas do table dentro do modal. Os
   * valores permitidos são definidos pelo enum **PoTableColumnSpacing**.
   */
  @Input('p-spacing') spacing: PoTableColumnSpacing;

  /** Define o tamanho do componente. */
  @Input('p-size') size: string;

  /**
   * Habilita ou desabilita a quebra automática de texto. Quando ativada, o texto que excede
   * o espaço disponível é transferido para a próxima linha em pontos apropriados para uma
   * leitura clara.
   *
   * > Incompatível com `virtual-scroll`, que requer altura fixa nas linhas.
   *
   */
  @Input({ alias: 'p-text-wrap', transform: convertToBoolean }) textWrap?: boolean = false;

  /**
   * @optional
   *
   * @description
   *
   * Habilita o `virtual-scroll` na tabela para melhorar a performance com grandes volumes de dados.
   * A altura da tabela já é pré-definida, portanto o `virtual-scroll` será ativado automaticamente.
   *
   * > Incompatível com `p-text-wrap` e `master-detail`, pois o `virtual-scroll` exige altura fixa nas linhas.
   *
   * @default `true`
   */
  @Input({ alias: 'p-virtual-scroll', transform: convertToBoolean }) virtualScroll?: boolean = true;

  /**
   * @optional
   *
   * @description
   * Evento disparado ao fechar o popover do gerenciador de colunas após alterar as colunas visíveis.
   *
   * O componente envia como parâmetro um array de string com as colunas visíveis atualizadas.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-change-visible-columns') changeVisibleColumns = new EventEmitter<Array<string>>();

  /**
   * @optional
   *
   * @description
   * Evento disparado ao clicar no botão de restaurar padrão no gerenciador de colunas.
   *
   * O componente envia como parâmetro um array de string com as colunas configuradas inicialmente.
   * Por exemplo: ["idCard", "name", "hireStatus", "age"].
   */
  @Output('p-restore-column-manager') columnRestoreManager = new EventEmitter<Array<string>>();

  hasNext = true;
  isLoading = false;
  page = 1;
  pageSize = 10;
  searchValue: string = '';
  appliedSearchValue: string = '';
  tableLiterals: any;

  // Propriedade da modal de busca avançada:
  advancedFilterModalTitle = '';
  dynamicFormValue = {};
  disclaimer!: PoDisclaimer;
  disclaimerGroup!: PoDisclaimerGroup;
  isAdvancedFilter = false;
  primaryActionAdvancedFilter!: PoModalAction;
  secondaryActionAdvancedFilter!: PoModalAction;
  selecteds: Array<any> = [];

  protected sort: PoTableColumnSort;

  private filterSubscription: Subscription;
  private searchSubscription: Subscription;
  private showMoreSubscription: Subscription;
  private disclaimerLabel: string;

  private _literals: PoLookupLiterals;
  private _title: string;
  private language: string = poLocaleDefault;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  primaryAction: PoModalAction = {
    action: () => {
      let selectedsItems: Array<any> = [];
      if (!this.multiple) {
        this.items.forEach(element => {
          if (element['$selected']) {
            selectedsItems.push(element);
          }
        });
      } else {
        selectedsItems = this.selecteds;
      }
      this.model.emit(selectedsItems);
      this.poModal.close();
    },
    label: this.literals.modalPrimaryActionLabel
  };

  // eslint-disable-next-line @typescript-eslint/member-ordering
  secondaryAction: PoModalAction = {
    action: () => {
      this.model.emit(null);
      this.poModal.close();
    },
    label: this.literals.modalSecondaryActionLabel
  };

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

  constructor(
    languageService: PoLanguageService,
    protected changeDetector: ChangeDetectorRef
  ) {
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

  createDisclaimer() {
    this.disclaimerGroup.disclaimers = [];
    this.searchValue = '';
    this.appliedSearchValue = '';

    for (const [key, value] of Object.entries(this.dynamicFormValue)) {
      this.addDisclaimer(value, key);
    }

    if (!Object.values(this.dynamicFormValue).some(v => v !== null && typeof v !== 'undefined')) {
      this.initializeData();
    }
  }

  addDisclaimer(value: any, property: string) {
    this.disclaimerLabel = '';
    const fieldFilter = this.advancedFilters.find(filter => filter.property === property);
    this.disclaimer = <any>{ property: property };
    this.disclaimer.value = value;
    const labelProperty = fieldFilter.label || capitalizeFirstLetter(fieldFilter.property);

    if (fieldFilter.type === 'currency' && value) {
      this.formatValueToCurrency(fieldFilter, value);
    }

    if (fieldFilter.type === 'boolean' && (value === true || value === false)) {
      this.formatValueToBoolean(fieldFilter, value);
    }

    if (fieldFilter.options && value) {
      this.applyDisclaimerLabelValue(fieldFilter, value);
    }

    if (!this.disclaimerLabel) {
      this.disclaimerLabel = this.disclaimer.value;
    }

    this.disclaimer.label = `${labelProperty}: ${this.disclaimerLabel}`;
    this.disclaimerGroup.disclaimers = [...this.disclaimerGroup.disclaimers, this.disclaimer];
  }

  onChangeDisclaimerGroup() {
    if (!this.appliedSearchValue) {
      this.isLoading = true;
      this.searchValue = '';
      this.appliedSearchValue = '';

      this.searchFilteredItems();
    }
  }

  search(): void {
    this.page = 1;

    this.appliedSearchValue = this.searchValue;

    if (this.appliedSearchValue) {
      this.isLoading = true;
      this.disclaimerGroup.disclaimers = [];

      this.searchFilteredItems();
    } else {
      this.initializeData();
    }
  }

  searchFilteredItems(): void {
    this.searchSubscription = this.getFilteredItems(this.appliedSearchValue)
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

    if (this.searchValue !== this.appliedSearchValue) {
      this.searchValue = this.appliedSearchValue;
    }

    this.showMoreSubscription = this.getFilteredItems(this.appliedSearchValue)
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
          this.changeDetector.detectChanges();
          this.setSelectedItems();
        },
        () => {}
      );
  }

  //Método responsável por selecionar as linhas quando abre o modal.
  setSelectedItems() {
    this.selecteds.forEach(selectedItem => {
      if (this.multiple) {
        this.poTable.selectRowItem(item => item[this.fieldValue] === selectedItem.value);
      } else {
        this.poTable.selectRowItem(item => item[this.fieldValue] === selectedItem[this.fieldValue]);
      }
    });
  }

  //Método responsável por criar os disclaimers quando abre o modal.
  setDisclaimersItems() {
    if (this.selectedItems && Array.isArray(this.selectedItems) && this.selectedItems.length > 0) {
      this.selecteds = [...this.selectedItems];
    } else if (this.selectedItems && !Array.isArray(this.selectedItems)) {
      this.selecteds = [this.selectedItems];
    } else {
      this.selecteds = [];
    }
  }

  private applyDisclaimerLabelValue(field: PoLookupAdvancedFilter, filterValue: any) {
    const values = Array.isArray(filterValue) ? filterValue : [filterValue];
    const labels = values.map(optionValue => {
      const findOption = field.options.find(option => option.value === optionValue);
      return findOption.label;
    });

    if (labels.join()) {
      this.disclaimerLabel = labels.join(', ');
    }
  }

  private formatValueToCurrency(field: PoLookupAdvancedFilter, filterValue: any) {
    const currencyLabel = new Intl.NumberFormat(field.locale ? field.locale : this.language, {
      minimumFractionDigits: 2
    }).format(filterValue);
    this.disclaimerLabel = currencyLabel;
  }

  private formatValueToBoolean(field: PoLookupAdvancedFilter, filterValue: any) {
    let labelBoolean: string;

    if (filterValue) {
      labelBoolean = field.booleanTrue ? field.booleanTrue : filterValue;
    } else {
      labelBoolean = field.booleanFalse ? field.booleanFalse : filterValue;
    }
    this.disclaimerLabel = `${labelBoolean}`;
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
        this.page = 1;
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

  private getAdvancedFilters(advancedParams: any) {
    if (advancedParams && advancedParams.length > 0) {
      const filters: object = {};
      let validatedAdvacendFilters: any;

      advancedParams.forEach((filter: any) => {
        filters[filter.property] = filter.value instanceof Array ? filter.value.join() : filter.value;

        validatedAdvacendFilters = { ...validatedAdvacendFilters, ...filters };
      });

      return validatedAdvacendFilters;
    }

    return undefined;
  }

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
    this.changeDetector.detectChanges();
    this.setDisclaimersItems();
    this.setSelectedItems();
  }

  private setTableLiterals() {
    this.tableLiterals = {
      'noColumns': this.literals.modalTableNoColumns,
      'noData': this.literals.modalTableNoData,
      'loadingData': this.literals.modalTableLoadingData,
      'loadMoreData': this.literals.modalTableLoadMoreData
    };
  }

  // Método responsável por abrir a modal de busca das informações.
  abstract openModal(): void;

  // Método responsável por destruir o dynamicForm
  abstract destroyDynamicForm(): void;
}

import { Injectable, ComponentRef, EventEmitter } from '@angular/core';

import { PoDynamicFormField } from './../../../po-dynamic/po-dynamic-form/po-dynamic-form-field.interface';
import { PoComponentInjectorService } from '../../../../services/po-component-injector/po-component-injector.service';
import { PoLookupColumn } from '../../../../components/po-field/po-lookup/interfaces/po-lookup-column.interface';
import { PoLookupFilter } from '../../../../components/po-field/po-lookup/interfaces/po-lookup-filter.interface';
import { PoLookupLiterals } from '../interfaces/po-lookup-literals.interface';
import { PoLookupModalComponent } from '../po-lookup-modal/po-lookup-modal.component';

/**
 * @docsPrivate
 *
 * Serviço responsável por controlar a abertura do componente Po Lookup Modal.
 */
@Injectable()
export class PoLookupModalService {
  selectValueEvent: EventEmitter<any> = new EventEmitter<any>();

  private componentRef: ComponentRef<any> = null;

  constructor(private poComponentInjector: PoComponentInjectorService) {}

  /**
   * Método responsável por abrir a modal de busca das informações.
   *
   * @param advancedFilters {Array<PoDynamicFormField>} Objeto utilizado para criar o busca avançada.
   * @param service {PoLookupFilter} Serviço responsável por realizar a busca no serviço dos dados.
   * @param columns {Array<PoLookupColumn>} Definição das colunas na modal de busca.
   * @param filterParams {any} Valor que será repassado aos métodos do serviço para auxiliar no filtro dos dados.
   * @param title {string} Definição do título da modal.
   * @param literals {PoLookupLiterals} Literais utilizadas no componente.
   * @param selectedItems {any} Valor que está selecionado que será repassado para o modal para apresentar na tabela.
   * @param fieldLabel {string} Valor que será utilizado como descrição do campo.
   * @param fieldValue {string} Valor que será utilizado como valor do campo.
   * @param changeVisibleColumns {function} Função que será executada quando for alterada a visibilidade das colunas.
   * @param columnRestoreManager {function} Função que será executada quando for restaurar as colunas padrão.
   */
  openModal(params: {
    advancedFilters: Array<PoDynamicFormField>;
    service: PoLookupFilter;
    columns: Array<PoLookupColumn>;
    filterParams: any;
    hideColumnsManager: boolean;
    title: string;
    literals: PoLookupLiterals;
    infiniteScroll: boolean;
    multiple: boolean;
    selectedItems: Array<any>;
    fieldLabel: string;
    fieldValue: string;
    changeVisibleColumns: Function;
    columnRestoreManager: Function;
  }): void {
    const {
      advancedFilters,
      service,
      columns,
      filterParams,
      hideColumnsManager,
      title,
      literals,
      infiniteScroll,
      multiple,
      selectedItems,
      fieldLabel,
      fieldValue,
      changeVisibleColumns,
      columnRestoreManager
    } = params;

    this.componentRef = this.poComponentInjector.createComponentInApplication(PoLookupModalComponent);
    this.componentRef.instance.advancedFilters = advancedFilters;
    this.componentRef.instance.title = title;
    this.componentRef.instance.columns = columns;
    this.componentRef.instance.filterService = service;
    this.componentRef.instance.filterParams = filterParams;
    this.componentRef.instance.literals = literals;
    this.componentRef.instance.model.subscribe($event => {
      this.selectValue($event);
    });
    this.componentRef.instance.infiniteScroll = infiniteScroll;
    this.componentRef.instance.multiple = multiple;
    this.componentRef.instance.selectedItems = selectedItems;
    this.componentRef.instance.fieldLabel = fieldLabel;
    this.componentRef.instance.fieldValue = fieldValue;
    this.componentRef.instance.changeVisibleColumns = changeVisibleColumns;
    this.componentRef.instance.columnRestoreManager = columnRestoreManager;
    this.componentRef.instance.hideColumnsManager = hideColumnsManager;
    this.componentRef.changeDetectorRef.detectChanges();
    this.componentRef.instance.openModal();
  }

  setChangeColumns(columns) {
    if (this.componentRef !== null) {
      this.componentRef.instance.columns = columns;
      this.componentRef.changeDetectorRef.detectChanges();
    }
  }

  // Este metodo é chamado quando é selecionado um item na lookup modal.
  selectValue(value) {
    if (value) {
      this.selectValueEvent.emit(value);
    }
    this.componentRef.destroy();
  }
}

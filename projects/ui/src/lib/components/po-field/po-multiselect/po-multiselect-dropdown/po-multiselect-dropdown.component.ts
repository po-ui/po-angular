import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

import { PoMultiselectLiterals } from '../po-multiselect-literals.interface';
import { PoMultiselectOption } from '../po-multiselect-option.interface';
import { PoMultiselectSearchComponent } from './../po-multiselect-search/po-multiselect-search.component';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que construíra o dropdown, contendo o campo de pesquisa e os itens para seleção.
 */
@Component({
  selector: 'po-multiselect-dropdown',
  templateUrl: './po-multiselect-dropdown.component.html'
})
export class PoMultiselectDropdownComponent {
  /** Propriedade que indica se deve exibir o loading. */
  @Input('p-searching') isServerSearching?: boolean = false;

  /** Propriedade que indica se o campo de pesquisa deverá ser escondido. */
  @Input('p-hide-search') hideSearch?: boolean = false;

  /** Propriedade que que recebe as literais definidas no componente `po-multiselect`. */
  @Input('p-literals') literals?: PoMultiselectLiterals;

  /** Placeholder do campo de pesquisa. */
  @Input('p-placeholder-search') placeholderSearch: string;

  /** Propriedade que recebe a lista de opções selecionadas. */
  @Input('p-selected-options') selectedOptions: Array<any> = [];

  /** Propriedade que recebe a lista com todas as opções. */
  @Input('p-options') options: Array<PoMultiselectOption> = [];

  /** Propriedade que recebe a lista de opções que deverão ser criadas no dropdown. */
  @Input('p-visible-options') visibleOptions: Array<PoMultiselectOption> = [];

  /** Propriedade que indica se o campo "Selecionar todos" deverá ser escondido. */
  @Input('p-hide-select-all') hideSelectAll?: boolean = false;

  /** Evento disparado a cada tecla digitada na pesquisa. */
  @Output('p-change-search') changeSearch = new EventEmitter();

  /** Evento disparado a cada alteração na lista das opções selecionadas. */
  @Output('p-change') change = new EventEmitter();

  /**
   * Evento disparado quando for detectada uma ação que necessite fechar o dropdown.
   * Por exemplo, no caso de ser teclado TAB dentro do dropdown, então é disparado este evento
   * para notificar o componente principal que deve fechar o dropdown.
   */
  @Output('p-close-dropdown') closeDropdown = new EventEmitter();

  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  @ViewChild('ulElement', { read: ElementRef, static: true }) ulElement: ElementRef;
  @ViewChild('searchElement') searchElement: PoMultiselectSearchComponent;

  scrollTop = 0;
  show: boolean = false;

  get hasOptions() {
    return !!this.options?.length;
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: any) {
    if (event.keyCode === 9) {
      this.closeDropdown.emit();
    }
  }

  scrollTo(index) {
    this.scrollTop = index <= 2 ? 0 : index * 44 - 88;
  }

  isSelectedItem(option: PoMultiselectOption) {
    return this.selectedOptions.some(selectedItem => selectedItem.value === option.value);
  }

  clickItem(check, option) {
    this.updateSelectedValues(check, option);

    if (!this.hideSearch) {
      this.searchElement.setFocus();
    }
  }

  onClickSelectAll() {
    const selectedValues = this.selectedOptions.map(({ value }) => value);

    if (this.everyVisibleOptionsSelected(selectedValues)) {
      this.selectedOptions = [];
    } else {
      this.selectedOptions = this.uniqueSelectedOptions(selectedValues);
    }

    this.change.emit(this.selectedOptions);
  }

  updateSelectedValues(checked, option) {
    if (checked) {
      this.selectedOptions.push(option);
    } else {
      this.selectedOptions = this.selectedOptions.filter(selectedOption => selectedOption.value !== option.value);
    }

    this.change.emit(this.selectedOptions);
  }

  everyVisibleOptionsSelected(selectedValues) {
    return this.visibleOptions.every(visibleOption => selectedValues.includes(visibleOption.value));
  }

  someVisibleOptionsSelected(selectedValues) {
    return this.visibleOptions.some(visibleOption => selectedValues.includes(visibleOption.value));
  }

  getStateSelectAll() {
    const selectedValues = this.selectedOptions.map(({ value }) => value);

    if (this.everyVisibleOptionsSelected(selectedValues)) {
      return true;
    } else if (this.someVisibleOptionsSelected(selectedValues)) {
      return null;
    } else {
      return false;
    }
  }

  callChangeSearch(event) {
    this.changeSearch.emit(event);
  }

  controlVisibility(toOpen) {
    this.show = toOpen;

    setTimeout(() => {
      if (toOpen && this.searchElement && !this.hideSearch) {
        this.searchElement.setFocus();
        this.searchElement.clean();
      }
    });
  }

  private uniqueSelectedOptions(selectedValues) {
    const newSelectedOptions = [...this.selectedOptions];

    for (const visibleOption of this.visibleOptions) {
      if (!selectedValues.includes(visibleOption.value)) {
        newSelectedOptions.push(visibleOption);
      }
    }

    return newSelectedOptions;
  }
}

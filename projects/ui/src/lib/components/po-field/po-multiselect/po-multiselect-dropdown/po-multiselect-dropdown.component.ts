import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

import { PoMultiselectLiterals } from '../../index';
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
  scrollTop = 0;
  show: boolean = false;

  /** Propriedade que indica se o campo de pesquisa deverá ser escondido. */
  @Input('p-hide-search') hideSearch?: boolean = false;

  /** Propriedade que que recebe as literais definidas no componente `po-multiselect`. */
  @Input('p-literals') literals?: PoMultiselectLiterals;

  /** Placeholder do campo de pesquisa. */
  @Input('p-placeholder-search') placeholderSearch: string;

  /** Propriedade que recebe a lista de opções selecionadas. */
  @Input('p-selected-values') selectedValues: Array<any> = [];

  /** Propriedade que recebe a lista com todas as opções. */
  @Input('p-options') options: Array<PoMultiselectOption> = [];

  /** Propriedade que recebe a lista de opções que deverão ser criadas no dropdown. */
  @Input('p-visible-options') visibleOptions: Array<PoMultiselectOption> = [];

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

  get hasOptions() {
    return !!this.options?.length;
  }

  scrollTo(index) {
    this.scrollTop = index <= 2 ? 0 : index * 44 - 88;
  }

  isSelectedItem(option: PoMultiselectOption) {
    return this.selectedValues.some(selectedItem => selectedItem === option.value);
  }

  clickItem(check, option) {
    this.updateSelectedValues(check, option);

    if (!this.hideSearch) {
      this.searchElement.setFocus();
    }
  }

  updateSelectedValues(checked, option) {
    if (checked) {
      this.selectedValues.push(option.value);
    } else {
      const indexSelectedValues = this.selectedValues.indexOf(option.value);
      this.selectedValues.splice(indexSelectedValues, 1);
    }

    this.change.emit(this.selectedValues);
  }

  callChangeSearch(event) {
    this.changeSearch.emit(event);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: any) {
    if (event.keyCode === 9) {
      this.closeDropdown.emit();
    }
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
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';

import { PoPopoverComponent } from '../../po-popover/po-popover.component';
import { PoTabComponent } from '../po-tab/po-tab.component';
import { PoButtonComponent } from '../../po-button/po-button.component';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente para agrupamento de componentes `po-tab-button` que os rendereiza em uma um caixa de diálogo
 * no formato de lista.
 */
@Component({
  selector: 'po-tab-dropdown',
  templateUrl: './po-tab-dropdown.component.html'
})
export class PoTabDropdownComponent implements AfterViewInit {
  @ViewChild('popover', { static: true }) popover: PoPopoverComponent;

  @ViewChild(PoButtonComponent, { static: true }) button: PoButtonComponent;

  // Rótulo do `po-tab-button`
  @Input('p-label') label: string;

  // Lista de abas
  @Input('p-tabs') tabs: Array<PoTabComponent> = [];

  // Evento que será emitido ao ativar uma aba
  @Output('p-activated') activated = new EventEmitter<any>();

  // Evento que será emitido a aba for desabilitada ou ocultada
  @Output('p-change-state') changeState = new EventEmitter<any>();

  // Evento de click
  @Output('p-click') click = new EventEmitter<any>();

  isDropdownOpen: boolean = false;
  dropdownStyles: any = {};

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.setDropdownPosition();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.setDropdownPosition();
    }
  }

  closeAndReturnToButtom() {
    this.closeDropdown();
    this.button.focus();
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  get buttonElement() {
    return this.button.buttonElement;
  }

  setDropdownPosition() {
    const buttonRect = this.buttonElement.nativeElement.getBoundingClientRect();
    const tabsContainerRect = this.buttonElement.nativeElement.closest('.po-tabs-container').getBoundingClientRect();
    const dropdownWidth = 300;

    const isInsidePage = this.elementRef.nativeElement.closest('.po-page-content');
    this.dropdownStyles = this.calculateDropdownStyles(buttonRect, tabsContainerRect, dropdownWidth, isInsidePage);
  }

  private calculateDropdownStyles(
    buttonRect: DOMRect,
    tabsContainerRect: DOMRect,
    dropdownWidth: number,
    isInsidePage: boolean
  ) {
    if (isInsidePage) {
      return {
        top: `${tabsContainerRect.height + 4 + window.scrollY}px`,
        maxWidth: `${dropdownWidth}px`,
        right: `${tabsContainerRect.right - buttonRect.right}px`
      };
    }

    let rightPosition = tabsContainerRect.width - buttonRect.right;
    rightPosition = Math.max(0, rightPosition);

    return {
      top: `${tabsContainerRect.bottom + 4 + window.scrollY}px`,
      maxWidth: `${dropdownWidth}px`,
      right: `${rightPosition}px`
    };
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}

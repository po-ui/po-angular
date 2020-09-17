import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { isKeyCodeEnter } from './../../utils/util';

import { PoDropdownBaseComponent } from './po-dropdown-base.component';

/**
 * @docsExtends PoDropdownBaseComponent
 *
 * @example
 *
 * <example name="po-dropdown-basic" title="PO Dropdown Basic" >
 *  <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.html"> </file>
 *  <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.ts"> </file>
 *  <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-dropdown-labs" title="PO Dropdown Labs" >
 *  <file name="sample-po-dropdown-labs/sample-po-dropdown-labs.component.html"> </file>
 *  <file name="sample-po-dropdown-labs/sample-po-dropdown-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-dropdown-social-network" title="PO Dropdown - Social Network" >
 *  <file name="sample-po-dropdown-social-network/sample-po-dropdown-social-network.component.html"> </file>
 *  <file name="sample-po-dropdown-social-network/sample-po-dropdown-social-network.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-dropdown',
  templateUrl: './po-dropdown.component.html'
})
export class PoDropdownComponent extends PoDropdownBaseComponent {
  private clickoutListener: () => void;
  private resizeListener: () => void;

  @ViewChild('dropdownRef', { read: ElementRef, static: true }) dropdownRef: ElementRef;
  @ViewChild('popupRef') popupRef: any;

  constructor(private renderer: Renderer2) {
    super();
  }

  onKeyDown(event: any) {
    if (isKeyCodeEnter(event)) {
      this.toggleDropdown();
    }
  }

  toggleDropdown(): void {
    this.dropdownRef && !this.open && !this.disabled ? this.showDropdown() : this.hideDropdown();
  }

  private checkClickArea(event: MouseEvent) {
    return this.dropdownRef && this.dropdownRef.nativeElement.contains(event.target);
  }

  private hideDropdown() {
    this.icon = 'po-icon-arrow-down';
    this.removeListeners();
    this.popupRef.close();
    this.open = false;
  }

  private initializeListeners() {
    this.clickoutListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      this.wasClickedOnDropdown(event);
    });

    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.hideDropdown();
    });

    window.addEventListener('scroll', this.onScroll, true);
  }

  private onScroll = ({ target }): void => {
    if (this.open && target.className !== 'po-popup-container') {
      this.hideDropdown();
    }
  };

  private removeListeners() {
    if (this.clickoutListener) {
      this.clickoutListener();
    }

    if (this.resizeListener) {
      this.resizeListener();
    }

    window.removeEventListener('scroll', this.onScroll, true);
  }

  private showDropdown() {
    this.icon = 'po-icon-arrow-up';
    this.initializeListeners();
    this.popupRef.open();
    this.open = true;
  }

  private wasClickedOnDropdown(event: MouseEvent) {
    const clickedOnDropdown = this.checkClickArea(event);

    if (!clickedOnDropdown) {
      this.hideDropdown();
    }
  }
}

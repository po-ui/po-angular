import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  inject
} from '@angular/core';

import { PoUtils } from './../../utils/util';

import { PoDropdownBaseComponent } from './po-dropdown-base.component';

/**
 * @docsExtends PoDropdownBaseComponent
 *
 * @example
 *
 * <example name="po-dropdown-basic" title="PO Dropdown Basic" >
 *  <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.html"> </file>
 *  <file name="sample-po-dropdown-basic/sample-po-dropdown-basic.component.ts"> </file>
 * </example>
 *
 * <example name="po-dropdown-subitems" title="PO Dropdown Subitems" >
 *  <file name="sample-po-dropdown-subitems/sample-po-dropdown-subitems.component.html"> </file>
 *  <file name="sample-po-dropdown-subitems/sample-po-dropdown-subitems.component.ts"> </file>
 * </example>
 *
 * <example name="po-dropdown-lazy-subitems" title="PO Dropdown Lazy Subitems" >
 *  <file name="sample-po-dropdown-lazy-subitems/sample-po-dropdown-lazy-subitems.component.html"> </file>
 *  <file name="sample-po-dropdown-lazy-subitems/sample-po-dropdown-lazy-subitems.component.ts"> </file>
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
  templateUrl: './po-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class PoDropdownComponent extends PoDropdownBaseComponent {
  private readonly renderer = inject(Renderer2);
  private readonly changeDetector = inject(ChangeDetectorRef);

  @ViewChild('dropdownRef', { read: ElementRef, static: true }) dropdownRef: ElementRef;
  @ViewChild('popupRef') popupRef: any;

  private clickoutListener: () => void;
  private resizeListener: () => void;

  onKeyDown(event: any) {
    if (PoUtils.isKeyCodeEnter(event)) {
      this.toggleDropdown();
    }
  }

  toggleDropdown(): void {
    this.dropdownRef && !this.open && !this.disabled ? this.showDropdown() : this.hideDropdown();
  }

  onPopupClose(): void {
    if (!this.open) {
      return;
    }

    this.hideDropdown(false);
  }

  private isEventInsideElement(event: MouseEvent, element?: HTMLElement): boolean {
    if (!element) {
      return false;
    }

    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

    return path.length ? path.includes(element) : element.contains(event.target as Node);
  }

  private checkClickArea(event: MouseEvent) {
    const clickedOnTrigger = this.isEventInsideElement(event, this.dropdownRef?.nativeElement);
    const clickedOnPopup = this.isEventInsideElement(event, this.popupRef?.popupRef?.nativeElement);

    return clickedOnTrigger || clickedOnPopup;
  }

  private hideDropdown(shouldClosePopup = true) {
    this.icon = 'ICON_ARROW_DOWN';
    this.removeListeners();
    this.open = false;
    this.changeDetector.detectChanges();

    if (shouldClosePopup) {
      this.popupRef.close();
    }
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

  private readonly onScroll = ({ target }): void => {
    if (this.open && target.className !== 'po-popup-container' && !this.isDropdownClosed()) {
      this.hideDropdown();
    }
  };

  private isDropdownClosed(): boolean {
    const dropdownRect = this.dropdownRef.nativeElement.getBoundingClientRect();

    return dropdownRect.top >= 0 && dropdownRect.bottom <= window.innerHeight;
  }

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
    this.icon = 'ICON_ARROW_UP';
    this.initializeListeners();
    this.popupRef.open();
    this.open = true;
    this.changeDetector.detectChanges();
  }

  private wasClickedOnDropdown(event: MouseEvent) {
    const clickedOnDropdown = this.checkClickArea(event);

    if (!clickedOnDropdown) {
      this.hideDropdown();
    }
  }
}

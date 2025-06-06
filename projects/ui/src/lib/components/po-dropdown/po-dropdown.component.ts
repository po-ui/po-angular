import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

import { isKeyCodeEnter } from './../../utils/util';

import { PoThemeService } from '../../services/po-theme/po-theme.service';
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
  @ViewChild('dropdownRef', { read: ElementRef, static: true }) dropdownRef: ElementRef;
  @ViewChild('popupRef') popupRef: any;

  private clickoutListener: () => void;
  private resizeListener: () => void;

  constructor(
    protected poThemeService: PoThemeService,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) {
    super(poThemeService);
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
    this.icon = 'ICON_ARROW_DOWN';
    this.removeListeners();
    this.popupRef.close();
    this.open = false;
    this.changeDetector.detectChanges();
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

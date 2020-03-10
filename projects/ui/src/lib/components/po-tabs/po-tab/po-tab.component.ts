import { AfterContentInit, Component, ElementRef } from '@angular/core';

import { PoTabBaseComponent } from './po-tab-base.component';

/**
 * @docsExtends PoTabBaseComponent
 */
@Component({
  selector: 'po-tab',
  templateUrl: './po-tab.component.html'
})
export class PoTabComponent extends PoTabBaseComponent implements AfterContentInit {
  constructor(private elementRef: ElementRef) {
    super();
  }

  ngAfterContentInit() {
    this.setDisplayOnActive();
  }

  protected setDisplayOnActive() {
    this.elementRef.nativeElement.style.display = this.active ? '' : 'none';
  }
}

import { AfterContentInit, Component, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

import { PoTabBaseComponent } from './po-tab-base.component';
import { PoTabsService } from '../po-tabs.service';

/**
 * @docsExtends PoTabBaseComponent
 */
@Component({
  selector: 'po-tab',
  templateUrl: './po-tab.component.html'
})
export class PoTabComponent extends PoTabBaseComponent implements AfterContentInit, OnChanges {
  constructor(private elementRef: ElementRef, private tabsService: PoTabsService) {
    super();
  }

  ngAfterContentInit() {
    this.setDisplayOnActive();
  }

  ngOnChanges(): void {
    setTimeout(() => {
      this.tabsService.triggerOnChanges();
    }, 100);
  }

  protected setDisplayOnActive() {
    this.elementRef.nativeElement.style.display = this.active ? '' : 'none';
  }
}

import { AfterContentInit, AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

import { PoTabBaseComponent } from './po-tab-base.component';
import { PoTabsService } from '../po-tabs.service';

/**
 * @docsExtends PoTabBaseComponent
 */
@Component({
  selector: 'po-tab',
  templateUrl: './po-tab.component.html',
  standalone: false
})
export class PoTabComponent extends PoTabBaseComponent implements AfterContentInit, OnChanges {
  // Propriedade interna utilizada no po-context-tabs
  removed = false;
  // Propriedade interna utilizada no po-context-tabs
  showTooltip = false;
  constructor(
    public elementRef: ElementRef,
    private tabsService: PoTabsService
  ) {
    super();
  }

  ngAfterContentInit() {
    this.setDisplayOnActive();
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.tabsService.triggerOnChanges(this);
      if (changes?.active?.currentValue) {
        this.tabsService.triggerActiveOnChanges(this);
      }
    }, 100);
  }

  protected setDisplayOnActive() {
    this.elementRef.nativeElement.style.display = this.active ? '' : 'none';
  }
}

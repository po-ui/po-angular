import { AfterContentInit, Component, ElementRef, OnChanges, Renderer2, SimpleChanges, inject } from '@angular/core';

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
  elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private tabsService = inject(PoTabsService);

  // Propriedade interna utilizada no po-context-tabs
  removed = false;
  // Propriedade interna utilizada no po-context-tabs
  showTooltip = false;

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
    if (this.active) {
      this.renderer.removeStyle(this.elementRef.nativeElement, 'display');
    } else {
      this.renderer.setStyle(this.elementRef.nativeElement, 'display', 'none');
    }
  }
}

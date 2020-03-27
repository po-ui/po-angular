import { Component, ContentChildren, QueryList, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PoAccordionBaseComponent } from './po-accordion-base.component';
import { PoAccordionItemComponent } from './po-accordion-item/po-accordion-item.component';
import { PoAccordionService } from './services/po-accordion.service';

/**
 * @docsExtends PoAccordionBaseComponent
 *
 * @example
 *
 * <example name="po-accordion-basic" title="PO Accordion Basic" >
 *  <file name="sample-po-accordion-basic/sample-po-accordion-basic.component.html"> </file>
 *  <file name="sample-po-accordion-basic/sample-po-accordion-basic.component.ts"> </file>
 *  <file name="sample-po-accordion-basic/sample-po-accordion-basic.component.e2e-spec.ts"> </file>
 *  <file name="sample-po-accordion-basic/sample-po-accordion-basic.component.po.ts"> </file>
 * </example>
 *
 * <example name="po-accordion-labs" title="PO Accordion Labs" >
 *  <file name="sample-po-accordion-labs/sample-po-accordion-labs.component.html"> </file>
 *  <file name="sample-po-accordion-labs/sample-po-accordion-labs.component.ts"> </file>
 * </example>
 *
 * <example name="po-accordion-faq" title="PO Accordion - FAQs" >
 *  <file name="sample-po-accordion-faq/sample-po-accordion-faq.component.html"> </file>
 *  <file name="sample-po-accordion-faq/sample-po-accordion-faq.component.ts"> </file>
 * </example>
 */
@Component({
  selector: 'po-accordion',
  templateUrl: 'po-accordion.component.html',
  providers: [PoAccordionService]
})
export class PoAccordionComponent extends PoAccordionBaseComponent implements OnDestroy {
  private accordionServiceSubscription: Subscription;
  private expandedActiveAccordionItem: PoAccordionItemComponent;

  @ContentChildren(PoAccordionItemComponent) poAccordionItems: QueryList<PoAccordionItemComponent>;

  constructor(private accordionService: PoAccordionService) {
    super();
    this.receiveFromChildAccordionSubscription();
  }

  ngOnDestroy() {
    this.accordionServiceSubscription.unsubscribe();
  }

  headerToggle(event: boolean, poAccordionItem: PoAccordionItemComponent) {
    poAccordionItem.expanded = event;

    this.toggle(poAccordionItem);
  }

  private receiveFromChildAccordionSubscription() {
    this.accordionServiceSubscription = this.accordionService
      .receiveFromChildAccordionClicked()
      .subscribe(poAccordionItem => this.toggle(poAccordionItem));
  }

  private toggle(poAccordionItem: PoAccordionItemComponent) {
    const isCurrentAccordionCollapsed = !poAccordionItem.expanded;

    if (isCurrentAccordionCollapsed) {
      this.expandedActiveAccordionItem = null;
      return;
    }

    if (this.expandedActiveAccordionItem) {
      this.expandedActiveAccordionItem.collapse();
    }

    this.expandedActiveAccordionItem = poAccordionItem;
  }
}

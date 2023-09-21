import { Component, ContentChildren, QueryList, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PoAccordionBaseComponent } from './po-accordion-base.component';
import { PoAccordionItemComponent } from './po-accordion-item/po-accordion-item.component';
import { PoAccordionService } from './services/po-accordion.service';
import { PoLanguageService } from '../../services/po-language/po-language.service';

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
  @ContentChildren(PoAccordionItemComponent) poAccordionItems: QueryList<PoAccordionItemComponent>;

  expandedAllItems = false;

  private accordionServiceSubscription: Subscription;
  private expandedActiveAccordionItem: PoAccordionItemComponent;

  constructor(private accordionService: PoAccordionService, languageService: PoLanguageService) {
    super(languageService);
    this.receiveFromChildAccordionSubscription();
  }

  ngOnDestroy() {
    this.accordionServiceSubscription.unsubscribe();
  }

  changeVisibleAllItems(event: boolean) {
    this.expandedAllItems = !event;

    this.poAccordionItems.forEach(item => {
      if (!item.disabledItem) {
        item.expanded = this.expandedAllItems;
        this.toggle(item, false);
      }
    });

    if (this.expandedAllItems) {
      this.expandAllEvent.emit();
    } else {
      this.collapseAllEvent.emit();
    }
  }

  /**
   * Método para colapsar todos os itens.
   * Só pode ser utilizado quando a propriedade `p-show-manager-accordion` estiver como `true`.
   */
  collapseAllItems() {
    if (this.showManagerAccordion) {
      this.changeVisibleAllItems(true);
    }
  }

  /**
   * Método para expandir todos os itens.
   * Só pode ser utilizado quando a propriedade `p-show-manager-accordion` estiver como `true`.
   */
  expandAllItems() {
    if (this.showManagerAccordion) {
      this.changeVisibleAllItems(false);
    }
  }

  headerToggle(event: boolean, poAccordionItem: PoAccordionItemComponent) {
    poAccordionItem.expanded = event;

    this.accordionService.sendToParentAccordionItemClicked(poAccordionItem);
  }

  private checkVisibleAllItems(event: boolean) {
    if (this.showManagerAccordion) {
      const accordionList = this.poAccordionItems.toArray();
      const accordionsValids = accordionList.filter(item => !item.disabledItem);
      const allItemsExpanded = accordionsValids.every(item => item.expanded === true);
      if (allItemsExpanded) {
        this.expandedAllItems = event;
      } else {
        this.expandedAllItems = false;
      }
    }
  }

  private receiveFromChildAccordionSubscription() {
    this.accordionServiceSubscription = this.accordionService
      .receiveFromChildAccordionClicked()
      .subscribe(poAccordionItem => this.toggle(poAccordionItem));
  }

  private toggle(poAccordionItem: PoAccordionItemComponent, checkAllItems = true) {
    const isCurrentAccordionCollapsed = !poAccordionItem.expanded;
    if (checkAllItems) {
      this.checkVisibleAllItems(poAccordionItem.expanded);
    }

    if (isCurrentAccordionCollapsed) {
      this.expandedActiveAccordionItem = null;
      return;
    }

    if (!this.showManagerAccordion && !this.allowExpandItems && this.expandedActiveAccordionItem) {
      this.expandedActiveAccordionItem.collapse();
    }

    this.expandedActiveAccordionItem = poAccordionItem;
  }
}

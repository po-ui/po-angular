import { Component, OnInit } from '@angular/core';

import { PoAccordionItemComponent, PoDynamicFormField } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-accordion-labs',
  templateUrl: './sample-po-accordion-labs.component.html'
})
export class SamplePoAccordionLabsComponent implements OnInit {
  accordionFieldsForm: Array<PoDynamicFormField> = [
    { property: 'label', divider: 'ACCORDION ITEM', required: true, gridColumns: 6 }
  ];

  accordionItemIndex: number;
  accordionItems: Array<PoAccordionItemComponent> = [];

  ngOnInit() {
    this.restore();
  }

  addAccordionItem(accordionItem: PoAccordionItemComponent) {
    const newAccordionItem = Object.assign({}, accordionItem, { value: this.accordionItems.length });

    this.accordionItems = [...this.accordionItems, newAccordionItem];
  }

  restore() {
    this.accordionItems = [];
  }
}

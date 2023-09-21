import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PoAccordionLiterals } from '../interfaces/po-accordion-literals.interface';

@Component({
  selector: 'po-accordion-manager',
  templateUrl: 'po-accordion-manager.component.html'
})
export class PoAccordionManagerComponent {
  @Input('p-expanded-all-items') expandedAllItems: boolean = false;

  @Input('p-literals') literals: PoAccordionLiterals;

  @Output('p-click') clickManager = new EventEmitter<boolean>();

  onClick() {
    this.clickManager.emit();
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'po-accordion-item-header',
  templateUrl: 'po-accordion-item-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoAccordionItemHeaderComponent {
  @Input('p-expanded') expanded: boolean = false;

  @Input('p-label') label: string;

  @Output('p-toggle') toggle = new EventEmitter<boolean>();

  onClick() {
    this.expanded = !this.expanded;

    this.toggle.emit(this.expanded);
  }
}

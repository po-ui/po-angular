import { Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'po-accordion-item-body',
  templateUrl: 'po-accordion-item-body.component.html',
  animations: [
    trigger('toggleBody', [
      transition('* => void', [style({ height: '*' }), animate(200, style({ height: 0 }))]),
      transition('void => *', [style({ height: '0' }), animate(200, style({ height: '*' }))])
    ])
  ]
})
export class PoAccordionItemBodyComponent {
  @Input('p-expanded') expanded: boolean = false;
}

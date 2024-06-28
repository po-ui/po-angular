import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'po-dynamic-container',
  templateUrl: './po-dynamic-container.component.html'
})
export class PoDynamicContainerComponent {
  @Input('p-content') content: TemplateRef<any> | any;
  @Input('p-fields') fields: Array<any>;
}

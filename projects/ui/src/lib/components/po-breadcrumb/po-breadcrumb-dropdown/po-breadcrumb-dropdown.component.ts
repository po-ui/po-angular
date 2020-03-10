import { Component, Input } from '@angular/core';

import { PoBreadcrumbItem } from './../po-breadcrumb-item.interface';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que renderiza o dropdown do po-breadcrumb.
 */
@Component({
  selector: 'po-breadcrumb-dropdown',
  templateUrl: './po-breadcrumb-dropdown.component.html'
})
export class PoBreadcrumbDropdownComponent {
  // Itens a serem apresentados na lista do dropdown.
  @Input('p-items') items: Array<PoBreadcrumbItem>;
}

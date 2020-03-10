import { Component, Input } from '@angular/core';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que renderiza cada item do po-breadcrumb.
 */
@Component({
  selector: 'po-breadcrumb-item',
  templateUrl: './po-breadcrumb-item.component.html'
})
export class PoBreadcrumbItemComponent {
  // Ação que será executada ao clicar sobre o item.
  @Input('p-action') action: Function;

  // Label do item.
  @Input('p-label') label: string;

  // Link do item.
  @Input('p-link') link: string;

  // Especifica se item é o link ativo.
  @Input('p-item-active') itemActive: boolean = false;
}

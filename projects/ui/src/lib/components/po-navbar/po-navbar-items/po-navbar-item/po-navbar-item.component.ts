import { Component, Input, EventEmitter, Output } from '@angular/core';

import { PoNavbarItem } from '../../interfaces/po-navbar-item.interface';

import { isExternalLink } from '../../../../utils/util';

@Component({
  selector: 'po-navbar-item',
  templateUrl: './po-navbar-item.component.html'
})
export class PoNavbarItemComponent {
  @Input('p-action') action: Function;

  @Input('p-clickable') clickable?: boolean;

  @Input('p-label') label: string;

  @Input('p-link') link?: string;

  @Output('p-click') click: EventEmitter<PoNavbarItem> = new EventEmitter<PoNavbarItem>();

  get type() {
    return isExternalLink(this.link) ? 'externalLink' : 'internalLink';
  }

  itemClick(label?: string, link?: string) {
    if (this.action) {
      this.action({ label, link });
    }

    this.click.emit();
  }
}

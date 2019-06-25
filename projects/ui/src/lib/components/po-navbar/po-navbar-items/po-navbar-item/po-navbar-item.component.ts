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
    if (isExternalLink(this.link)) {
      return 'externalLink';
    }

    return 'internalLink';
  }

  itemClick() {

    if (this.action) {
      this.action({ label: this.label, link: this.link });
    }

    this.click.emit();
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { PoMenuPanelItemInternal } from './po-menu-panel-item-internal.interface';
import { PoMenuPanelItemsService } from '../services/po-menu-panel-items.service';

/**
 * @docsPrivate
 *
 * @description
 *
 * Componente que implementa cada item do po-menu-panel.
 */
@Component({
  selector: 'po-menu-panel-item',
  templateUrl: './po-menu-panel-item.component.html'
})
export class PoMenuPanelItemComponent implements OnDestroy, OnInit {
  itemsSubscription: Subscription;

  @Input('p-menu-item-internal') menuItemInternal: PoMenuPanelItemInternal;

  constructor(private menuItemsService: PoMenuPanelItemsService) {}

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
  }

  ngOnInit() {
    // subscribe to menu component messages
    this.subscribeMenuClickedFromParent();
  }

  clickMenuItem(event) {
    if (!(event.ctrlKey || event.metaKey)) {
      event.preventDefault();

      // Emmit to parent
      this.menuItemsService.sendToParentMenuClicked(this.menuItemInternal);
    }
  }

  private activateMenu(menu: PoMenuPanelItemInternal) {
    this.menuItemInternal.isSelected = this.menuItemInternal.id === menu.id;
  }

  private processMenuItem(menu) {
    if (this.menuItemInternal.type === 'internalLink') {
      this.activateMenu(menu.active);
    }
  }

  private subscribeMenuClickedFromParent() {
    this.itemsSubscription = this.menuItemsService.receiveFromParentMenuClicked().subscribe(menu => {
      this.processMenuItem(menu);
    });
  }
}

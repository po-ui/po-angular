import { Component, OnInit } from '@angular/core';

import { PoMenuPanelItem, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-menu-panel-labs',
  templateUrl: './sample-po-menu-panel-labs.component.html'
})
export class SamplePoMenuPanelLabsComponent implements OnInit {
  menuItem: PoMenuPanelItem = { icon: undefined, label: undefined };
  menuItems: Array<PoMenuPanelItem>;
  menuItemSelected: string;

  public readonly iconsOptions: Array<PoRadioGroupOption> = [
    { label: 'po-icon-portinari', value: 'po-icon-portinari' },
    { label: 'po-icon-camera', value: 'po-icon-camera' },
    { label: 'po-icon-calendar', value: 'po-icon-calendar' },
    { label: 'po-icon-user', value: 'po-icon-user' },
    { label: 'po-icon-message', value: 'po-icon-message' },
    { label: 'po-icon-stock', value: 'po-icon-stock' }
  ];

  ngOnInit(): void {
    this.restore();
  }

  addMenuItem(menuItem: PoMenuPanelItem) {
    const newMenuItem = Object.assign({}, menuItem, { action: this.onMenuItemSelected.bind(this) });

    this.menuItems = [...this.menuItems, newMenuItem];
  }

  restore() {
    this.menuItems = [];
    this.menuItemSelected = undefined;
  }

  private onMenuItemSelected(menu: PoMenuPanelItem) {
    this.menuItemSelected = menu.label;
  }
}

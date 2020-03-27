import { Component } from '@angular/core';

import { PoMenuPanelItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-menu-panel-customer',
  templateUrl: './sample-po-menu-panel-customer.component.html'
})
export class SamplePoMenuPanelCustomerComponent {
  title: string = 'Customers';

  public readonly menuItems: Array<PoMenuPanelItem> = [
    { label: 'Home', action: this.changeTitle.bind(this), icon: 'po-icon-home' },
    { label: 'Customers', action: this.changeTitle.bind(this), icon: 'po-icon-user' },
    { label: 'New Sale', action: this.changeTitle.bind(this), icon: 'po-icon-money' },
    { label: 'Reports', action: this.changeTitle.bind(this), icon: 'po-icon-news' },
    { label: 'Settings', action: this.changeTitle.bind(this), icon: 'po-icon-settings' }
  ];

  changeTitle(menu: PoMenuPanelItem) {
    this.title = menu.label;
  }
}

import { Component } from '@angular/core';

import { PoMenuPanelItem } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-menu-panel-customer',
  templateUrl: './sample-po-menu-panel-customer.component.html',
  standalone: false
})
export class SamplePoMenuPanelCustomerComponent {
  title: string = 'Customers';

  public readonly menuItems: Array<PoMenuPanelItem> = [
    { label: 'Home', action: this.changeTitle.bind(this), icon: 'ph ph-house-line' },
    { label: 'Customers', action: this.changeTitle.bind(this), icon: 'ph ph-user' },
    { label: 'New Sale', action: this.changeTitle.bind(this), icon: 'ph ph-money' },
    { label: 'Reports', action: this.changeTitle.bind(this), icon: 'ph ph-newspaper' },
    { label: 'Settings', action: this.changeTitle.bind(this), icon: 'ph ph-gear' }
  ];

  changeTitle(menu: PoMenuPanelItem) {
    this.title = menu.label;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';

import { PoDynamicFormField, PoNotificationService, PoTab, PoTabsComponent } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-tabs-labs',
  templateUrl: './sample-po-tabs-labs.component.html'
})
export class SamplePoTabsLabsComponent implements OnInit {
  @ViewChild('poTab', { static: true }) poTab: PoTabsComponent;

  tabsFieldsForm: Array<PoDynamicFormField> = [
    { property: 'label', divider: 'TABS', required: true, gridColumns: 6 },
    { property: 'click', gridColumns: 6 },
    { property: 'active', type: 'boolean', gridColumns: 4 },
    { property: 'disabled', type: 'boolean', gridColumns: 4 },
    { property: 'hide', type: 'boolean', gridColumns: 4 }
  ];
  propertiesFieldsForm: Array<PoDynamicFormField> = [
    {
      property: 'properties',
      divider: 'PROPERTIES',
      optionsMulti: true,
      gridColumns: 4
    }
  ];
  tabs: Array<PoTab> = [];
  properties: Array<string> = [];
  pageWidth: number;

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
    this.pageWidth = window.innerWidth;
  }

  addTab(tab: PoTab) {
    const newTab = Object.assign({}, tab);

    newTab.click = newTab.click ? this.showClick.bind(this, newTab.click) : undefined;
    this.tabs.push(newTab);
    if (this.tabs.length <= 4) {
      this.poTab.setQuantityTabsButton(this.tabs.length);
    } else if (this.tabs.length > 4) {
      this.poTab.setQuantityTabsButton(4);
    }
  }

  onClick(tab: PoTab) {
    if (tab.click) {
      tab.click();
    }
  }

  restore() {
    this.tabs = [];
    this.properties = [];
    this.poTab.quantityTabsButton = 0;
  }

  private showClick(action: string): any {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}

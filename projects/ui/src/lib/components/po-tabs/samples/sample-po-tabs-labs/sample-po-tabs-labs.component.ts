import { Component, OnInit } from '@angular/core';

import { PoDynamicFormField, PoNotificationService, PoTab } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-tabs-labs',
  templateUrl: './sample-po-tabs-labs.component.html'
})
export class SamplePoTabsLabsComponent implements OnInit {
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
      gridColumns: 4,
      options: [{ label: 'Small', value: 'small' }]
    }
  ];
  tabs: Array<PoTab> = [];
  properties: Array<string> = [];

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
  }

  addTab(tab: PoTab) {
    const newTab = Object.assign({}, tab);

    newTab.click = newTab.click ? this.showClick.bind(this, newTab.click) : undefined;

    this.tabs.push(newTab);
  }

  getSmallProperty(): string {
    const props = this.properties['properties'];

    return props ? props.includes('small') : undefined;
  }

  onClick(tab: PoTab) {
    if (tab.click) {
      tab.click();
    }
  }

  restore() {
    this.tabs = [];
    this.properties = [];
  }

  private showClick(action: string): any {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}

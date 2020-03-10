import { Component, OnInit } from '@angular/core';

import { PoBreadcrumb, PoBreadcrumbItem } from '@portinari/portinari-ui';
import { PoCheckboxGroupOption, PoSelectOption } from '@portinari/portinari-ui';

import { PoNotificationService } from '@portinari/portinari-ui';
import { PoPageAction } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-page-default-labs',
  templateUrl: './sample-po-page-default-labs.component.html'
})
export class SamplePoPageDefaultLabsComponent implements OnInit {
  action: PoPageAction;
  actions: Array<PoPageAction>;
  breadcrumb: PoBreadcrumb;
  breadcrumbItem: PoBreadcrumbItem;
  breadcrumbParams: any;
  title: string;

  public readonly actionOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Disabled', value: 'disabled' },
    { label: 'Separator', value: 'separator' },
    { label: 'Selected', value: 'selected' },
    { label: 'Visible', value: 'visible' }
  ];

  public readonly iconOptions: Array<PoSelectOption> = [
    { value: 'po-icon-portinari', label: 'po-icon-portinari' },
    { value: 'po-icon-search', label: 'po-icon-search' },
    { value: 'po-icon-world', label: 'po-icon-world' }
  ];

  public readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Danger', value: 'danger' },
    { label: 'Default', value: 'default' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
  }

  addAction(action: PoPageAction) {
    const newAction = Object.assign({}, action);
    newAction.action = newAction.action ? this.showAction.bind(this, newAction.action) : undefined;
    this.actions = [...this.actions, newAction];

    this.restoreActionForm();
  }

  addBreadcrumbItem() {
    this.breadcrumb.items = this.breadcrumb.items.concat([this.breadcrumbItem]);
    this.breadcrumbItem = { label: undefined, link: undefined };
  }

  addBreadcrumbParam() {
    const newParam = { [this.breadcrumbParams.property]: this.breadcrumbParams.value };

    if (this.breadcrumb.params) {
      this.breadcrumb.params = Object.assign(this.breadcrumb.params, newParam);
    } else {
      this.breadcrumb.params = newParam;
    }

    this.breadcrumbParams = {};
  }

  restore() {
    this.actions = [];
    this.breadcrumb = { items: [] };
    this.breadcrumbItem = { label: undefined, link: undefined };
    this.breadcrumbParams = {};
    this.title = 'Portinari Page Default';
    this.restoreActionForm();
  }

  restoreActionForm() {
    this.action = {
      label: undefined,
      visible: null
    };
  }

  showAction(label: string): void {
    this.poNotification.success(`Action clicked: ${label}`);
  }
}

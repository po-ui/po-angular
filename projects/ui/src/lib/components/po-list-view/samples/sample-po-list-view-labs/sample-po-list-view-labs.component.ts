import { Component, OnInit } from '@angular/core';

import {
  PoCheckboxGroupOption,
  PoSelectOption,
  PoListViewAction,
  PoListViewLiterals,
  PoNotificationService
} from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-list-view-labs',
  templateUrl: './sample-po-list-view-labs.component.html'
})
export class SamplePoListViewLabsComponent implements OnInit {
  action: PoListViewAction;
  actions: Array<PoListViewAction>;
  customLiterals: PoListViewLiterals;
  height: number;
  items: Array<any>;
  literals: string;
  properties: Array<string>;
  propertyLink: string;
  propertyLinkValue: string;
  propertyTitle: string;
  titleAction: string;

  readonly actionOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Disabled', value: 'disabled' },
    { label: 'Separator', value: 'separator' },
    { label: 'Selected', value: 'selected' },
    { label: 'Visible', value: 'visible' }
  ];

  readonly iconOptions: Array<PoSelectOption> = [
    { value: 'po-icon-portinari', label: 'po-icon-portinari' },
    { value: 'po-icon-search', label: 'po-icon-search' },
    { value: 'po-icon-world', label: 'po-icon-world' }
  ];

  readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'hideSelectAll', label: 'Hide Select All', disabled: true },
    { value: 'select', label: 'Select' },
    { value: 'showMoreDisabled', label: 'Show More Disabled' }
  ];

  readonly propertyTitleOptions: Array<PoSelectOption> = [
    { value: 'name', label: 'name' },
    { value: 'email', label: 'email' },
    { value: 'phone', label: 'phone' },
    { value: 'location', label: 'location' }
  ];

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Default', value: 'default' },
    { label: 'Danger', value: 'danger' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
  }

  addAction(action: PoListViewAction) {
    const newAction = Object.assign({}, action);
    newAction.action = newAction.action ? this.showAction.bind(this, newAction.action) : undefined;

    this.actions.push(newAction);
    this.restoreActionForm();
  }

  addItem() {
    this.items.push(this.generateNewItem(this.items.length + 1));
  }

  changeAction(action) {
    this.titleAction = action;
  }

  changeActionOptions() {
    this.propertiesOptions[0].disabled = !this.properties.includes(this.propertiesOptions[1].value);
  }

  changeLiterals() {
    try {
      this.customLiterals = JSON.parse(this.literals);
    } catch {
      this.customLiterals = undefined;
    }
  }

  restore() {
    this.actions = [];
    this.items = [];
    this.height = undefined;
    this.literals = '';
    this.properties = [];
    this.propertyLink = 'url';
    this.propertyLinkValue = '';
    this.propertyTitle = '';
    this.titleAction = '';
    this.restoreActionForm();
  }

  showMore() {
    this.addItem();
  }

  private generateNewItem(index) {
    return {
      name: `Register ${index}`,
      email: `register${index}@portinari.com`,
      phone: `(55) ${index}234567`,
      location: 'Brazil',
      company: `Company ${index}`,
      url: this.propertyLinkValue,
      zipCode: `${index}221`
    };
  }

  private restoreActionForm() {
    this.action = {
      label: '',
      visible: null
    };
  }

  private showAction(action: string): any {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}

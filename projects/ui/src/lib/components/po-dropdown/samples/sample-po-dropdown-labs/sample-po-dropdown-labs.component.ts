import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoSelectOption, PoDropdownAction, PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-dropdown-labs',
  templateUrl: './sample-po-dropdown-labs.component.html'
})
export class SamplePoDropdownLabsComponent implements OnInit {
  action: PoDropdownAction;
  actions: Array<PoDropdownAction>;
  label: string;
  properties: Array<string>;

  public readonly actionOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Disabled', value: 'disabled' },
    { label: 'Separator', value: 'separator' },
    { label: 'Selected', value: 'selected' },
    { label: 'Visible', value: 'visible' }
  ];

  public readonly iconOptions: Array<PoSelectOption> = [
    { value: 'po-icon-news', label: 'po-icon-news' },
    { value: 'po-icon-search', label: 'po-icon-search' },
    { value: 'po-icon-world', label: 'po-icon-world' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'disabled', label: 'Disabled' }];

  public readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Danger', value: 'danger' },
    { label: 'Default', value: 'default' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
  }

  addAction(action: PoDropdownAction) {
    const newAction = Object.assign({}, action);
    newAction.action = newAction.action ? this.showAction.bind(this, newAction.action) : undefined;
    this.actions.push(newAction);

    this.restoreActionForm();
  }

  restore() {
    this.actions = [];
    this.label = 'PO Dropdown';
    this.properties = [];
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

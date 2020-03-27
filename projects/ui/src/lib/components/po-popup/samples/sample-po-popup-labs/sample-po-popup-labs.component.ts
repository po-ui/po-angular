import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { PoNotificationService, PoCheckboxGroupOption, PoSelectOption, PoPopupAction } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-popup-labs',
  templateUrl: './sample-po-popup-labs.component.html',
  styles: [
    `
      .sample-button-container {
        margin-top: 20px;
        margin-bottom: 20px;
      }
    `
  ]
})
export class SamplePoPopupLabsComponent implements OnInit {
  @ViewChild('target', { read: ElementRef, static: true }) targetRef: ElementRef;

  action: PoPopupAction;
  actions: Array<PoPopupAction>;
  customPositions: Array<string>;
  position: string;
  positions: string;
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

  public readonly positionOptions: Array<PoSelectOption> = [
    { label: 'Right', value: 'right' },
    { label: 'Right-top', value: 'right-top' },
    { label: 'Right-bottom', value: 'right-bottom' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Bottom-left', value: 'bottom-left' },
    { label: 'Bottom-right', value: 'bottom-right' },
    { label: 'Left', value: 'left' },
    { label: 'Left-top', value: 'left-top' },
    { label: 'Left-bottom', value: 'left-bottom' },
    { label: 'Top', value: 'top' },
    { label: 'Top-left', value: 'top-left' },
    { label: 'Top-right', value: 'top-right' }
  ];

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'hideArrow', label: 'Hide arrow' }];

  public readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Danger', value: 'danger' },
    { label: 'Default', value: 'default' }
  ];

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
  }

  addAction(action: PoPopupAction) {
    const newAction = Object.assign({}, action);
    newAction.action = newAction.action ? this.showAction.bind(this, newAction.action) : undefined;
    this.actions.push(newAction);

    this.restoreActionForm();
  }

  convertToArray() {
    this.customPositions = this.positions && this.positions.length ? JSON.parse(this.positions) : undefined;
  }

  restore() {
    this.actions = [];
    this.customPositions = [];
    this.position = undefined;
    this.positions = '';
    this.properties = [];
    this.restoreActionForm();
  }

  restoreActionForm() {
    this.action = {
      label: undefined,
      visible: null
    };
  }

  private showAction(action: string): any {
    this.poNotification.success(`Action clicked: ${action}`);
  }
}

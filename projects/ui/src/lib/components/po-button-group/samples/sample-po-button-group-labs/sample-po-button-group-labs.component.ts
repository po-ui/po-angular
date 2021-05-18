import { Component, OnInit } from '@angular/core';

import {
  PoButtonGroupItem,
  PoButtonGroupToggle,
  PoNotificationService,
  PoRadioGroupOption,
  PoSelectOption
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-group-labs',
  templateUrl: './sample-po-button-group-labs.component.html'
})
export class SamplePoButtonGroupLabsComponent implements OnInit {
  button: any;
  buttons: Array<PoButtonGroupItem>;
  small: boolean;
  toggle: PoButtonGroupToggle;

  iconsOptions: Array<PoRadioGroupOption> = [
    { label: 'po-icon-news', value: 'po-icon-news' },
    { label: 'po-icon-calendar', value: 'po-icon-calendar' },
    { label: 'fa fa-podcast', value: 'fa fa-podcast' },
    { label: 'fa fa-calculator', value: 'fa fa-calculator' }
  ];

  readonly toggleOptions: Array<PoSelectOption> = [
    { label: 'none', value: PoButtonGroupToggle.None },
    { label: 'single', value: PoButtonGroupToggle.Single },
    { label: 'multiple', value: PoButtonGroupToggle.Multiple }
  ];

  constructor(private poNotification: PoNotificationService) {}

  ngOnInit() {
    this.restore();
  }

  action(button) {
    this.poNotification.success(button.action);
  }

  addButton() {
    this.buttons.push({
      icon: this.button.icon,
      label: this.button.label,
      action: this.action.bind(this, this.button),
      disabled: this.button.disabled,
      tooltip: this.button.tooltip
    });

    this.button = {};
  }

  restore() {
    this.button = {};
    this.buttons = [];
  }
}

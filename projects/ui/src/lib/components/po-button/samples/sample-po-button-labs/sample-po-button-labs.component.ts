import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoRadioGroupOption, PoDialogService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-labs',
  templateUrl: './sample-po-button-labs.component.html'
})
export class SamplePoButtonLabsComponent implements OnInit {
  label: string;
  type: string;
  icon: string;
  properties: Array<string>;

  propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'loading', label: 'Loading' },
    { value: 'small', label: 'Small' }
  ];

  iconsOptions: Array<PoRadioGroupOption> = [
    { label: 'po-icon-news', value: 'po-icon-news' },
    { label: 'po-icon-calendar', value: 'po-icon-calendar' },
    { label: 'po-icon-user', value: 'po-icon-user' },
    { label: 'fa fa-podcast', value: 'fa fa-podcast' }
  ];

  typesOptions: Array<PoRadioGroupOption> = [
    { label: 'primary', value: 'primary' },
    { label: 'secondary', value: 'secondary' },
    { label: 'tertiary', value: 'tertiary' },
    { label: 'danger', value: 'danger' }
  ];

  constructor(private poDialog: PoDialogService) {}

  ngOnInit() {
    this.restore();
  }

  buttonClick() {
    this.poDialog.alert({ title: 'PO Button', message: 'Hello PO World!!!' });
  }

  restore() {
    this.label = undefined;
    this.type = undefined;
    this.icon = undefined;
    this.properties = [];
  }
}

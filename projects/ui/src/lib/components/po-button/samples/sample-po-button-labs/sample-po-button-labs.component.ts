import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoRadioGroupOption, PoDialogService } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-button-labs',
  templateUrl: './sample-po-button-labs.component.html'
})
export class SamplePoButtonLabsComponent implements OnInit {
  label: string;
  kind: string;
  icon: string;
  properties: Array<string>;

  propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'loading', label: 'Loading' },
    { value: 'small', label: 'Small' },
    { value: 'danger', label: 'Danger' }
  ];

  iconsOptions: Array<PoRadioGroupOption> = [
    { label: 'po-icon-news', value: 'po-icon-news' },
    { label: 'po-icon-calendar', value: 'po-icon-calendar' },
    { label: 'po-icon-user', value: 'po-icon-user' },
    { label: 'fa fa-podcast', value: 'fa fa-podcast' }
  ];

  kindsOptions: Array<PoRadioGroupOption> = [
    { label: 'primary', value: 'primary' },
    { label: 'secondary', value: 'secondary' },
    { label: 'tertiary', value: 'tertiary' }
  ];

  constructor(private poDialog: PoDialogService) {}

  ngOnInit() {
    this.restore();
  }

  buttonClick() {
    this.poDialog.alert({ title: 'PO Button', message: 'Hello PO World!!!' });
  }

  propertiesChange(event) {
    this.kindsOptions[0] = { ...this.kindsOptions[0], disabled: false };
    this.kindsOptions[2] = { ...this.kindsOptions[2], disabled: false };

    if (event) {
      event.forEach(property => {
        if (property === 'danger' && this.properties.includes('danger')) {
          this.kindsOptions[0] = { ...this.kindsOptions[0], disabled: true };
          this.kindsOptions[2] = { ...this.kindsOptions[2], disabled: true };
          this.kind = 'secondary';
        }
      });
    }
  }

  restore() {
    this.label = undefined;
    this.kind = undefined;
    this.icon = undefined;
    this.properties = [];
    this.kindsOptions[0] = { ...this.kindsOptions[0], disabled: false };
    this.kindsOptions[2] = { ...this.kindsOptions[2], disabled: false };
  }
}

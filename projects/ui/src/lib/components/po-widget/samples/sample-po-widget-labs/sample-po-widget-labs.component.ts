import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-widget-labs',
  templateUrl: './sample-po-widget-labs.component.html'
})
export class SamplePoWidgetLabsComponent implements OnInit {
  action: string;
  background: string;
  content: string;
  height: number;
  help: string;
  primaryLabel: string;
  properties: Array<string>;
  secondaryLabel: string;
  title: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'disabled', label: 'Disabled' },
    { value: 'noShadow', label: 'No Shadow' },
    { value: 'primaryWidget', label: 'Primary Widget' }
  ];

  ngOnInit() {
    this.restore();
  }

  changeAction(action) {
    this.action = action;
  }

  restore() {
    this.background = '';
    this.action = '';
    this.content = '';
    this.height = undefined;
    this.help = '';
    this.title = undefined;
    this.primaryLabel = undefined;
    this.properties = [];
    this.secondaryLabel = undefined;
  }
}

import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoGaugeRanges } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-gauge-labs',
  templateUrl: './sample-po-gauge-labs.component.html',
  standalone: false
})
export class SamplePoGaugeLabsComponent implements OnInit {
  description: string;
  gaugeValue: number;
  height: number;
  options: PoGaugeRanges = {};
  properties: Array<string>;
  ranges: Array<PoGaugeRanges> = [];
  title: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'showFromToLegend', label: 'Show From To Legend' },
    { value: 'showPointer', label: 'Show Pointer' }
  ];

  get isEmptyObject() {
    return Object.keys(this.options).length === 0;
  }

  ngOnInit() {
    this.restore();
  }

  addRange() {
    this.ranges = [...this.ranges, this.options];
    this.options = {};
  }

  restore() {
    this.description = undefined;
    this.gaugeValue = undefined;
    this.height = undefined;
    this.options = {};
    this.ranges = [];
    this.title = undefined;
    this.properties = ['showPointer'];
  }
}

import { Component, OnInit } from '@angular/core';

import { PoGaugeRanges } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-gauge-labs',
  templateUrl: './sample-po-gauge-labs.component.html'
})
export class SamplePoGaugeLabsComponent implements OnInit {
  description: string;
  gaugeValue: number;
  height: number;
  options: PoGaugeRanges = {};
  ranges: Array<PoGaugeRanges> = [];
  title: string;

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
  }
}

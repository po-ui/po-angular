import { Component, OnInit } from '@angular/core';

import { PoCheckboxGroupOption, PoGaugeOptions, PoGaugeRanges } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-gauge-labs',
  templateUrl: './sample-po-gauge-labs.component.html',
  standalone: false
})
export class SamplePoGaugeLabsComponent implements OnInit {
  description: string;
  subtitle: string;
  gaugeValue: number;
  height: number;
  options: PoGaugeOptions;
  optionsRanges: PoGaugeRanges = {};
  properties: Array<string>;
  ranges: Array<PoGaugeRanges> = [];
  title: string;

  public readonly propertiesOptions: Array<PoCheckboxGroupOption> = [
    { value: 'showFromToLegend', label: 'Show From To Legend' },
    { value: 'showPointer', label: 'Show Pointer' },
    { value: 'showContainerGauge', label: 'Show Container' },
    { value: 'hideExpand', label: 'Hide Expand' },
    { value: 'hideTableDetails', label: 'Hide Table Details' },
    { value: 'hideExportCsv', label: 'Hide Export Csv' },
    { value: 'hideExportImage', label: 'Hide Export Image' }
  ];

  get isEmptyObject() {
    return Object.keys(this.optionsRanges).length === 0;
  }

  ngOnInit() {
    this.restore();
  }

  addRange() {
    this.ranges = [...this.ranges, this.optionsRanges];
    this.optionsRanges = {};
  }

  restore() {
    this.description = undefined;
    this.gaugeValue = undefined;
    this.height = undefined;
    this.optionsRanges = {};
    this.ranges = [];
    this.title = undefined;
    this.properties = ['showPointer', 'showContainerGauge'];
    this.changeOptions();
  }

  changeOptions() {
    this.options = {
      showFromToLegend: this.properties.includes('showFromToLegend'),
      pointer: this.properties.includes('showPointer'),
      showContainerGauge: this.properties.includes('showContainerGauge'),
      subtitleGauge: this.subtitle,
      header: {
        hideExpand: this.properties.includes('hideExpand'),
        hideTableDetails: this.properties.includes('hideTableDetails'),
        hideExportCsv: this.properties.includes('hideExportCsv'),
        hideExportImage: this.properties.includes('hideExportImage')
      }
    };
  }
}

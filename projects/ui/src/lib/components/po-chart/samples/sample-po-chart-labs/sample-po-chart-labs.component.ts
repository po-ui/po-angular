import { Component, OnInit } from '@angular/core';

import { PoChartSerie, PoChartType, PoSelectOption, PoChartOptions } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {
  allCategories: Array<string> = [];
  categories: string;
  data;
  event: string;
  height: number;
  label: string;
  series: Array<PoChartSerie>;
  serieType: PoChartType;
  title: string;
  tooltip: string;
  type: PoChartType;
  options: PoChartOptions = {
    axis: {
      minRange: undefined,
      maxRange: undefined,
      gridLines: undefined
    }
  };

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Donut', value: PoChartType.Donut },
    { label: 'Pie', value: PoChartType.Pie },
    { label: 'Line', value: PoChartType.Line },
    { label: 'Column', value: PoChartType.Column },
    { label: 'Bar', value: PoChartType.Bar }
  ];

  ngOnInit() {
    this.restore();
  }

  addOptions() {
    this.options = { ...this.options };
  }

  addCategories() {
    this.allCategories = this.convertToArray(this.categories);
  }

  addData() {
    const data = isNaN(this.data) ? this.convertToArray(this.data) : Math.floor(this.data);
    const type = this.serieType ?? this.type;

    this.series = [...this.series, { label: this.label, data, tooltip: this.tooltip, type }];
  }

  changeEvent(eventName: string, serieEvent: PoChartSerie): void {
    this.event = `${eventName}: ${JSON.stringify(serieEvent)}`;
  }

  restore() {
    this.type = undefined;
    this.serieType = undefined;
    this.label = undefined;
    this.categories = undefined;
    this.event = undefined;
    this.height = undefined;
    this.series = [];
    this.title = undefined;
    this.tooltip = undefined;
    this.data = undefined;
    this.allCategories = [];
    this.options = {
      axis: {
        minRange: undefined,
        maxRange: undefined,
        gridLines: undefined
      }
    };
  }

  private convertToArray(value: string): Array<any> {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
}

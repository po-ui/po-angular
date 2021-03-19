import { Component, OnInit } from '@angular/core';

import { PoChartSerie, PoChartType, PoSelectOption, PoChartOptions, PoCheckboxGroupOption } from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {
  allCategories: Array<string> = [];
  categories: string;
  color: string;
  data;
  event: string;
  height: number;
  label: string;
  optionsActions: PoChartOptions;
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

  readonly propertiesOptions: Array<PoCheckboxGroupOption> = [{ value: 'legend', label: 'Legend' }];

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Donut', value: PoChartType.Donut },
    { label: 'Pie', value: PoChartType.Pie },
    { label: 'Area', value: PoChartType.Area },
    { label: 'Line', value: PoChartType.Line },
    { label: 'Column', value: PoChartType.Column },
    { label: 'Bar', value: PoChartType.Bar }
  ];

  ngOnInit() {
    this.restore();
  }

  addOptions(actionOptions?: PoChartOptions) {
    this.options = { ...this.options, ...(actionOptions ? { ...actionOptions } : {}) };
  }

  addCategories() {
    this.allCategories = this.convertToArray(this.categories);
  }

  addData() {
    const data = isNaN(this.data) ? this.convertToArray(this.data) : Math.floor(this.data);
    const type = this.serieType ?? this.type;
    const color = this.color;

    this.series = [
      ...this.series,
      { label: this.label, data, tooltip: this.tooltip, ...(color ? { color } : {}), type }
    ];
  }

  changeActionOptions() {
    const legend = this.optionsActions.legend;

    this.addOptions({ legend });
  }

  changeEvent(eventName: string, serieEvent: PoChartSerie): void {
    this.event = `${eventName}: ${JSON.stringify(serieEvent)}`;
  }

  restore() {
    this.color = undefined;
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
    this.optionsActions = {
      legend: null
    };
    this.options = {
      ...this.optionsActions,
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

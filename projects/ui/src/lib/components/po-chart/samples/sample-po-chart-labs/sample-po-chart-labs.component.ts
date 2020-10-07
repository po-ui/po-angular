import { Component, OnInit } from '@angular/core';

import {
  PoChartGaugeSerie,
  PoLineChartSeries,
  PoChartType,
  PoDonutChartSeries,
  PoPieChartSeries,
  PoSelectOption,
  PoChartOptions
} from '@po-ui/ng-components';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {
  category: string;
  totalValues: Array<number> = [];
  description: string;
  event: string;
  height: number;
  multipleSeries: Array<PoPieChartSeries | PoDonutChartSeries>;
  multipleValues: Array<PoLineChartSeries>;
  series: Array<PoPieChartSeries | PoDonutChartSeries | PoLineChartSeries> | PoChartGaugeSerie;
  singleSerie: PoChartGaugeSerie;
  title: string;
  tooltip: string;
  value: number;
  type: PoChartType;
  lineValues: number;
  multipleValuesLabel: string = '';
  categories: string;
  allCategories: Array<string> = [];
  inputDataSeries: string;
  options: PoChartOptions = {
    axis: {
      minRange: undefined,
      maxRange: undefined,
      axisXGridLines: undefined
    }
  };

  readonly typeOptions: Array<PoSelectOption> = [
    { label: 'Donut', value: PoChartType.Donut },
    { label: 'Gauge', value: PoChartType.Gauge },
    { label: 'Pie', value: PoChartType.Pie },
    { label: 'Line', value: PoChartType.Line }
  ];

  ngOnInit() {
    this.restore();
    this.type = PoChartType.Line;
  }

  get isSingleSerie(): boolean {
    return this.type === PoChartType.Gauge;
  }

  get isMultipleValues(): boolean {
    return this.type === PoChartType.Line;
  }

  addOptions() {
    this.options = { ...this.options };
  }

  addCategories() {
    this.allCategories = this.convertToArray(this.categories);
  }

  addData() {
    if (this.isSingleSerie) {
      this.singleSerie = { value: this.value, description: this.description };
    } else if (this.isMultipleValues) {
      const dataSeries = this.convertToArray(this.inputDataSeries);

      this.multipleValues = [...this.multipleValues, { label: this.multipleValuesLabel, data: dataSeries }];
    } else {
      this.multipleSeries = [
        ...this.multipleSeries,
        { category: this.category, value: this.value, tooltip: this.tooltip }
      ];
    }

    this.applySeriesData();
  }

  applySeriesData() {
    this.series = this.isSingleSerie
      ? this.singleSerie
      : this.isMultipleValues
      ? this.multipleValues
      : this.multipleSeries;
  }

  changeEvent(eventName: string, serieEvent: PoPieChartSeries): void {
    this.event = `${eventName}: ${JSON.stringify(serieEvent)}`;
  }

  restore() {
    this.category = undefined;
    this.categories = undefined;
    this.event = undefined;
    this.height = undefined;
    this.singleSerie = undefined;
    this.multipleSeries = [];
    this.series = [];
    this.title = undefined;
    this.tooltip = undefined;
    this.value = undefined;
    this.description = undefined;
    this.allCategories = [];
    this.inputDataSeries = undefined;
    this.multipleValuesLabel = undefined;
    this.lineValues = undefined;
    this.multipleValues = [];
    this.options = {
      axis: {
        minRange: undefined,
        maxRange: undefined,
        axisXGridLines: undefined
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

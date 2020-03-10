import { Component, OnInit } from '@angular/core';

import {
  PoChartGaugeSerie,
  PoChartType,
  PoDonutChartSeries,
  PoPieChartSeries,
  PoRadioGroupOption
} from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {
  category: string;
  description: string;
  event: string;
  height: number;
  multipleSeries: Array<PoPieChartSeries | PoDonutChartSeries>;
  series: Array<PoPieChartSeries | PoDonutChartSeries> | PoChartGaugeSerie;
  singleSerie: PoChartGaugeSerie;
  title: string;
  tooltip: string;
  value: number;
  type: PoChartType;

  readonly typeOptions: Array<PoRadioGroupOption> = [
    { label: 'Donut', value: PoChartType.Donut },
    { label: 'Gauge', value: PoChartType.Gauge },
    { label: 'Pie', value: PoChartType.Pie }
  ];

  ngOnInit() {
    this.restore();
  }

  get isSingleSerie(): boolean {
    return this.type === PoChartType.Gauge;
  }

  addData() {
    if (this.isSingleSerie) {
      this.singleSerie = { value: this.value, description: this.description };
    } else {
      this.multipleSeries = [
        ...this.multipleSeries,
        { category: this.category, value: this.value, tooltip: this.tooltip }
      ];
    }

    this.applySeriesData();
  }

  applySeriesData() {
    this.series = this.isSingleSerie ? this.singleSerie : this.multipleSeries;
  }

  changeEvent(eventName: string, serieEvent: PoPieChartSeries): void {
    this.event = `${eventName}: ${JSON.stringify(serieEvent)}`;
  }

  restore() {
    this.category = undefined;
    this.event = undefined;
    this.height = undefined;
    this.singleSerie = undefined;
    this.multipleSeries = [];
    this.series = [];
    this.title = undefined;
    this.tooltip = undefined;
    this.value = undefined;
    this.description = undefined;
    this.type = undefined;
  }
}

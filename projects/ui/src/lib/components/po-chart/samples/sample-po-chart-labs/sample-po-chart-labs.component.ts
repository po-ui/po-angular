import { Component, OnInit } from '@angular/core';

import { PoChartType, PoDonutChartSeries, PoPieChartSeries, PoRadioGroupOption } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {

  category: string;
  event: string;
  height: number;
  series: Array<PoDonutChartSeries | PoPieChartSeries>;
  title: string;
  tooltip: string;
  value: number;
  type: PoChartType;

  readonly typeOptions: Array<PoRadioGroupOption> = [
    { label: 'Donut', value: PoChartType.Donut },
    { label: 'Pie', value: PoChartType.Pie }
  ];

  ngOnInit() {
    this.restore();
  }

  addData() {
    this.series.push({ category: this.category, value: this.value, tooltip: this.tooltip });
  }

  changeEvent(eventName: string, serieEvent: PoPieChartSeries): void {
    this.event = `${eventName}: ${JSON.stringify(serieEvent)}`;
  }

  restore() {
    this.category = undefined;
    this.event = undefined;
    this.height = undefined;
    this.series = [];
    this.title = undefined;
    this.tooltip = undefined;
    this.value = undefined;
    this.type = undefined;
  }

}

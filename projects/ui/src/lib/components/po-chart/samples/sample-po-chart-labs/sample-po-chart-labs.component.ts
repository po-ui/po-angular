import { Component, OnInit } from '@angular/core';

import { PoPieChartSeries } from '@portinari/portinari-ui';

@Component({
  selector: 'sample-po-chart-labs',
  templateUrl: './sample-po-chart-labs.component.html'
})
export class SamplePoChartLabsComponent implements OnInit {

  category: string;
  event: string;
  height: number;
  series: Array<PoPieChartSeries>;
  title: string;
  tooltip: string;
  value: number;

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
  }

}

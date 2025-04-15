import { ChangeDetectorRef, Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { PoChartComponent } from '.';
import { PoChartNewComponent } from '../po-chart-new/po-chart-new.component';

@Component({
  selector: 'po-chart',
  template: `<ng-template #container></ng-template>`,
  standalone: false
})
export class PoChartSwitchComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  @Input('p-title') title: any;
  @Input('p-options') options: any;
  @Input('p-type') type: any;
  @Input('p-series') series: any;
  @Input('p-categories') categories: any;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    // const componentRef: ComponentRef<PoChartComponent> = this.container.createComponent(PoChartComponent);
    // const componentRef: ComponentRef<PoChartNewComponent> = this.container.createComponent(PoChartNewComponent);

    const componentesMap = {
      old: PoChartComponent,
      new: PoChartNewComponent
    };

    const newChart = localStorage.getItem('newChart') || null;
    const tipo = newChart ? 'new' : 'old';
    const componente = componentesMap[tipo];
    const componentRef: ComponentRef<any> = this.container.createComponent(componente as any);

    componentRef.instance.title = this.title;
    componentRef.instance.options = this.options;
    componentRef.instance.categories = this.categories;
    componentRef.instance.series = this.series;
    componentRef.instance.type = this.type;

    const change = JSON.parse(
      '{"title":{"currentValue":"Participation by country in world exports - %","firstChange":true},"options":{"currentValue":{"axis":{"minRange":0,"maxRange":40,"gridLines":5,"labelType":"number"}},"firstChange":true},"categories":{"currentValue":["2010","2011","2012","2013","2014","2015"],"firstChange":true},"series":{"currentValue":[{"label":"Brazil","data":[35,32,25,29,33,33],"color":"color-10"},{"label":"Vietnam","data":[15,17,23,19,22,18]},{"label":"Colombia","data":[8,7,6,9,10,11]},{"label":"India","data":[5,6,5,4,5,5]},{"label":"Indonesia","data":[7,6,10,10,4,6]}],"firstChange":true},"type":{"currentValue":"line","firstChange":true}}'
    );

    componentRef.instance.ngOnChanges(change);
  }
}

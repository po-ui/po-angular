/* istanbul ignore file */
import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { PoChartComponent } from '.';
import { PoChartNewComponent } from '../po-chart-new/po-chart-new.component';

@Component({
  selector: 'po-chart',
  template: `<ng-template #container></ng-template>`,
  standalone: false
})
export class PoChartSwitchComponent implements OnInit, OnChanges {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  @Input('p-title') title: any;
  @Input('p-options') options: any;
  @Input('p-type') type: any;
  @Input('p-series') series: any;
  @Input('p-categories') categories: any;
  @Input('p-height') height: any;
  @Input('p-data-label') dataLabel: any;
  @Input('p-custom-actions') customActions: any;
  @Output('p-series-hover') seriesHover = new EventEmitter<any>();
  @Output('p-series-click') seriesClick = new EventEmitter<any>();

  componentRef: ComponentRef<any>;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['series']?.firstChange) {
      return;
    }

    this.componentRef.instance.title = this.title;
    this.componentRef.instance.options = this.options;
    this.componentRef.instance.categories = this.categories;
    this.componentRef.instance.series = this.series;
    this.componentRef.instance.type = this.type;
    this.componentRef.instance.height = this.height;
    this.componentRef.instance.dataLabel = this.dataLabel;
    this.componentRef.instance.customActions = this.customActions;

    this.componentRef.instance.ngOnChanges(changes);
  }

  ngOnInit() {
    const componentesMap = {
      old: PoChartComponent,
      new: PoChartNewComponent
    };

    const newChart = localStorage.getItem('newChart') || null;
    const tipo = newChart ? 'new' : 'old';
    const componente = componentesMap[tipo];
    this.componentRef = this.container.createComponent(componente as any);

    this.componentRef.instance.title = this.title;
    this.componentRef.instance.options = this.options;
    this.componentRef.instance.categories = this.categories;
    this.componentRef.instance.series = this.series;
    this.componentRef.instance.type = this.type;
    this.componentRef.instance.height = this.height;
    this.componentRef.instance.dataLabel = this.dataLabel;
    this.componentRef.instance.customActions = this.customActions;

    this.componentRef.instance.seriesHover.subscribe((event: any) => {
      this.seriesHover.emit(event);
    });

    this.componentRef.instance.seriesClick.subscribe((event: any) => {
      this.seriesClick.emit(event);
    });

    const change = {
      title: {
        currentValue: this.title,
        firstChange: true
      },
      options: {
        currentValue: this.options,
        firstChange: true
      },
      categories: {
        currentValue: this.categories,
        firstChange: true
      },
      series: {
        currentValue: this.series,
        firstChange: true
      },
      type: {
        currentValue: this.type,
        firstChange: true
      },
      height: {
        currentValue: this.height,
        firstChange: true
      },
      dataLabel: {
        currentValue: this.dataLabel,
        firstChange: true
      },
      customActions: {
        currentValue: this.customActions,
        firstChange: true
      }
    };
    this.componentRef.instance.ngOnChanges(change);
  }
}

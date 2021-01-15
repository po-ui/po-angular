import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  PoChartStartAngle,
  PoChartCompleteCircle,
  PoChartAngleStepInterval
} from '../../helpers/po-chart-default-values.constant';

import { PoChartCircularLabelComponent } from './po-chart-circular-label/po-chart-circular-label.component';
import { PoChartCircularPathComponent } from './po-chart-circular-path/po-chart-circular-path.component';
import { PoChartColorService } from '../../services/po-chart-color.service';
import { PoChartContainerSize } from '../../interfaces/po-chart-container-size.interface';
import { PoChartLabelCoordinates } from '../../interfaces/po-chart-label-coordinates.interface';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';
import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoDonutChartSeries } from '../../interfaces/po-chart-donut-series.interface';
import { PoPieChartSeries } from '../../interfaces/po-chart-pie-series.interface';

@Directive()
export abstract class PoChartCircularComponent {
  private _series: Array<PoPieChartSeries | PoDonutChartSeries>;

  seriesLabels: Array<PoChartLabelCoordinates> = [];
  seriesList: Array<PoChartPathCoordinates>;
  showLabels: boolean = false;

  protected totalValue: number;

  private colorList: Array<string> = [];
  private animate: boolean;

  @Input('p-container-size') containerSize: PoChartContainerSize;

  @Input('p-series') set series(value: Array<PoPieChartSeries | PoDonutChartSeries>) {
    this._series = value;

    this.animate = true;
    this.colorList = this.colorService.getSeriesColor(this.series, PoChartType.Pie);
  }

  get series() {
    return this._series;
  }

  @Output('p-circular-click') circularClick = new EventEmitter<any>();

  @Output('p-circular-hover') circularHover = new EventEmitter<any>();

  @ViewChildren('svgPaths') private svgPaths: QueryList<PoChartCircularPathComponent>;

  @ViewChildren('svgLabels') private svgLabels: QueryList<PoChartCircularLabelComponent>;

  constructor(
    private colorService: PoChartColorService,
    private ngZone: NgZone,
    private changeDetector: ChangeDetectorRef
  ) {}

  onSerieClick(selectedItem: any) {
    this.circularClick.emit(selectedItem);
  }

  onSerieHover(selectedItem: any) {
    this.circularHover.emit(selectedItem);
  }

  protected calculateAngle(data: number, totalValue: number) {
    return (data / totalValue) * (Math.PI * 2);
  }

  protected drawSeries(series: Array<PoPieChartSeries | PoDonutChartSeries> = [], height: number) {
    this.seriesList = [];
    this.showLabels = false;
    this.totalValue = this.calculateTotalValue(series);
    if (this.totalValue && this.totalValue > 0) {
      this.seriesList = this.validateSeries(series);
      this.changeDetector.detectChanges();

      if (this.seriesList.length && this.svgPaths) {
        this.initDrawPaths(this.seriesList, this.totalValue, height);
      }
    }
  }

  private calculateTotalValue(series: Array<PoPieChartSeries | PoDonutChartSeries>) {
    return series.reduce((previousValue, serie) => {
      const data = serie.data ? serie.data : serie.value;

      return previousValue + (data > 0 ? data : 0);
    }, 0);
  }

  private calculateSerieCoordinates(
    series: Array<PoPieChartSeries | PoDonutChartSeries>,
    totalValue: number,
    height: number
  ) {
    let startRadianAngle;
    let endRadianAngle = PoChartStartAngle;

    series.forEach((serie, index) => {
      startRadianAngle = endRadianAngle;
      endRadianAngle = startRadianAngle + this.calculateAngle(serie.data, totalValue);

      const coordinates = this.calculateCoordinates(height, startRadianAngle, endRadianAngle);

      this.svgPaths.toArray()[index].applyCoordinates(coordinates);
      this.showLabels = true;
    });
  }

  private calculateCoordinatesWithAnimation(
    series: Array<PoPieChartSeries | PoDonutChartSeries>,
    totalValue: number,
    height: number,
    startRadianAngle: number,
    endRadianAngle: number,
    currentRadianAngle: number = 0,
    seriesIndex: number = 0
  ) {
    const finishedCurrentSerie = currentRadianAngle > endRadianAngle;
    const finishedAllSeries = seriesIndex === series.length;

    if (finishedAllSeries) {
      this.animate = false;
      return;
    }

    if (finishedCurrentSerie) {
      this.setSerieLabelCoordinates(seriesIndex);
      currentRadianAngle = 0;
      seriesIndex++;
      startRadianAngle = startRadianAngle + endRadianAngle;
      endRadianAngle =
        seriesIndex < series.length ? this.calculateAngle(series[seriesIndex].data, totalValue) : undefined;
    } else {
      currentRadianAngle += PoChartAngleStepInterval;

      const currentEndRadianAngle = this.calculateCurrentEndAngle(currentRadianAngle, startRadianAngle, endRadianAngle);
      const coordinates = this.calculateCoordinates(height, startRadianAngle, currentEndRadianAngle);

      this.svgPaths.toArray()[seriesIndex].applyCoordinates(coordinates);
    }

    window.requestAnimationFrame(
      this.calculateCoordinatesWithAnimation.bind(
        this,
        series,
        totalValue,
        height,
        startRadianAngle,
        endRadianAngle,
        currentRadianAngle,
        seriesIndex
      )
    );
  }

  private calculateCurrentEndAngle(currentRadianAngle: number, startRadianAngle: number, endRadianAngle: number) {
    const isSerieDrawCompleted = startRadianAngle + currentRadianAngle > startRadianAngle + endRadianAngle;

    return isSerieDrawCompleted
      ? startRadianAngle + endRadianAngle - PoChartCompleteCircle
      : startRadianAngle + currentRadianAngle;
  }

  private initDrawPaths(seriesList: Array<PoPieChartSeries | PoDonutChartSeries>, totalValue: number, height: number) {
    if (!this.animate) {
      this.calculateSerieCoordinates(seriesList, totalValue, height);
    } else {
      const startRadianAngle = PoChartStartAngle;
      const endRadianAngle = this.calculateAngle(seriesList[0].data, totalValue);

      this.ngZone.runOutsideAngular(() =>
        this.calculateCoordinatesWithAnimation(seriesList, totalValue, height, startRadianAngle, endRadianAngle)
      );
    }
  }

  private setSerieLabelCoordinates(index: number) {
    if (this.svgLabels.toArray().length) {
      this.svgLabels.toArray()[index].applyCoordinates(this.seriesLabels[index]);
    }
  }

  private validateSeries(series: Array<PoPieChartSeries | PoDonutChartSeries>) {
    return series.reduce((seriesList, serie, index) => {
      const data = serie.data ?? serie.value;
      if (data && data > 0) {
        const color = this.colorList[index];
        const label = serie.label;
        const tooltip = serie.tooltip;
        const tooltipLabel = this.getTooltipLabel(data, label, tooltip);

        seriesList = [...seriesList, { data, color, label, tooltipLabel }];
      }

      return seriesList;
    }, []);
  }

  protected abstract getTooltipLabel(data, label, tooltip);
  protected abstract calculateCoordinates(height, startRadianAngle, currentEndRadianAngle);
}

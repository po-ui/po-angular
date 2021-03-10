import { ChangeDetectorRef, Component, NgZone, OnChanges, SimpleChanges } from '@angular/core';

import { convertNumberToDecimal } from '../../../../../utils/util';
import { PoDefaultColorsTextBlack } from '../../../../../services/po-color/po-colors.constant';
import { PoChartDonutDefaultThickness, PoChartStartAngle } from '../../../helpers/po-chart-default-values.constant';

import { PoChartCircularComponent } from '../po-chart-circular.component';

@Component({
  selector: '[po-chart-donut]',
  templateUrl: '../po-chart-circular.component.svg'
})
export class PoChartDonutComponent extends PoChartCircularComponent implements OnChanges {
  private readonly poChartBlackColor = '#000000';
  private readonly poChartWhiteColor = '#ffffff';

  /* istanbul ignore next */
  constructor(ngZone: NgZone, changeDetector: ChangeDetectorRef) {
    super(ngZone, changeDetector);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.series || changes.containerSize || changes.options) {
      this.drawSeries(this.series, this.containerSize.svgHeight);
      this.applySeriesLabels(this.seriesList, this.containerSize.svgHeight);
    }
  }

  protected calculateCoordinates(height: number, startRadianAngle: number, endRadianAngle: number) {
    const radius = height / 2;

    const innerRadius = this.getInnerRadius(radius);

    const sinAlpha = Math.sin(startRadianAngle);
    const cosAlpha = Math.cos(startRadianAngle);

    const sinBeta = Math.sin(endRadianAngle);
    const cosBeta = Math.cos(endRadianAngle);

    const startX = radius + cosAlpha * radius;
    const startY = radius + sinAlpha * radius;

    const endX = radius + cosBeta * radius;
    const endY = radius + sinBeta * radius;

    const startInnerX = radius + cosAlpha * innerRadius;
    const startInnerY = radius + sinAlpha * innerRadius;

    const endInnerX = radius + cosBeta * innerRadius;
    const endInnerY = radius + sinBeta * innerRadius;

    const largeArc = endRadianAngle - startRadianAngle > Math.PI;

    this.verifyDisplayLabels(radius, innerRadius);

    return [
      'M',
      startX,
      startY,
      'A',
      radius,
      radius,
      0,
      largeArc ? '1,1' : '0,1',
      endX,
      endY,
      'L',
      endInnerX,
      endInnerY,
      'A',
      innerRadius,
      innerRadius,
      0,
      largeArc ? '1,0' : '0,0',
      startInnerX,
      startInnerY,
      'Z'
    ].join(' ');
  }

  protected getTooltipLabel(data: number, label?: string, tooltipLabel?: string) {
    const dataLabel = label ? `${label}: ` : '';
    const dataValue = this.getPercentValue(data, this.totalValue) + '%';

    return tooltipLabel || `${dataLabel}${dataValue}`;
  }

  private applySeriesLabels(seriesList: Array<any>, height: number) {
    let startRadianAngle = PoChartStartAngle;
    let endRadianAngle = PoChartStartAngle;

    this.seriesLabels = seriesList.map(serie => {
      startRadianAngle = endRadianAngle;
      endRadianAngle = startRadianAngle + this.calculateAngle(serie.data, this.totalValue);

      const label = this.getPercentValue(serie.data, this.totalValue) + '% ';
      const color = this.getTextColor(serie.color);
      const coordinates = this.calculateLabelCoordinates(height, startRadianAngle, endRadianAngle);

      return { ...coordinates, label, color };
    });
  }

  private calculateLabelCoordinates(height: number, startRadianAngle: number, endRadianAngle: number) {
    const radius = height / 2;
    const innerRadius = this.getInnerRadius(radius);

    const sliceCenterAngle = (startRadianAngle + endRadianAngle) / 2;
    const labelRadius = innerRadius + (radius - innerRadius) / 2;

    const xCoordinate = labelRadius * Math.cos(sliceCenterAngle) + radius;
    const yCoordinate = labelRadius * Math.sin(sliceCenterAngle) + radius;

    return { xCoordinate, yCoordinate };
  }

  private getInnerRadius(radius: number): number {
    const defaultInnerRadius = radius - PoChartDonutDefaultThickness;

    return this.innerRadius >= 0 ? (this.innerRadius / 100) * radius : defaultInnerRadius;
  }

  private getPercentValue(value: number, totalValue: number) {
    const percentValue = (value / totalValue) * 100;
    const floatPercentValue = convertNumberToDecimal(percentValue, 2);

    return String(floatPercentValue).replace('.', ',');
  }

  private getTextColor(color: string) {
    if (PoDefaultColorsTextBlack.includes(color)) {
      return this.poChartBlackColor;
    }

    return this.poChartWhiteColor;
  }

  private verifyDisplayLabels(radius: number, innerRadius: number): void {
    this.canDisplayLabels = radius - innerRadius >= radius - (radius - PoChartDonutDefaultThickness);
  }
}

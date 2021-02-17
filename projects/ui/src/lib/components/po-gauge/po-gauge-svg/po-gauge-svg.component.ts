import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { PoGaugePointerEnd, PoGaugeThickness, poGaugeTotalValueDefault } from '../po-gauge-default-values.constant';

import { PoDefaultColors } from '../../../services/po-color/po-colors.constant';

import { PoGaugeCoordinates } from '../interfaces/po-gauge-coordinates.interface';
import { PoGaugeRanges } from '../interfaces/po-gauge-ranges.interface';
import { PoGaugeSvgContainer } from '../interfaces/po-gauge-svg-container.interface';

export const poGaugeStartAngle = -Math.PI;

@Component({
  selector: 'po-gauge-svg',
  templateUrl: './po-gauge-svg.component.html'
})
export class PoGaugeSvgComponent implements OnChanges {
  addSvgElement: boolean = false;
  baseCoordinates: PoGaugeCoordinates;
  coordinates: Array<PoGaugeCoordinates>;
  pointerCoordinates: PoGaugeCoordinates;
  viewBox: string;

  @Input('p-container') container: PoGaugeSvgContainer;

  @Input('p-ranges') ranges: Array<PoGaugeRanges>;

  @Input('p-value') value: number;

  get hasRanges(): boolean {
    return this.ranges.length > 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((this.container && changes.value) || (this.container && changes.ranges) || this.container) {
      this.setCoordinates(this.value, this.ranges, this.container);
    }
  }

  private setCoordinates(value: number, ranges: Array<PoGaugeRanges>, container: PoGaugeSvgContainer): void {
    const { height } = container;

    // Adiciona elemento svg somente após calcular a altura do container pois o svg tem altura default de 150px.
    this.addSvgElement = true;
    this.setViewBox(height);
    this.setBaseCoordinates(height);

    if (!ranges.length) {
      this.setSingleRangeCoordinates(height, value);
      return;
    }
    this.setRangesCoordinates(height, value, ranges);
  }

  private setBaseCoordinates(height: PoGaugeSvgContainer['height']): void {
    const endAngleRadian = 0;
    const coordinates = this.calculateCoordinates(height, poGaugeStartAngle, endAngleRadian);

    this.baseCoordinates = { coordinates };
  }

  private setRangesCoordinates(height: number, value: number = 0, ranges: Array<PoGaugeRanges>): void {
    const { minRange, maxRange } = this.calculateMinAndMaxValues(ranges);

    const minValue = value < minRange ? value : minRange;
    const maxValue = value > maxRange ? value : maxRange;

    this.setPointerCoordinates(height, value, maxValue, minValue);

    // `.reverse()` no término da iteração para tratar a sobreposicão correta das bordas arredondadas dos ranges.
    const rangesCoordinates = ranges
      .map((range: PoGaugeRanges) => {
        const from = range.from ?? 0;
        const to = range.to ?? maxRange;
        const startAngleRadian = poGaugeStartAngle + this.calculateAngleRadius(from, maxValue, minValue);
        const endAngleRadian = poGaugeStartAngle + this.calculateAngleRadius(to, maxValue, minValue);

        const coordinates = this.calculateCoordinates(height, startAngleRadian, endAngleRadian);

        return { coordinates, color: range.color };
      })
      .reverse();

    this.coordinates = rangesCoordinates;
  }

  private setSingleRangeCoordinates(height: PoGaugeSvgContainer['height'], value: number): void {
    const verifiedValue = value > 100 ? 100 : value;

    const endAngleRadian = poGaugeStartAngle + this.calculateAngleRadius(verifiedValue, poGaugeTotalValueDefault);

    const coordinates = value > 0 ? this.calculateCoordinates(height, poGaugeStartAngle, endAngleRadian) : undefined;
    const color = PoDefaultColors[0][0];
    this.coordinates = [{ coordinates, color }];
  }

  private setPointerCoordinates(height: number, value: number, maxValue: number, minValue: number) {
    const coordinates = this.calculatePointerInitialCoordinates(height, poGaugeStartAngle);
    const pointerDegrees = this.pointerRotation(value, maxValue, minValue);

    this.pointerCoordinates = { ...coordinates, pointerDegrees };
  }

  private pointerRotation(value: number, maxValue: number, minValue: number) {
    const percent = this.convertValueToPercentage(value, maxValue, minValue);
    // valores referentes às angulações mínimas e máximas do ponteiro.
    const minRotation = 0;
    const maxRotation = 180;

    return (percent * (maxRotation - minRotation)) / 100 + minRotation;
  }

  private calculatePointerInitialCoordinates(height: number, startAngleRadian: number) {
    const radius = height - PoGaugePointerEnd - PoGaugeThickness / 2;

    // Valor que representa a escala do ponteiro para plotagem.
    const scale = 40;
    const pointerScaledWidth = radius / scale;
    const pointerScaledBorderRadius = radius / (scale * 2);

    const sinAlpha = Math.sin(startAngleRadian);
    const cosAlpha = Math.cos(startAngleRadian);

    const targetX = radius + cosAlpha * radius;
    const targetY = radius + sinAlpha * radius;

    const startX = radius;
    const startY = radius + pointerScaledWidth;

    const endX = radius;
    const endY = radius - pointerScaledWidth;

    const coordinates = [
      'M',
      startX,
      startY,
      'L',
      targetX,
      targetY + pointerScaledBorderRadius,
      'A',
      1,
      1,
      0,
      '0,1',
      targetX,
      targetY - pointerScaledBorderRadius,
      'L',
      endX,
      endY,
      'Z'
    ].join(' ');

    return { coordinates, radius };
  }

  private calculateCoordinates(
    height: PoGaugeSvgContainer['height'],
    startAngleRadian: number,
    endAngleRadian: number
  ): PoGaugeCoordinates['coordinates'] {
    // Subtrai altura pelo excedente ponteiro em relação ao gráfico, pela metade do valor da coroa circular.
    const radius = height - PoGaugePointerEnd - PoGaugeThickness / 2;
    const innerRadius = radius - PoGaugeThickness;

    const sinAlpha = Math.sin(startAngleRadian);
    const cosAlpha = Math.cos(startAngleRadian);

    const sinBeta = Math.sin(endAngleRadian);
    const cosBeta = Math.cos(endAngleRadian);

    const startX = Math.round(radius + cosAlpha * radius);
    const startY = Math.round(radius + sinAlpha * radius);

    const endX = Math.round(radius + cosBeta * radius);
    const endY = Math.round(radius + sinBeta * radius);

    const startInnerX = Math.round(radius + cosAlpha * innerRadius);
    const startInnerY = Math.round(radius + sinAlpha * innerRadius);

    const endInnerX = Math.round(radius + cosBeta * innerRadius);
    const endInnerY = Math.round(radius + sinBeta * innerRadius);

    return [
      'M',
      startX,
      startY,
      'A',
      radius,
      radius,
      0,
      '0,1',
      endX,
      endY,
      'A',
      1,
      1,
      0,
      '0,1',
      endInnerX,
      endInnerY,
      'A',
      innerRadius,
      innerRadius,
      0,
      '0,0',
      startInnerX,
      startInnerY,
      'A',
      1,
      1,
      0,
      '0,1',
      startX,
      startY,
      'Z'
    ].join(' ');
  }

  private calculateAngleRadius(value: number, maxValue: number, minValue: number = 0): number {
    const angle = ((value - minValue) / (maxValue - minValue)) * (Math.PI * 2);

    return angle / 2;
  }

  private convertValueToPercentage(value: number, maxValue: number, minValue): number {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  }

  private setViewBox(height: number): void {
    const width = this.calculateDiameter(height);

    this.viewBox = `0 ${-PoGaugePointerEnd} ${width} ${height}`;
  }

  private calculateDiameter(height: number): number {
    const radius = height - PoGaugePointerEnd - PoGaugeThickness / 2;

    return radius + Math.cos(0) * radius;
  }

  private calculateMinAndMaxValues(ranges: Array<PoGaugeRanges>) {
    const minRange = this.getDomain(ranges, 'min');
    const maxRange = this.getDomain(ranges, 'max');

    return {
      minRange: this.verifyIfFloatOrInteger(minRange) ? minRange : 0,
      maxRange: this.verifyIfFloatOrInteger(maxRange) ? maxRange : 100
    };
  }

  private verifyIfFloatOrInteger(number: number) {
    const notABoolean = typeof number !== 'boolean';
    const notInfinity = number !== Infinity;

    const isInteger = Number(number) === number && number % 1 === 0 && notInfinity;
    const isFloat = Number(number) === number && number % 1 !== 0 && notInfinity;

    return (notABoolean && isInteger) || (notABoolean && isFloat);
  }

  private getDomain(ranges: Array<PoGaugeRanges>, type: string): number {
    const rangeType = { min: 'from', max: 'to' };

    return Math[type](...ranges.map(range => range[rangeType[type]]));
  }
}

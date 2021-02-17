/* tslint:disable:use-type-alias */

import { Directive, ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

import { convertNumberToDecimal } from '../../../../utils/util';

import {
  poChartAngleStepInterval,
  poChartCompleteCircle,
  poChartDonutSerieWidth,
  poChartGaugeSerieWidth,
  poChartStartAngle
} from './po-chart-circular.constant';
import { PoDefaultColorsTextBlack } from '../../../../services/po-color/po-colors.constant';

import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';
import { PoChartGaugeSerie } from '../po-chart-gauge/po-chart-gauge-series.interface';
import { PoChartType } from '../../enums/po-chart-type.enum';

const poChartBlackColor = '#000000';
const poChartWhiteColor = '#ffffff';

@Directive()
export class PoChartCircular extends PoChartDynamicTypeComponent implements OnDestroy, OnInit {
  chartItemStartAngle = poChartStartAngle;
  windowResizeEmitter: Subject<any> = new Subject();

  private animationRunning: boolean;
  private chartItemEndAngle: number;
  private chartItemsEndAngleList: Array<number> = [];
  private svgPathElementsList: Array<string> = [];
  private svgTextElementsList: Array<string> = [];

  constructor(protected el: ElementRef, private ngZone: NgZone, private renderer: Renderer2) {
    super();
  }

  ngOnDestroy() {
    this.removeWindowResizeListener();
    this.removeWindowScrollListener();
    this.animationRunning = false;
  }

  ngOnInit() {
    this.chartInitSetup();
    this.setEventListeners();
  }

  removeTooltip() {
    if (this.tooltipElement) {
      this.renderer.addClass(this.tooltipElement, 'po-invisible');
    }
  }

  protected drawPath(path, chartItemStartAngle, chartItemEndAngle) {
    const sinAlpha = Math.sin(chartItemStartAngle);
    const cosAlpha = Math.cos(chartItemStartAngle);

    const sinBeta = Math.sin(chartItemEndAngle);
    const cosBeta = Math.cos(chartItemEndAngle);

    const startX = this.centerX + cosAlpha * this.centerX;
    const startY = this.centerX + sinAlpha * this.centerX;

    const endX = this.centerX + cosBeta * this.centerX;
    const endY = this.centerX + sinBeta * this.centerX;

    const startInnerX = this.centerX + cosAlpha * this.innerRadius;
    const startInnerY = this.centerX + sinAlpha * this.innerRadius;

    const endInnerX = this.centerX + cosBeta * this.innerRadius;
    const endInnerY = this.centerX + sinBeta * this.innerRadius;

    const halfGaugeCoordinates = [
      'M',
      startX,
      startY,
      'A',
      this.centerX,
      this.centerX,
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
      this.innerRadius,
      this.innerRadius,
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

    return path.setAttribute('d', halfGaugeCoordinates);
  }

  protected getSeriesWithValue(series: Array<PoChartGaugeSerie>) {
    const newSeries = [];

    series.forEach((serie: any, index) => {
      const value = serie.data ?? serie.value;
      if (value > 0) {
        newSeries.push({ ...serie, color: this.colors[index] });
      }
    });

    return newSeries;
  }

  private animationSetup() {
    this.chartItemEndAngle = this.chartItemsEndAngleList[0];
    this.animationRunning = true;
    this.drawPathInit();
  }

  private appendGaugeBackgroundPathElement(svgPathsWrapper: any) {
    const svgPath = this.renderer.createElement('svg:path', 'svg');
    this.renderer.setAttribute(svgPath, 'class', 'po-chart-gauge-base-path');
    svgPathsWrapper.appendChild(svgPath);
    this.renderer.appendChild(this.svgElement, svgPathsWrapper);
  }

  private calculateAngleRadians() {
    this.series.forEach((serie, index) => {
      const data = serie.data ?? serie.value;
      this.chartItemsEndAngleList[index] = this.calculateEndAngle(data, this.totalValue);
    });
  }

  private calculateCurrentEndAngle(angleCurrentPosition: number) {
    const isSerieDrawCompleted =
      this.chartItemStartAngle + angleCurrentPosition > this.chartItemStartAngle + this.chartItemEndAngle;

    if (isSerieDrawCompleted) {
      return this.chartItemStartAngle + this.chartItemEndAngle - poChartCompleteCircle;
    } else {
      return this.chartItemStartAngle + angleCurrentPosition;
    }
  }

  private calculateEndAngle(value: number, totalValue: number): number {
    const endAngle = (value / totalValue) * (Math.PI * 2);

    return this.isChartGaugeType ? endAngle / 2 : endAngle;
  }

  private calculateSVGDimensions() {
    this.calculateSVGContainerDimensions(this.chartWrapper, this.chartHeader, this.chartLegend);

    this.innerRadius = this.setInnerRadius(this.type);
  }

  private changeTooltipPosition(event: MouseEvent) {
    if (this.tooltipElement && this.tooltipElement.classList.contains('po-invisible')) {
      this.showTooltip();
    }

    const tooltipPositions = this.setTooltipPositions(event);
    this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipPositions.left}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${tooltipPositions.top}px`);
  }

  private chartInitSetup() {
    this.calculateSVGDimensions();
    this.calculateTotalValue();
    this.calculateAngleRadians();
    this.createSVGElements();
    this.animationSetup();
  }

  private checkingIfScrollsWithPoPage() {
    const poPageContent = document.getElementsByClassName('po-page-content');

    return poPageContent.length ? poPageContent[0] : window;
  }

  private createPath(serie: PoChartGaugeSerie, svgPathsWrapper: any) {
    const svgPath = this.renderer.createElement('svg:path', 'svg');

    this.renderer.setAttribute(svgPath, 'class', 'po-path-item');
    this.renderer.setAttribute(svgPath, 'fill', serie.color);

    this.setElementAttributes(svgPath, serie);

    svgPathsWrapper.appendChild(svgPath);

    this.renderer.appendChild(this.svgElement, svgPathsWrapper);

    this.svgPathElementsList.push(svgPath);
  }

  private createPaths() {
    const svgPathsWrapper = this.renderer.createElement('svg:g', 'svg');

    if (this.isChartGaugeType) {
      this.appendGaugeBackgroundPathElement(svgPathsWrapper);
      // Tratamento para evitar que o path desenhe os arcos referentes ao border radius do path.
      if (this.isSerieValueEqualZero()) {
        return;
      }
    }

    this.series.forEach(serie => this.createPath(serie, svgPathsWrapper));
  }

  private createText(serie: PoChartGaugeSerie) {
    const data = serie.value;

    const svgG = this.renderer.createElement('svg:g', 'svg');
    const svgText = this.renderer.createElement('svg:text', 'svg');

    const fontSize = this.getFontSize();
    const textColor = this.getTextColor(serie.color);

    svgText.textContent = this.getPercentValue(data, this.totalValue) + '%';

    this.renderer.setAttribute(svgText, 'class', 'po-path-item');
    this.renderer.setAttribute(svgText, 'fill', textColor);
    this.renderer.setAttribute(svgText, 'font-size', fontSize);
    this.renderer.setAttribute(svgText, 'fill-opacity', '0');

    this.setElementAttributes(svgText, serie);

    this.renderer.appendChild(svgG, svgText);

    this.renderer.appendChild(this.svgElement, svgG);
    this.svgTextElementsList.push(svgText);
  }

  private createTexts() {
    if (this.type === PoChartType.Donut) {
      this.series.forEach(serie => this.createText(serie));
    }
  }

  private createSVGElements() {
    const viewBoxHeight = this.isChartGaugeType
      ? this.centerX + this.centerX * poChartGaugeSerieWidth
      : this.chartWrapper;
    const preserveAspectRatio = this.isChartGaugeType ? 'xMidYMax' : 'xMidYMin';

    this.svgElement = this.renderer.createElement('svg:svg', 'svg');

    this.renderer.setAttribute(this.svgElement, 'viewBox', `0 0 ${this.chartWrapper} ${viewBoxHeight}`);
    this.renderer.setAttribute(this.svgElement, 'preserveAspectRatio', `${preserveAspectRatio} meet`);
    this.renderer.setAttribute(this.svgElement, 'class', 'po-chart-svg-element');
    this.renderer.setAttribute(this.svgElement, 'width', `${this.centerX}`);
    this.renderer.setAttribute(this.svgElement, 'height', `${this.svgHeight}`);

    this.svgContainer.nativeElement.appendChild(this.svgElement);

    this.createPaths();
    this.createTexts();
  }

  private drawPathInit() {
    if (!this.animationRunning) {
      return;
    } else {
      this.ngZone.runOutsideAngular(() => this.drawSeries());
    }
  }

  private drawSeries(currentSerieIndex: number = 0, angleCurrentPosition: number = 0) {
    const isFinishedDrawingCurrentSeries = angleCurrentPosition > this.chartItemEndAngle;
    const isFinishedDrawingAllSeries = currentSerieIndex === this.svgPathElementsList.length;

    if (isFinishedDrawingAllSeries) {
      return;
    }

    if (isFinishedDrawingCurrentSeries) {
      this.chartItemStartAngle = this.chartItemStartAngle + this.chartItemEndAngle;
      currentSerieIndex++;
      this.chartItemEndAngle = this.chartItemsEndAngleList[currentSerieIndex];
      angleCurrentPosition = 0;
    } else {
      angleCurrentPosition += poChartAngleStepInterval;

      this.drawPath(
        this.svgPathElementsList[currentSerieIndex],
        this.chartItemStartAngle,
        this.calculateCurrentEndAngle(angleCurrentPosition)
      );

      this.setTextProperties(
        this.svgTextElementsList[currentSerieIndex],
        this.chartItemStartAngle,
        this.calculateCurrentEndAngle(angleCurrentPosition)
      );
    }

    window.requestAnimationFrame(this.drawSeries.bind(this, currentSerieIndex, angleCurrentPosition));
  }

  private emitEventOnEnter(event: PoChartGaugeSerie) {
    this.onSerieHover.next(event);
  }

  private getFontSize() {
    const fontSizePorcent = 0.04;

    const fontSize = fontSizePorcent * this.chartWrapper;

    return `${fontSize.toFixed(0)}px`;
  }

  private getPercentValue(value: number, totalValue: number) {
    const percentValue = (value / totalValue) * 100;

    const floatPercentValue = convertNumberToDecimal(percentValue, 2);

    return String(floatPercentValue).replace('.', ',');
  }

  private getTextColor(color: string) {
    if (PoDefaultColorsTextBlack.includes(color)) {
      return poChartBlackColor;
    }

    return poChartWhiteColor;
  }

  private getTooltipValue(value: number) {
    if (this.type === PoChartType.Pie) {
      return value.toString();
    }

    return this.getPercentValue(value, this.totalValue) + '%';
  }

  private isSerieValueEqualZero(): boolean {
    return this.series.length && this.series[0].value === 0;
  }

  private onMouseClick() {
    let serieOnClick: PoChartGaugeSerie;

    const { color, ...serie } = this.series[0];
    serieOnClick = serie;

    this.onSerieClick.next(serieOnClick);
  }

  private onMouseEnter(event) {
    let serieOnEnter: PoChartGaugeSerie;

    const { color, ...serie } = this.series[0];

    this.chartElementDescription = event.target.getAttributeNS(null, 'data-tooltip-category');
    serieOnEnter = serie;

    this.emitEventOnEnter(serieOnEnter);
  }

  private onWindowResize() {
    this.calculateSVGDimensions();
    this.renderer.setAttribute(this.svgElement, 'width', `${this.centerX}`);
    this.renderer.setAttribute(this.svgElement, 'height', `${this.svgHeight}`);
    this.windowResizeEmitter.next();
  }

  private removeWindowResizeListener() {
    if (this.windowResizeListener) {
      this.windowResizeListener();
    }
  }

  private removeWindowScrollListener() {
    if (this.windowScrollListener) {
      this.windowScrollListener();
    }
  }

  private setEventListeners() {
    let chartSeries: Array<string> = this.el.nativeElement.querySelectorAll('.po-path-item');
    chartSeries = Array.from(chartSeries);
    chartSeries.forEach(serie => {
      this.renderer.listen(serie, 'click', this.onMouseClick.bind(this));
      this.renderer.listen(serie, 'mouseenter', this.onMouseEnter.bind(this));

      if (!this.isChartGaugeType) {
        this.renderer.listen(serie, 'mousemove', this.changeTooltipPosition.bind(this));
        this.renderer.listen(serie, 'mouseleave', this.removeTooltip.bind(this));
      }
    });

    this.windowResizeListener = this.renderer.listen(window, 'resize', this.onWindowResize.bind(this));
    this.windowScrollListener = this.renderer.listen(
      this.checkingIfScrollsWithPoPage(),
      'scroll',
      this.removeTooltip.bind(this)
    );
  }

  private setInnerRadius(type: PoChartType) {
    let serieWidth;

    switch (type) {
      case PoChartType.Donut: {
        serieWidth = poChartDonutSerieWidth;

        break;
      }
      case PoChartType.Gauge: {
        serieWidth = poChartGaugeSerieWidth;
        break;
      }
      case PoChartType.Pie: {
        return 0;
      }
    }

    return this.centerX - this.centerX * serieWidth;
  }

  private setTextProperties(text, startAngle: number, endAngle: number) {
    // necessário text.getClientRects().length para contornar erro de console causado no Firefox
    if (this.type === PoChartType.Donut && text.getClientRects().length) {
      // utilizado para recuperar o angulo do meio, entre o inicio e fim para centralizar o texto
      const centerAngle = (startAngle + endAngle) / 2;
      const textBox = text.getBBox();

      const halfTextWidth = textBox.width / 2;
      const halfTextHeight = textBox.height / 2;

      // radius interno (circulo branco) + a metade da diferença entre tamanho do centro e radius interno
      const radius = this.innerRadius + (this.centerX - this.innerRadius) / 2;

      const xCoordinate = radius * Math.cos(centerAngle) + this.centerX - halfTextWidth;
      const yCoordinate = radius * Math.sin(centerAngle) + this.centerX + halfTextHeight / 2;
      text.setAttribute('x', xCoordinate);
      text.setAttribute('y', yCoordinate);
      text.setAttribute('fill-opacity', '1');
    }
  }

  private setTooltipPositions(event: MouseEvent) {
    const displacement: number = 8;

    return {
      left: event.clientX - this.tooltipElement.offsetWidth / 2,
      top: event.clientY - this.tooltipElement.offsetHeight - displacement
    };
  }

  private setElementAttributes(svgElement, serie) {
    const { tooltip } = serie;
    const data = serie.data ?? serie.value;
    const label = serie.label ?? (serie.description || serie.category);

    this.renderer.setAttribute(svgElement, 'data-tooltip-value', `${data}`);

    if (this.isChartGaugeType) {
      this.renderer.setAttribute(svgElement, 'data-tooltip-description', label);
    } else {
      const tooltipValue = this.getTooltipValue(data);

      this.renderer.setAttribute(svgElement, 'data-tooltip-category', label);
      this.renderer.setAttribute(svgElement, 'data-tooltip-text', tooltip || `${label}: ${tooltipValue}`);
    }
  }

  private showTooltip() {
    this.renderer.removeClass(this.tooltipElement, 'po-invisible');
  }
}

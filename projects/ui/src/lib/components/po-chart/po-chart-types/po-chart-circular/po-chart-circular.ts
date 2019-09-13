import { ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import {
  poChartAngleStepInterval,
  poChartCompleteCircle,
  poChartPadding,
  poChartStartAngle
} from './po-chart-circular.constant';
import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';
import { PoChartType } from '../../enums/po-chart-type.enum';
import { PoCircularChartSeries } from './po-chart-circular-series.interface';
import { PoDonutChartSeries } from '../po-chart-donut/po-chart-donut-series.interface';
import { PoPieChartSeries } from '../po-chart-pie/po-chart-pie-series.interface';
import { PoSeriesTextBlack } from '../../po-chart-colors.constant';

const poChartBlackColor = '#000000';
const poChartWhiteColor = '#ffffff';

export class PoChartCircular extends PoChartDynamicTypeComponent implements OnDestroy, OnInit {

  private animationRunning: boolean;
  private chartItemEndAngle: number;
  private chartItemStartAngle: number;
  private chartItemsEndAngleList: Array<number> = [];
  private svgPathElementsList: Array<string> = [];
  private svgTextElementsList: Array<string> = [];

  private static calculateEndAngle(value: number, totalValue: number): number {
    return value / totalValue * (Math.PI * 2);
  }

  constructor(private el: ElementRef, private ngZone: NgZone, private renderer: Renderer2) {
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

  private animationSetup() {
    this.chartItemStartAngle = poChartStartAngle;
    this.chartItemEndAngle = this.chartItemsEndAngleList[0];
    this.animationRunning = true;
    this.drawPathInit();
  }

  private calculateAngleRadians() {
    this.series.forEach((serie, index) =>
      this.chartItemsEndAngleList[index] = PoChartCircular.calculateEndAngle(serie.value, this.totalValue)
    );
  }

  private calculateCurrentEndAngle(angleCurrentPosition: number) {
    const isSerieDrawCompleted = this.chartItemStartAngle + angleCurrentPosition > this.chartItemStartAngle + this.chartItemEndAngle;

    if (isSerieDrawCompleted) {
      return (this.chartItemStartAngle + this.chartItemEndAngle) - poChartCompleteCircle;
    } else {
      return this.chartItemStartAngle + angleCurrentPosition;
    }
  }

  private calculateSVGDimensions() {
    this.calculateSVGContainerDimensions(this.chartWrapper, this.chartHeader, this.chartLegend);

    this.setInnerRadius();
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

  private createPath(index: number, serie: PoCircularChartSeries, svgPathsWrapper: any) {
    const svgPath = this.renderer.createElement('svg:path', 'svg');

    this.renderer.setAttribute(svgPath, 'class', 'po-path-item');
    this.renderer.setAttribute(svgPath, 'fill', this.colors[index]);

    this.setTooltipAttributes(svgPath, serie);

    svgPathsWrapper.appendChild(svgPath);

    this.renderer.appendChild(this.svgElement, svgPathsWrapper);

    this.svgPathElementsList.push(svgPath);
  }

  private createPaths() {
    const svgPathsWrapper = this.renderer.createElement('svg:g', 'svg');

    this.series.forEach((serie, index) => this.createPath(index, serie, svgPathsWrapper));
  }

  private createText(index: number, serie: PoCircularChartSeries) {
    const { value } = serie;

    const svgG = this.renderer.createElement('svg:g', 'svg');
    const svgText = this.renderer.createElement('svg:text', 'svg');

    const fontSize = this.getFontSize();
    const textColor = this.getTextColor(this.colors[index]);

    svgText.textContent = this.getPercentValue(value, this.totalValue) + '%' ;

    this.renderer.setAttribute(svgText, 'class', 'po-path-item');
    this.renderer.setAttribute(svgText, 'fill', textColor);
    this.renderer.setAttribute(svgText, 'font-size', fontSize);
    this.renderer.setAttribute(svgText, 'fill-opacity', '0');

    this.setTooltipAttributes(svgText, serie);

    svgG.appendChild(svgText);
    this.renderer.appendChild(this.svgElement, svgG);
    this.svgTextElementsList.push(svgText);
  }

  private createTexts() {
    if (this.type === PoChartType.Donut) {
      this.series.forEach((serie, index) => this.createText(index, serie));
    }
  }

  private createSVGElements() {
    this.svgElement = this.renderer.createElement('svg:svg', 'svg');

    this.renderer.setAttribute(this.svgElement, 'viewBox', `0 0 ${this.chartWrapper} ${this.centerX * 2}`);
    this.renderer.setAttribute(this.svgElement, 'preserveAspectRatio', 'xMidYMin meet');
    this.renderer.setAttribute(this.svgElement, 'class', 'po-chart-svg-element');
    this.renderer.setAttribute(this.svgElement, 'width', `${this.chartWrapper - poChartPadding * 2}`);
    this.renderer.setAttribute(this.svgElement, 'height', `${this.svgHeight}`);

    this.svgContainer.nativeElement.appendChild(this.svgElement);

    this.createPaths();
    this.createTexts();
  }

  private drawPath(path, chartItemStartAngle, chartItemEndAngle) {
    const largeArc = chartItemEndAngle - chartItemStartAngle > Math.PI;

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

    const pathCoordinates = [
      'M', startX, startY,
      'A', this.centerX, this.centerX, 0, largeArc ? '1,1' : '0,1', endX, endY,
      'L', endInnerX, endInnerY,
      'A', this.innerRadius, this.innerRadius, 0, largeArc ? '1,0' : '0,0', startInnerX, startInnerY,
      'Z'].join(' ');

    return path.setAttribute('d', pathCoordinates);
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

    if ( isFinishedDrawingAllSeries ) {
      return;
    }

    if ( isFinishedDrawingCurrentSeries ) {

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
        this.calculateCurrentEndAngle(angleCurrentPosition));
    }

    window.requestAnimationFrame(this.drawSeries.bind(this, currentSerieIndex, angleCurrentPosition));

  }

  private emitEventOnEnter(event: PoCircularChartSeries) {
    this.onSerieHover.next(event);
  }

  private getFontSize() {
    const fontSizePorcent = 0.04;

    const fontSize = fontSizePorcent * this.chartWrapper;

    return `${fontSize.toFixed(0)}px`;
  }

  private getPercentValue(value: number, totalValue: number) {
    const percentValue = (value / totalValue) * 100;

    // caso tiver mais que duas casas decimais, fixa até duas, ex: 10.6575 => 10.65
    // se não retorna o valor com parsefloat que remove casa decimal desencessaria, ex: 10.60 => 10.6
    const floatPercentValue = this.isMoreThanTwoDecimalsPlaces(percentValue) ?
      parseFloat(percentValue.toFixed(2)) : parseFloat(<any> percentValue);

    return String(floatPercentValue).replace('.', ',');
  }

  private getTextColor(color: string) {
    if (PoSeriesTextBlack.includes(color)) {
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

  private isMoreThanTwoDecimalsPlaces(value: number = 0) {
    const [, valueAfterDot ] = value.toString().split('.');

    return valueAfterDot && valueAfterDot.length > 2;
  }

  private onMouseClick() {
    const serieOnClick: PoCircularChartSeries = { category: this.chartElementCategory, value: this.chartElementValue };

    this.onSerieClick.next(serieOnClick);
  }

  private onMouseEnter(event) {
    this.tooltipElement = this.chartBody.nativeElement.lastChild;
    this.chartElementCategory = event.target.getAttributeNS(null, 'data-tooltip-category');
    this.chartElementValue = event.target.getAttributeNS(null, 'data-tooltip-value');
    this.tooltipText = event.target.getAttributeNS(null, 'data-tooltip-text');
    this.showTooltip();
    this.changeTooltipPosition(event);

    const serieOnEnter = { category: this.chartElementCategory, value: this.chartElementValue };
    this.emitEventOnEnter(serieOnEnter);
  }

  private onWindowResize() {
    this.calculateSVGDimensions();
    this.renderer.setAttribute(this.svgElement, 'width', `${this.chartWrapper - poChartPadding * 2}`);
    this.renderer.setAttribute(this.svgElement, 'height', `${this.svgHeight}`);
  }

  private removeTooltip() {
    if (this.tooltipElement) {
      this.renderer.addClass(this.tooltipElement, 'po-invisible');
    }
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
      this.renderer.listen(serie, 'mousemove', this.changeTooltipPosition.bind(this));
      this.renderer.listen(serie, 'mouseleave', this.removeTooltip.bind(this));
    });

    this.windowResizeListener = this.renderer.listen(window, 'resize', this.onWindowResize.bind(this));
    this.windowScrollListener = this.renderer.listen(this.checkingIfScrollsWithPoPage(), 'scroll', this.removeTooltip.bind(this));
  }

  private setInnerRadius() {
    // tamanho da largua da serie proporcional ao grafico, o valor 0.27 fica proximo de 32px
    const serieWidth = 0.27;

    this.innerRadius = this.type === PoChartType.Pie ? 0 : this.centerX - (this.centerX * serieWidth);
  }

  private setTextProperties(text, startAngle: number, endAngle: number) {
    if (this.type === PoChartType.Donut) {
      // utilizado para recuperar o angulo do meio, entre o inicio e fim para centralizar o texto
      const centerAngle = (startAngle + endAngle) / 2;
      const textBox = text.getBBox();

      const halfTextWidth = textBox.width / 2;
      const halfTextHeight = textBox.height / 2;

      // radius interno (circulo branco) + a metade da diferença entre tamanho do centro e radius interno
      const radius = this.innerRadius + (this.centerX - this.innerRadius) / 2;

      const xCoordinate = radius * Math.cos(centerAngle) + this.centerX - (halfTextWidth);
      const yCoordinate = radius * Math.sin(centerAngle) + this.centerX + (halfTextHeight / 2);

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

  private setTooltipAttributes(svgElement, serie: PoPieChartSeries | PoDonutChartSeries) {
    const { value, category, tooltip } = serie;

    const tooltipValue = this.getTooltipValue(value);

    this.renderer.setAttribute(svgElement, 'data-tooltip-category', category);
    this.renderer.setAttribute(svgElement, 'data-tooltip-value', `${value}`);
    this.renderer.setAttribute(svgElement, 'data-tooltip-text', tooltip || `${category}: ${tooltipValue}`);
  }

  private showTooltip() {
    this.renderer.removeClass(this.tooltipElement, 'po-invisible');
  }

}

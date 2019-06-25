import { Component, ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { poChartAngleStepInterval, poChartCompleteCircle, poChartPadding, poChartStartAngle } from './po-chart-pie.constant';
import { PoChartDynamicTypeComponent } from '../po-chart-dynamic-type.component';
import { PoPieChartSeries } from '../../interfaces/po-chart-series.interface';

@Component({
  selector: 'po-chart-pie',
  templateUrl: './po-chart-pie.component.html'
})
export class PoChartPieComponent extends PoChartDynamicTypeComponent implements OnDestroy, OnInit {

  private animationRunning: boolean;
  private chartItemEndAngle: number;
  private chartItemStartAngle: number;
  private chartItemsEndAngleList: Array<number> = [];
  private svgPathElementsList: Array<string> = [];

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
      this.chartItemsEndAngleList[index] = PoChartPieComponent.calculateEndAngle(serie.value, this.totalValue)
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

  private changeTooltipPosition(event: MouseEvent) {
    if (this.tooltipElement && this.tooltipElement.classList.contains('po-invisible')) {
      this.showTooltip();
    }

    const tooltipPositions = this.setTooltipPositions(event);
    this.renderer.setStyle(this.tooltipElement, 'left', `${tooltipPositions.left}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${tooltipPositions.top}px`);
  }

  private chartInitSetup() {
    this.calculateSVGContainerDimensions(this.chartWrapper, this.chartHeader, this.chartLegend);
    this.calculateTotalValue();
    this.calculateAngleRadians();
    this.createSVGElements();
    this.animationSetup();
  }

  private createPath(index: number, serie: PoPieChartSeries, svgPathsWrapper: any) {
    const svgPath = this.renderer.createElement('svg:path', 'svg');

    this.renderer.setAttribute(svgPath, 'class', 'po-path-item');
    this.renderer.setAttribute(svgPath, 'fill', this.colors[index]);
    this.renderer.setAttribute(svgPath, 'data-tooltip-category', serie.category);
    this.renderer.setAttribute(svgPath, 'data-tooltip-value', serie.value.toString());
    this.renderer.setAttribute(svgPath, 'data-tooltip-text', serie.tooltip || `${serie.category}: ${serie.value}`);

    svgPathsWrapper.appendChild(svgPath);

    this.renderer.appendChild(this.svgElement, svgPathsWrapper);
    this.svgPathElementsList.push(svgPath);
  }

  private createPaths() {
    const svgPathsWrapper = this.renderer.createElement('svg:g', 'svg');

    this.series.forEach((serie, index) => this.createPath(index, serie, svgPathsWrapper));
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
  }

  private drawPath(path, chartItemStartAngle, chartItemEndAngle) {

    const largeArc = (chartItemEndAngle - chartItemStartAngle) % (Math.PI * 2) > Math.PI ? 1 : 0;
    const startX = this.centerX + Math.cos(chartItemStartAngle) * this.centerX;
    const startY = this.centerX + Math.sin(chartItemStartAngle) * this.centerX;
    const endX = this.centerX + Math.cos(chartItemEndAngle) * this.centerX;
    const endY = this.centerX + Math.sin(chartItemEndAngle) * this.centerX;

    const pathCoordinates = [
      'M', startX, startY,
      'A', this.centerX, this.centerX, 0, largeArc, 1, endX, endY,
      'L', this.centerX, this.centerX,
      'Z'
    ].join(' ');

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
    }

    window.requestAnimationFrame(this.drawSeries.bind(this, currentSerieIndex, angleCurrentPosition));

  }

  private emitEventOnEnter(event: PoPieChartSeries) {
    this.onSerieHover.next(event);
  }

  private onMouseClick() {
    const serieOnClick: PoPieChartSeries = { category: this.chartElementCategory, value: this.chartElementValue };

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
    this.calculateSVGContainerDimensions(this.chartWrapper, this.chartHeader, this.chartLegend);
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

  private checkingIfScrollsWithPoPage() {
    const poPageContent = document.getElementsByClassName('po-page-content');

    return poPageContent.length ? poPageContent[0] : window;
  }

  private setTooltipPositions(event: MouseEvent) {
    const displacement: number = 8;

    return {
      left: event.clientX - this.tooltipElement.offsetWidth / 2,
      top: event.clientY - this.tooltipElement.offsetHeight - displacement
    };
  }

  private showTooltip() {
    this.renderer.removeClass(this.tooltipElement, 'po-invisible');
  }

}

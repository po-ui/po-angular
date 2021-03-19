import { Component, ElementRef, Renderer2 } from '@angular/core';

import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

import { PoChartLineBaseComponent } from '../po-chart-line-base.component';
import { PoChartMathsService } from '../../../services/po-chart-maths.service';
import { PoChartPathCoordinates } from '../../../interfaces/po-chart-path-coordinates.interface';
import { PoChartPointsCoordinates } from '../../../interfaces/po-chart-points-coordinates.interface';

@Component({
  selector: '[po-chart-area]',
  templateUrl: '../po-chart-line.component.svg'
})
export class PoChartAreaComponent extends PoChartLineBaseComponent {
  private currentActiveSerieIndex: number;
  private mouseMoveSubscription$: Subscription;
  private previousActiveSerieIndex: number;

  constructor(
    protected mathsService: PoChartMathsService,
    protected renderer: Renderer2,
    protected elementRef: ElementRef
  ) {
    super(mathsService, renderer, elementRef);
  }

  onEnter(serieIndex: number): void {
    this.applyActiveItem<PoChartPathCoordinates>(this.seriesPathsCoordinates, serieIndex);
    this.initializeListener(serieIndex);
    this.activeTooltip = true;
  }

  onLeave(serieIndex: number): void {
    this.removeListener();
    this.applyActiveItem<PoChartPathCoordinates>(this.seriesPathsCoordinates);
    this.applyActiveItem<PoChartPointsCoordinates>(this.seriesPointsCoordinates[serieIndex], null);
  }

  onSeriePointHover(selectedItem: any) {
    const { relativeTo, ...item } = selectedItem;

    this.pointHover.emit(item);
  }

  private applyActiveItem<T>(list: Array<T>, index?: number): void {
    list.forEach((serie, seriesIndex) => {
      serie['isActive'] = index === undefined ? true : index === seriesIndex;
    });
  }

  private getMouseCoordinates(event: MouseEvent): SVGPoint {
    event.preventDefault();
    const { svgDomMatrix, svgPoint } = this.svgSpace;

    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;

    // Retorna as coordenadas do mouse em relação ao container svg.
    return svgPoint.matrixTransform(svgDomMatrix);
  }

  private initializeListener(serieIndex: number): void {
    let pointPosition: SVGPoint;
    this.previousActiveSerieIndex = undefined;

    this.mouseMoveSubscription$ = fromEvent(this.elementRef.nativeElement, 'mousemove')
      .pipe(
        debounceTime(10),
        tap((event: MouseEvent) => (pointPosition = this.getMouseCoordinates(event))),
        switchMap(() => of(this.verifyActiveArea(pointPosition)))
      )
      .subscribe(activeObjIndex => {
        if (activeObjIndex !== undefined) {
          this.applyActiveItem<PoChartPointsCoordinates>(this.seriesPointsCoordinates[serieIndex], activeObjIndex);
        }
      });
  }

  private removeListener(): void {
    this.mouseMoveSubscription$.unsubscribe();
  }

  private verifyActiveArea(pointPosition: SVGPoint): number {
    const { x } = pointPosition;

    this.currentActiveSerieIndex = this.categoriesCoordinates.findIndex(
      (category, index) =>
        (x >= category && index === this.categoriesCoordinates.length - 1) ||
        (x >= category && x <= this.categoriesCoordinates[index + 1])
    );

    if (this.currentActiveSerieIndex >= 0 && this.currentActiveSerieIndex !== this.previousActiveSerieIndex) {
      this.previousActiveSerieIndex = this.currentActiveSerieIndex;
      return this.currentActiveSerieIndex;
    }

    return undefined;
  }
}

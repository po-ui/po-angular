import { Component, ElementRef, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

import { PoChartLineBaseComponent } from './po-chart-line-base.component';
import { PoChartMathsService } from '../../services/po-chart-maths.service';
import { PoChartPathCoordinates } from '../../interfaces/po-chart-path-coordinates.interface';

@Component({
  selector: '[po-chart-line]',
  templateUrl: './po-chart-line.component.svg',
  standalone: false
})
export class PoChartLineComponent extends PoChartLineBaseComponent implements OnChanges {
  selectedPath: PoChartPathCoordinates;

  constructor(
    protected mathsService: PoChartMathsService,
    protected renderer: Renderer2,
    protected elementRef: ElementRef
  ) {
    super(mathsService, renderer, elementRef);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.insideChart && !this.insideChart) {
      this.seriesPathsCoordinates.forEach(item => (item.isBlur = false));
    }
  }

  onEnter(serieIndex: number) {
    const newPath = this.seriesPathsCoordinates[serieIndex];
    if (this.selectedPath !== newPath) {
      this.onLeave(serieIndex);
      this.selectedPath = newPath;
    }
    if (this.dataLabel?.fixed) {
      this.seriesPathsCoordinates.filter(e => e !== this.selectedPath).map(e => (e.isBlur = true));
    }
    return null;
  }

  onLeave(serieIndex: number) {
    const newPath = this.seriesPathsCoordinates[serieIndex];
    if (this.dataLabel?.fixed && this.selectedPath !== newPath) {
      this.seriesPathsCoordinates.map(e => (e.isBlur = false));
    }
    return null;
  }

  onSeriePointHover(selectedItem: any) {
    const { relativeTo, ...item } = selectedItem;

    this.reorderSVGGroup(relativeTo);
    this.pointHover.emit(item);
  }

  // É necessário reordenar os svgs on hover pois eventualmente os elemntos svg ficam por trás de outros. Não há z-index para svgElement.
  private reorderSVGGroup(pathGroup: string) {
    const pathGroupElement = this.elementRef.nativeElement.querySelectorAll(`.${pathGroup}`);

    this.animate = false;
    this.renderer.appendChild(this.chartLine.nativeElement, pathGroupElement[0]);
  }
}
